/**
 * Vanilla TypeScript Class Name Merger
 * Zero external dependencies (replaces clsx and tailwind-merge)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
