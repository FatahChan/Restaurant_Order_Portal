import { createClient } from "@/server/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const nextURL = request.nextUrl.clone();
  const redirectURL = nextURL.pathname;

  nextURL.pathname = "/login";

  const supabaseClient = await createClient();
  const {
    data: { session },
  } = await supabaseClient.auth.getSession().catch(() => {
    throw new Error("Session not found");
  });
  if (!session) {
    return NextResponse.redirect(
      `${nextURL.toString()}?redirect=${redirectURL}`,
    );
  }
  return NextResponse.next();
}

// match everything expect login page
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
