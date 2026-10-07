#!/usr/bin/env bash
#
# Radar — one-shot production deploy for Debian-based servers.
#
#   git clone <repo-url> /opt/radar && cd /opt/radar
#   sudo bash DEPLOY.sh --domain radar.example.com
#
# Installs Bun, Caddy and the PocketBase linux binary, creates .env,
# bootstraps the PocketBase superuser + schema, patches the CSP for your
# domains, builds the app, installs systemd units (radar-pb, radar-web,
# radar-worker.timer), configures Caddy vhosts with automatic TLS, and runs
# health checks. Idempotent: safe to re-run to update and redeploy.
#
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PB_VERSION="0.40.4"
PB_URL="https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip"
BUN_INSTALL_DIR="/opt/bun"
SERVICE_USER="radar"

DOMAIN=""
PB_DOMAIN=""
ADMIN_EMAIL="admin@leadradar.local"
ADMIN_PASSWORD=""
RADAR_PASSWORD=""
API_KEY=""
LLM_BASE_URL="http://localhost:11434/v1"
LLM_API_KEY="dummy"
LLM_MODEL="llama3.1"
WORKER_INTERVAL="3min"

usage() {
  cat <<EOF
Usage: sudo bash DEPLOY.sh --domain radar.example.com [options]

Options:
  --domain DOMAIN            Public dashboard domain (required)
  --pb-domain DOMAIN         Public PocketBase domain (default: pb.<domain>)
  --email EMAIL              PocketBase superuser email (default: ${ADMIN_EMAIL})
  --admin-password PASS      PocketBase superuser password (prompted/generated if omitted)
  --radar-password PASS      Dashboard /login password (prompted/generated if omitted)
  --api-key KEY              RADAR_API_KEY (generated if omitted)
  --llm-url URL              LLM OpenAI-compatible base URL (default: ${LLM_BASE_URL})
  --llm-key KEY              LLM API key (default: dummy)
  --llm-model MODEL          LLM model id (default: ${LLM_MODEL})
  --worker-interval SPEC     systemd OnUnitActiveSec for triage (default: ${WORKER_INTERVAL})
  -h, --help                 Show this help
EOF
}

log()  { printf '\033[1;32m[DEPLOY]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[DEPLOY!]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[DEPLOY X]\033[0m %s\n' "$*" >&2; exit 1; }

prompt_secret() { # $1=var name, $2=prompt text
  local val=""
  if [ -t 0 ] && [ -c /dev/tty ]; then
    read -r -s -p "$2 (empty = generate): " val </dev/tty || true
    echo "" >/dev/tty
  fi
  printf '%s' "$val"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --domain) DOMAIN="${2:?}"; shift 2;;
    --pb-domain) PB_DOMAIN="${2:?}"; shift 2;;
    --email) ADMIN_EMAIL="${2:?}"; shift 2;;
    --admin-password) ADMIN_PASSWORD="${2:?}"; shift 2;;
    --radar-password) RADAR_PASSWORD="${2:?}"; shift 2;;
    --api-key) API_KEY="${2:?}"; shift 2;;
    --llm-url) LLM_BASE_URL="${2:?}"; shift 2;;
    --llm-key) LLM_API_KEY="${2:?}"; shift 2;;
    --llm-model) LLM_MODEL="${2:?}"; shift 2;;
    --worker-interval) WORKER_INTERVAL="${2:?}"; shift 2;;
    -h|--help) usage; exit 0;;
    *) die "Unknown option: $1 (see --help)";;
  esac
done

[ "$(id -u)" -eq 0 ] || die "Run as root: sudo bash DEPLOY.sh --domain ..."
[ -f "${APP_DIR}/package.json" ] || die "Run from the radar repo root (package.json not found in ${APP_DIR})."
command -v apt-get >/dev/null || die "apt-get not found — this script targets Debian-based servers."

if [ -z "$DOMAIN" ]; then
  if [ -t 0 ]; then
    read -r -p "Dashboard domain (e.g. radar.example.com): " DOMAIN </dev/tty
  fi
  [ -n "$DOMAIN" ] || die "--domain is required."
fi
[ -z "$PB_DOMAIN" ] && PB_DOMAIN="pb.${DOMAIN}"
[ -z "$ADMIN_PASSWORD" ] && ADMIN_PASSWORD="$(prompt_secret ADMIN_PASSWORD "PocketBase admin password")"
[ -z "$ADMIN_PASSWORD" ] && ADMIN_PASSWORD="$(openssl rand -hex 24)" && GENERATED_ADMIN=1 || GENERATED_ADMIN=0
[ -z "$RADAR_PASSWORD" ] && RADAR_PASSWORD="$(prompt_secret RADAR_PASSWORD "Dashboard login password")"
[ -z "$RADAR_PASSWORD" ] && RADAR_PASSWORD="$(openssl rand -hex 24)" && GENERATED_RADAR=1 || GENERATED_RADAR=0
[ -z "$API_KEY" ] && API_KEY="$(openssl rand -hex 32)"

export DEBIAN_FRONTEND=noninteractive

# ---------------------------------------------------------------- 1. system deps
log "Installing system packages..."
apt-get update -qq
apt-get install -y -qq curl unzip ca-certificates gnupg openssl sqlite3 >/dev/null

if ! command -v caddy >/dev/null 2>&1; then
  log "Installing Caddy (official apt repo)..."
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
    | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
    | tee /etc/apt/sources.list.d/caddy-stable.list >/dev/null
  apt-get update -qq
  apt-get install -y -qq caddy >/dev/null
fi

# ---------------------------------------------------------------- 2. service user
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  log "Creating unprivileged user '${SERVICE_USER}'..."
  useradd --system --create-home --shell /usr/sbin/nologin "$SERVICE_USER"
fi

# ---------------------------------------------------------------- 3. Bun
if [ ! -x /usr/local/bin/bun ]; then
  log "Installing Bun..."
  curl -fsSL https://bun.sh/install | BUN_INSTALL="$BUN_INSTALL_DIR" bash >/dev/null
  ln -sf "${BUN_INSTALL_DIR}/bin/bun" /usr/local/bin/bun
fi
log "Bun: $(/usr/local/bin/bun --version)"

# ---------------------------------------------------------------- 4. PocketBase binary
if [ ! -x "${APP_DIR}/pocketbase/pocketbase" ]; then
  log "Downloading PocketBase v${PB_VERSION} (linux_amd64)..."
  tmpzip="$(mktemp)"
  curl -fsSL -o "$tmpzip" "$PB_URL"
  unzip -o -q "$tmpzip" pocketbase -d "${APP_DIR}/pocketbase"
  chmod +x "${APP_DIR}/pocketbase/pocketbase"
  rm -f "$tmpzip"
fi
"${APP_DIR}/pocketbase/pocketbase" --help >/dev/null 2>&1 \
  || die "PocketBase binary failed to execute."

# ---------------------------------------------------------------- 5. .env
ENV_FILE="${APP_DIR}/.env"
if [ ! -f "$ENV_FILE" ]; then
  log "Creating .env..."
  cat >"$ENV_FILE" <<EOF
POCKETBASE_URL=http://127.0.0.1:8090
NEXT_PUBLIC_POCKETBASE_URL=https://${PB_DOMAIN}
POCKETBASE_ADMIN_EMAIL=${ADMIN_EMAIL}
POCKETBASE_ADMIN_PASSWORD=${ADMIN_PASSWORD}
RADAR_ADMIN_PASSWORD=${RADAR_PASSWORD}
RADAR_API_KEY=${API_KEY}
LLM_BASE_URL=${LLM_BASE_URL}
LLM_API_KEY=${LLM_API_KEY}
LLM_MODEL=${LLM_MODEL}
INPUT_TOKEN_COST_PER_MILLION=0.15
OUTPUT_TOKEN_COST_PER_MILLION=0.60
EOF
else
  log ".env exists — updating browser-facing URL, preserving the rest."
  cp -f "$ENV_FILE" "${ENV_FILE}.bak.$(date +%Y%m%d%H%M%S)"
  if grep -q '^NEXT_PUBLIC_POCKETBASE_URL=' "$ENV_FILE"; then
    sed -i "s|^NEXT_PUBLIC_POCKETBASE_URL=.*|NEXT_PUBLIC_POCKETBASE_URL=https://${PB_DOMAIN}|" "$ENV_FILE"
  else
    printf '\nNEXT_PUBLIC_POCKETBASE_URL=https://%s\n' "$PB_DOMAIN" >>"$ENV_FILE"
  fi
  grep -q '^RADAR_ADMIN_PASSWORD=' "$ENV_FILE" \
    || printf 'RADAR_ADMIN_PASSWORD=%s\n' "$RADAR_PASSWORD" >>"$ENV_FILE"
  # Pick up credentials from the existing file for the steps below.
  set -a; # shellcheck disable=SC1090
  . "$ENV_FILE"; set +a
  ADMIN_EMAIL="${POCKETBASE_ADMIN_EMAIL}"; ADMIN_PASSWORD="${POCKETBASE_ADMIN_PASSWORD}"
fi
chmod 600 "$ENV_FILE"
chown -R "${SERVICE_USER}:${SERVICE_USER}" "$APP_DIR"

as_user() { runuser -u "$SERVICE_USER" -- env HOME="$(getent passwd "$SERVICE_USER" | cut -d: -f6)" "$@"; }

# ---------------------------------------------------------------- 6. deps + schema
log "Installing JS dependencies..."
as_user /usr/local/bin/bun install --cwd "$APP_DIR" --silent

log "Bootstrapping PocketBase (temp instance for setup)..."
as_user "${APP_DIR}/pocketbase/pocketbase" serve --http=127.0.0.1:8090 \
  >>/var/log/radar-pb-setup.log 2>&1 &
PB_PID=$!
for _ in $(seq 1 30); do
  curl -sf -o /dev/null http://127.0.0.1:8090/api/health && break
  sleep 1
done
curl -sf -o /dev/null http://127.0.0.1:8090/api/health \
  || { kill "$PB_PID" 2>/dev/null || true; die "PocketBase did not become healthy."; }

as_user "${APP_DIR}/pocketbase/pocketbase" superuser upsert "$ADMIN_EMAIL" "$ADMIN_PASSWORD"
as_user env POCKETBASE_URL=http://127.0.0.1:8090 \
  POCKETBASE_ADMIN_EMAIL="$ADMIN_EMAIL" POCKETBASE_ADMIN_PASSWORD="$ADMIN_PASSWORD" \
  /usr/local/bin/bun run --cwd "$APP_DIR" setup:pb
kill "$PB_PID" 2>/dev/null || true
wait "$PB_PID" 2>/dev/null || true

# ---------------------------------------------------------------- 7. CSP + build
NEXT_CONFIG="${APP_DIR}/next.config.ts"
if ! grep -q "$PB_DOMAIN" "$NEXT_CONFIG"; then
  log "Patching CSP connect-src for ${PB_DOMAIN}..."
  sed -i "s|ws://localhost:8090\"|ws://localhost:8090 https://${PB_DOMAIN} wss://${PB_DOMAIN}\"|" "$NEXT_CONFIG"
  grep -q "$PB_DOMAIN" "$NEXT_CONFIG" || die "CSP patch failed — edit next.config.ts manually."
else
  log "CSP already covers ${PB_DOMAIN}, skipping patch."
fi

log "Building production bundle..."
as_user /usr/local/bin/bun run --cwd "$APP_DIR" build

# ---------------------------------------------------------------- 8. systemd
log "Installing systemd units..."
cat >/etc/systemd/system/radar-pb.service <<EOF
[Unit]
Description=Radar PocketBase (SQLite)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${APP_DIR}
ExecStart=${APP_DIR}/pocketbase/pocketbase serve --http=127.0.0.1:8090
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat >/etc/systemd/system/radar-web.service <<EOF
[Unit]
Description=Radar Next.js dashboard
After=network-online.target radar-pb.service
Wants=network-online.target
Requires=radar-pb.service

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${APP_DIR}/.env
ExecStart=/usr/local/bin/bun run start -- --port 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

cat >/etc/systemd/system/radar-worker.service <<EOF
[Unit]
Description=Radar triage worker (one-shot)
After=radar-pb.service
Requires=radar-pb.service

[Service]
Type=oneshot
User=${SERVICE_USER}
WorkingDirectory=${APP_DIR}
EnvironmentFile=${APP_DIR}/.env
ExecStart=/usr/local/bin/bun run scripts/worker.ts
EOF

cat >/etc/systemd/system/radar-worker.timer <<EOF
[Unit]
Description=Radar triage worker timer

[Timer]
OnBootSec=2min
OnUnitActiveSec=${WORKER_INTERVAL}
Unit=radar-worker.service

[Install]
WantedBy=timers.target
EOF

systemctl daemon-reload
systemctl enable --now radar-pb.service radar-web.service radar-worker.timer >/dev/null
systemctl restart radar-pb.service radar-web.service

# ---------------------------------------------------------------- 9. Caddy
log "Configuring Caddy vhosts..."
CADDYFILE="/etc/caddy/Caddyfile"
touch "$CADDYFILE"
python3 - "$CADDYFILE" "$DOMAIN" "$PB_DOMAIN" <<'PYEOF'
import sys
path, domain, pb = sys.argv[1], sys.argv[2], sys.argv[3]
block = (
    "# BEGIN RADAR (managed by DEPLOY.sh — do not edit between markers)\n"
    f"{domain} {{\n\treverse_proxy 127.0.0.1:3000\n}}\n"
    f"{pb} {{\n\treverse_proxy 127.0.0.1:8090\n}}\n"
    "# END RADAR\n"
)
text = open(path, encoding="utf-8").read()
start, end = text.find("# BEGIN RADAR"), text.find("# END RADAR")
if start != -1 and end != -1:
    text = text[:start] + text[end + len("# END RADAR"):]
if not text.endswith("\n"):
    text += "\n"
open(path, "w", encoding="utf-8").write(text + "\n" + block)
PYEOF
systemctl enable --now caddy >/dev/null
systemctl reload caddy

# ---------------------------------------------------------------- 10. health checks
log "Waiting for local services..."
for _ in $(seq 1 30); do
  curl -sf -o /dev/null http://127.0.0.1:8090/api/health \
    && curl -sf -o /dev/null http://127.0.0.1:3000/ && break
  sleep 2
done
curl -sf -o /dev/null http://127.0.0.1:8090/api/health || die "PocketBase unhealthy."
curl -sf -o /dev/null http://127.0.0.1:3000/ || die "Next.js unhealthy."

log "Waiting for public HTTPS (TLS issuance can take a minute)..."
for _ in $(seq 1 24); do
  if curl -sf -o /dev/null "https://${DOMAIN}/" \
    && curl -sf -o /dev/null "https://${PB_DOMAIN}/api/health"; then
    break
  fi
  sleep 10
done

echo ""
log "Deployment complete."
echo "  Dashboard:  https://${DOMAIN}/          (login: /login)"
echo "  PocketBase: https://${PB_DOMAIN}/_/"
echo "  Triage:     every ${WORKER_INTERVAL} via radar-worker.timer"
[ "$GENERATED_ADMIN" -eq 1 ] && echo "  PB admin password (generated): ${ADMIN_PASSWORD}"
[ "$GENERATED_RADAR" -eq 1 ] && echo "  Dashboard password (generated): ${RADAR_PASSWORD}"
echo "  Next: verify one lead end-to-end, then set up nightly pb_data/ backups."
