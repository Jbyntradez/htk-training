import { createClient } from "@supabase/supabase-js";

type SupabaseClientMode = "admin" | "anon";
type EnvResolution = {
  name: string;
  value: string;
};

type SupabaseEnvironment = {
  url: EnvResolution | null;
  anonKey: EnvResolution | null;
  serviceRoleKey: EnvResolution | null;
  diagnosticsSecret: EnvResolution | null;
};

type SupabaseErrorLike = {
  message?: unknown;
  details?: unknown;
  hint?: unknown;
  code?: unknown;
};

export class SupabaseConfigurationError extends Error {
  readonly variableNames: string[];

  constructor(message: string, variableNames: string[]) {
    super(message);
    this.name = "SupabaseConfigurationError";
    this.variableNames = variableNames;
  }
}

function resolveEnv(candidates: readonly string[]) {
  for (const name of candidates) {
    const raw = process.env[name];

    if (typeof raw === "string" && raw.trim()) {
      return {
        name,
        value: raw.trim()
      } satisfies EnvResolution;
    }
  }

  return null;
}

function getSupabaseEnvironment(): SupabaseEnvironment {
  return {
    url: resolveEnv(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]),
    anonKey: resolveEnv(["NEXT_PUBLIC_SUPABASE_ANON_KEY", "ANON_KEY"]),
    serviceRoleKey: resolveEnv(["SUPABASE_SERVICE_ROLE_KEY"]),
    diagnosticsSecret: resolveEnv(["SUPABASE_STATUS_SECRET", "ADMIN_STATUS_SECRET"])
  };
}

function normalizeSupabaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function looksLikeUrl(value: string) {
  return /^https?:\/\//.test(value);
}

function looksLikeJwt(value: string) {
  return value.split(".").length === 3;
}

function getFetchUrl(input: Parameters<typeof fetch>[0]) {
  if (typeof input === "string") {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  if (typeof Request !== "undefined" && input instanceof Request) {
    return input.url;
  }

  if (typeof input === "object" && input !== null && "url" in input) {
    const url = (input as { url?: unknown }).url;

    if (typeof url === "string") {
      return url;
    }
  }

  return "<unknown>";
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as SupabaseErrorLike).message === "string"
  ) {
    return (error as SupabaseErrorLike).message as string;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "Unknown error.";
}

async function getResponseBody(response: Response) {
  try {
    const body = await response.clone().text();
    return body || "<empty>";
  } catch (error) {
    return `[unable to read response body: ${getErrorMessage(error)}]`;
  }
}

export function formatSupabaseError(error: unknown) {
  if (error instanceof Error) {
    const parts = [error.message];

    if (error.cause) {
      parts.push(`cause=${formatSupabaseError(error.cause)}`);
    }

    return parts.join(" | ");
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as SupabaseErrorLike).message === "string"
  ) {
    const parts = [(error as SupabaseErrorLike).message as string];

    if (typeof (error as SupabaseErrorLike).code === "string" && (error as SupabaseErrorLike).code) {
      parts.push(`code=${(error as SupabaseErrorLike).code}`);
    }

    if (
      typeof (error as SupabaseErrorLike).details === "string" &&
      (error as SupabaseErrorLike).details
    ) {
      parts.push(`details=${(error as SupabaseErrorLike).details}`);
    }

    if (typeof (error as SupabaseErrorLike).hint === "string" && (error as SupabaseErrorLike).hint) {
      parts.push(`hint=${(error as SupabaseErrorLike).hint}`);
    }

    return parts.join(" | ");
  }

  if (typeof error === "string") {
    return error;
  }

  return "Supabase request failed.";
}

export function logSupabaseError(context: string, error: unknown) {
  const message = formatSupabaseError(error);
  console.error(`[${context}] ${message}`);

  if (typeof error === "object" && error !== null) {
    console.error(`[${context}] Full error object:`, error);
  }

  return message;
}

export function isProductionEnvironment() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

export function shouldAllowLocalFileFallback() {
  return !isProductionEnvironment();
}

function createLoggedFetch(label: string): typeof fetch {
  const baseFetch = globalThis.fetch.bind(globalThis);

  return async (input, init) => {
    const url = getFetchUrl(input);

    try {
      const response = await baseFetch(input, init);

      if (!response.ok) {
        const body = await getResponseBody(response);
        console.error(
          `[supabase:${label}] ${init?.method ?? "GET"} ${url} failed with ${response.status} ${response.statusText}`
        );
        console.error(`[supabase:${label}] Response body: ${body}`);
      }

      return response;
    } catch (error) {
      console.error(
        `[supabase:${label}] ${init?.method ?? "GET"} ${url} threw ${formatSupabaseError(error)}`
      );

      if (error instanceof Error && error.cause) {
        console.error(`[supabase:${label}] Fetch cause:`, error.cause);
      }

      const wrappedError = new Error(
        `Supabase request to ${url} failed: ${getErrorMessage(error)}`,
        {
          cause: error instanceof Error ? error : undefined
        }
      );
      wrappedError.name = "SupabaseFetchError";
      throw wrappedError;
    }
  };
}

function getSupabaseConfig(mode: SupabaseClientMode) {
  const environment = getSupabaseEnvironment();

  if (!environment.url) {
    throw new SupabaseConfigurationError(
      "Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.",
      ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"]
    );
  }

  if (!looksLikeUrl(environment.url.value)) {
    throw new SupabaseConfigurationError(
      `Invalid Supabase URL in ${environment.url.name}. Expected an https:// project URL.`,
      [environment.url.name]
    );
  }

  if (mode === "anon") {
    if (!environment.anonKey) {
      throw new SupabaseConfigurationError(
        "Missing Supabase anon key. Set NEXT_PUBLIC_SUPABASE_ANON_KEY or ANON_KEY.",
        ["NEXT_PUBLIC_SUPABASE_ANON_KEY", "ANON_KEY"]
      );
    }

    if (!looksLikeJwt(environment.anonKey.value)) {
      throw new SupabaseConfigurationError(
        `Invalid Supabase anon key in ${environment.anonKey.name}. Expected a JWT project key.`,
        [environment.anonKey.name]
      );
    }

    return {
      url: normalizeSupabaseUrl(environment.url.value),
      key: environment.anonKey.value
    };
  }

  if (!environment.serviceRoleKey) {
    throw new SupabaseConfigurationError(
      "Missing Supabase service role key. Set SUPABASE_SERVICE_ROLE_KEY.",
      ["SUPABASE_SERVICE_ROLE_KEY"]
    );
  }

  if (!looksLikeJwt(environment.serviceRoleKey.value)) {
    throw new SupabaseConfigurationError(
      "Invalid Supabase service role key in SUPABASE_SERVICE_ROLE_KEY. Expected a JWT service role key.",
      ["SUPABASE_SERVICE_ROLE_KEY"]
    );
  }

  return {
    url: normalizeSupabaseUrl(environment.url.value),
    key: environment.serviceRoleKey.value
  };
}

export function getSupabaseClientConfig(mode: SupabaseClientMode = "admin") {
  return getSupabaseConfig(mode);
}

export function hasSupabaseConfig(mode: SupabaseClientMode = "admin") {
  try {
    getSupabaseConfig(mode);
    return true;
  } catch {
    return false;
  }
}

export function getSupabaseEnvSnapshot() {
  const environment = getSupabaseEnvironment();

  return {
    url: environment.url
      ? {
          exists: true,
          source: environment.url.name,
          value: normalizeSupabaseUrl(environment.url.value)
        }
      : {
          exists: false,
          source: null,
          value: null
        },
    anonKey: environment.anonKey
      ? {
          exists: true,
          source: environment.anonKey.name
        }
      : {
          exists: false,
          source: null
        },
    serviceRoleKey: environment.serviceRoleKey
      ? {
          exists: true,
          source: environment.serviceRoleKey.name
        }
      : {
          exists: false,
          source: null
        },
    diagnosticsSecret: environment.diagnosticsSecret
      ? {
          exists: true,
          source: environment.diagnosticsSecret.name
        }
      : {
          exists: false,
          source: null
        }
  };
}

export function getSupabaseDiagnosticsSecret() {
  const environment = getSupabaseEnvironment();

  if (environment.diagnosticsSecret) {
    return environment.diagnosticsSecret.value;
  }

  return environment.serviceRoleKey?.value ?? null;
}

export function getSupabaseAdmin() {
  const { url, key } = getSupabaseConfig("admin");

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: createLoggedFetch("service-role")
    }
  });
}

export function getSupabaseAnon() {
  const { url, key } = getSupabaseConfig("anon");

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      fetch: createLoggedFetch("anon")
    }
  });
}
