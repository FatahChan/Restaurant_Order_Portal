import { createClient } from "@/server/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getAbsoluteURL(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return url;
}
async function isAuthenticated(request: NextRequest) {
  const supabaseClient = await createClient();
  const {
    data: { session },
  } = await supabaseClient.auth.getSession().catch(() => {
    throw new Error("Session not found");
  });
  if (!session) {
    const redirectURL = getAbsoluteURL(request, "login");
    redirectURL.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(redirectURL.toString());
  }
}

async function isAuthorized(request: NextRequest) {
  const nextURL = request.nextUrl.clone();
  const isRequestToAdminPage = nextURL.pathname.startsWith("/admin");

  if (!isRequestToAdminPage) {
    return;
  }

  const supabaseClient = await createClient();
  const {
    data: { user },
  } = await supabaseClient.auth.getUser().catch(() => {
    throw new Error("User not found");
  });
  if (!user || user.role !== "manager") {
    return NextResponse.redirect(getAbsoluteURL(request, "login").toString());
  }
}

export async function middleware(request: NextRequest) {
  const isAuthenticatedResponse = await isAuthenticated(request);
  console.log({ isAuthenticatedResponse });
  if (isAuthenticatedResponse) {
    return isAuthenticatedResponse;
  }
  const isAuthorizedResponse = await isAuthorized(request);
  console.log({ isAuthorizedResponse });
  if (isAuthorizedResponse) {
    return isAuthorizedResponse;
  }
  return NextResponse.next();
}

// match everything expect login page
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
