import { NextRequest, NextResponse } from "next/server";
import {
  formatSupabaseError,
  getSupabaseAdmin,
  getSupabaseClientConfig,
  getSupabaseDiagnosticsSecret,
  getSupabaseEnvSnapshot,
  isProductionEnvironment
} from "@/lib/supabase";

const expectedTable = "coaching_applications";

export const dynamic = "force-dynamic";

function getProvidedSecret(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return request.headers.get("x-admin-secret")?.trim() ?? null;
}

async function readResponseBody(response: Response) {
  try {
    return (await response.text()) || "<empty>";
  } catch (error) {
    return `[unable to read body: ${formatSupabaseError(error)}]`;
  }
}

async function checkSupabaseConnection() {
  try {
    const { url, key } = getSupabaseClientConfig("anon");
    const endpoint = `${url}/rest/v1/`;
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const body = await readResponseBody(response);
      console.error(
        `[supabase:diagnostics] GET ${endpoint} failed with ${response.status} ${response.statusText}`
      );
      console.error(`[supabase:diagnostics] Response body: ${body}`);

      return {
        ok: false,
        url: endpoint,
        status: response.status,
        error: `Supabase connection check failed: ${response.status} ${response.statusText}`,
        responseBody: body
      };
    }

    return {
      ok: true,
      url: endpoint,
      status: response.status,
      error: null,
      responseBody: null
    };
  } catch (error) {
    console.error(
      `[supabase:diagnostics] Connection probe failed: ${formatSupabaseError(error)}`
    );

    return {
      ok: false,
      url: null,
      status: null,
      error: formatSupabaseError(error),
      responseBody: null
    };
  }
}

async function checkApplicationsTable() {
  try {
    const supabase = getSupabaseAdmin();

    const selectResult = await supabase
      .from(expectedTable)
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (selectResult.error) {
      const error = formatSupabaseError(selectResult.error);

      return {
        tableExists: false,
        selectWorks: false,
        insertWorks: false,
        cleanupWorked: false,
        error,
        insertedId: null
      };
    }

    const diagnosticEmail = `diagnostic-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
    const insertResult = await supabase
      .from(expectedTable)
      .insert({
        name: "Supabase Diagnostics",
        email: diagnosticEmail,
        primary_goal: "Verify Supabase insert permissions",
        current_state: "Automated diagnostics probe",
        next_phase_goal: "Confirm production database writes",
        time_frame: "30 days",
        commitment_level: "Just exploring",
        source: "supabase_status_probe"
      })
      .select("id")
      .single();

    if (insertResult.error) {
      return {
        tableExists: true,
        selectWorks: true,
        insertWorks: false,
        cleanupWorked: false,
        error: formatSupabaseError(insertResult.error),
        insertedId: null
      };
    }

    const insertedId = insertResult.data.id;
    const cleanupResult = await supabase.from(expectedTable).delete().eq("id", insertedId);

    if (cleanupResult.error) {
      const cleanupError = formatSupabaseError(cleanupResult.error);
      console.error(`[supabase:diagnostics] Cleanup delete failed for ${expectedTable}: ${cleanupError}`);

      return {
        tableExists: true,
        selectWorks: true,
        insertWorks: true,
        cleanupWorked: false,
        error: cleanupError,
        insertedId
      };
    }

    return {
      tableExists: true,
      selectWorks: true,
      insertWorks: true,
      cleanupWorked: true,
      error: null,
      insertedId
    };
  } catch (error) {
    console.error(
      `[supabase:diagnostics] Table probe failed: ${formatSupabaseError(error)}`
    );

    return {
      tableExists: false,
      selectWorks: false,
      insertWorks: false,
      cleanupWorked: false,
      error: formatSupabaseError(error),
      insertedId: null
    };
  }
}

export async function GET(request: NextRequest) {
  const expectedSecret = getSupabaseDiagnosticsSecret();
  const providedSecret = getProvidedSecret(request);

  if (expectedSecret) {
    if (!providedSecret || providedSecret !== expectedSecret) {
      return NextResponse.json(
        {
          error: "Unauthorized. Provide Authorization: Bearer <admin secret> or x-admin-secret."
        },
        { status: 401 }
      );
    }
  } else if (isProductionEnvironment()) {
    return NextResponse.json(
      { error: "Admin diagnostics secret is not configured for production." },
      { status: 503 }
    );
  }

  const env = getSupabaseEnvSnapshot();
  const connection = await checkSupabaseConnection();
  const tableCheck = await checkApplicationsTable();

  const checks = {
    supabaseUrlExists: {
      ok: env.url.exists,
      source: env.url.source,
      value: env.url.value
    },
    anonKeyExists: {
      ok: env.anonKey.exists,
      source: env.anonKey.source
    },
    serviceRoleKeyExists: {
      ok: env.serviceRoleKey.exists,
      source: env.serviceRoleKey.source
    },
    clientCanConnect: connection,
    applicationsTableExists: {
      ok: tableCheck.tableExists,
      table: expectedTable,
      error: tableCheck.error
    },
    selectInsertPermissionsWork: {
      ok: tableCheck.selectWorks && tableCheck.insertWorks,
      selectWorks: tableCheck.selectWorks,
      insertWorks: tableCheck.insertWorks,
      cleanupWorked: tableCheck.cleanupWorked,
      insertedId: tableCheck.insertedId,
      error: tableCheck.error
    }
  };

  const ok =
    checks.supabaseUrlExists.ok &&
    checks.anonKeyExists.ok &&
    checks.serviceRoleKeyExists.ok &&
    checks.clientCanConnect.ok &&
    checks.applicationsTableExists.ok &&
    checks.selectInsertPermissionsWork.ok;

  return NextResponse.json(
    {
      ok,
      checkedAt: new Date().toISOString(),
      environment: isProductionEnvironment() ? "production" : "development",
      checks
    },
    { status: ok ? 200 : 503 }
  );
}
