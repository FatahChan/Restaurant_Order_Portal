import { createClient } from "@/server/supabase";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const originalPath = request.nextUrl.clone().pathname;
  url.pathname = "/login";
  const supabaseClient = createClient(request.cookies);
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (!session) {
    return NextResponse.redirect(`${url.toString()}?redirect=${originalPath}`);
  }
  return NextResponse.next();
}

// match everything expect login page
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login).*)"],
};
