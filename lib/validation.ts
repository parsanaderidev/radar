/**
 * Runtime Input Validation & Sanitization Utilities
 * Zero External Dependencies - Vanilla TypeScript
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

/**
 * Strips dangerous control characters and trims string.
 */
export function sanitizeString(val: unknown, maxLen = 2000): string {
  if (typeof val !== "string") return "";
  // Strip null bytes and non-printable control characters (except newline, carriage return, tab)
  const cleaned = val.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLen);
}

/**
 * Validates analyze request body
 */
export function validateAnalyzeInput(body: any): ValidationResult<{
  raw_message_id?: string;
  content?: string;
  author_handle: string;
  thread_context?: string;
  platform: string;
  product_id?: string;
}> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return { success: false, errors: [{ field: "body", message: "Request body must be a valid JSON object." }] };
  }

  // Case 1: Triage existing raw_message by ID
  if (body.raw_message_id) {
    if (typeof body.raw_message_id !== "string" || !/^[a-zA-Z0-9_-]{5,30}$/.test(body.raw_message_id)) {
      errors.push({ field: "raw_message_id", message: "Invalid raw_message_id format." });
    }
    return {
      success: errors.length === 0,
      data: {
        raw_message_id: body.raw_message_id,
        author_handle: "@guest_user",
        platform: "community",
      },
      errors,
    };
  }

  // Case 2: Direct content evaluation
  if (!body.content || typeof body.content !== "string") {
    errors.push({ field: "content", message: "Field 'content' is required and must be a string." });
  } else if (body.content.trim().length === 0) {
    errors.push({ field: "content", message: "Field 'content' cannot be empty." });
  } else if (body.content.length > 3000) {
    errors.push({ field: "content", message: "Field 'content' exceeds maximum length of 3,000 characters." });
  }

  const content = sanitizeString(body.content, 3000);

  let author_handle = "@guest_user";
  if (body.author_handle !== undefined) {
    if (typeof body.author_handle !== "string") {
      errors.push({ field: "author_handle", message: "Field 'author_handle' must be a string." });
    } else {
      author_handle = sanitizeString(body.author_handle, 100) || "@guest_user";
    }
  }

  let thread_context: string | undefined = undefined;
  if (body.thread_context !== undefined && body.thread_context !== null) {
    if (typeof body.thread_context !== "string") {
      errors.push({ field: "thread_context", message: "Field 'thread_context' must be a string." });
    } else {
      thread_context = sanitizeString(body.thread_context, 1500);
    }
  }

  const allowedPlatforms = ["telegram", "bale", "twitter_x", "forum", "community"];
  let platform = "community";
  if (body.platform !== undefined) {
    if (typeof body.platform !== "string" || !allowedPlatforms.includes(body.platform)) {
      errors.push({ field: "platform", message: `Field 'platform' must be one of: ${allowedPlatforms.join(", ")}` });
    } else {
      platform = body.platform;
    }
  }

  let product_id: string | undefined = undefined;
  if (body.product_id !== undefined && body.product_id !== null) {
    if (typeof body.product_id !== "string" || !/^[a-zA-Z0-9_-]{5,30}$/.test(body.product_id)) {
      errors.push({ field: "product_id", message: "Invalid product_id format." });
    } else {
      product_id = body.product_id;
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      content,
      author_handle,
      thread_context,
      platform,
      product_id,
    },
  };
}

/**
 * Validates lead status update input
 */
export function validateLeadStatusInput(body: any): ValidationResult<{
  leadId: string;
  status: "new" | "approved" | "contacted" | "dismissed";
}> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return { success: false, errors: [{ field: "body", message: "Invalid request payload." }] };
  }

  if (!body.leadId || typeof body.leadId !== "string" || !/^[a-zA-Z0-9_-]{5,30}$/.test(body.leadId)) {
    errors.push({ field: "leadId", message: "Valid leadId is required." });
  }

  const allowedStatuses = ["new", "approved", "contacted", "dismissed"];
  if (!body.status || typeof body.status !== "string" || !allowedStatuses.includes(body.status)) {
    errors.push({ field: "status", message: `Status must be one of: ${allowedStatuses.join(", ")}` });
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      leadId: body.leadId,
      status: body.status,
    },
  };
}

/**
 * Validates settings update input
 */
export function validateSettingsInput(body: any): ValidationResult<{
  id: string;
  name: string;
  tagline?: string;
  description: string;
  ideal_customer_profile: string;
  value_propositions: string[];
  keywords: string[];
}> {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return { success: false, errors: [{ field: "body", message: "Invalid request payload." }] };
  }

  if (!body.id || typeof body.id !== "string" || !/^[a-zA-Z0-9_-]{5,30}$/.test(body.id)) {
    errors.push({ field: "id", message: "Valid product ID is required." });
  }

  if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push({ field: "name", message: "Product name is required." });
  }

  if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
    errors.push({ field: "description", message: "Product description is required." });
  }

  if (!body.ideal_customer_profile || typeof body.ideal_customer_profile !== "string" || body.ideal_customer_profile.trim().length === 0) {
    errors.push({ field: "ideal_customer_profile", message: "Ideal Customer Profile (ICP) is required." });
  }

  const name = sanitizeString(body.name, 150);
  const tagline = body.tagline ? sanitizeString(body.tagline, 300) : "";
  const description = sanitizeString(body.description, 2000);
  const ideal_customer_profile = sanitizeString(body.ideal_customer_profile, 2000);

  const value_propositions: string[] = Array.isArray(body.value_propositions)
    ? body.value_propositions
        .map((vp: unknown) => sanitizeString(vp, 400))
        .filter((vp: string) => vp.length > 0)
        .slice(0, 20)
    : [];

  const keywords: string[] = Array.isArray(body.keywords)
    ? body.keywords
        .map((kw: unknown) => sanitizeString(kw, 80))
        .filter((kw: string) => kw.length > 0)
        .slice(0, 50)
    : [];

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      id: body.id,
      name,
      tagline,
      description,
      ideal_customer_profile,
      value_propositions,
      keywords,
    },
  };
}
