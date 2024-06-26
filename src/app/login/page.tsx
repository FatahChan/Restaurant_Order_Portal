import { createClient } from "@/server/supabase";
import { redirect } from "next/navigation";
import React from "react";

function Login({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const handleLogin = async (formData: FormData) => {
    "use server";
    const supabaseClient = await createClient();
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid form data");
    }
    await supabaseClient.auth
      .signInWithPassword({
        email,
        password,
      })
      .catch((e: Error) => {
        console.error(e);
      });
    redirect((searchParams.redirect as string | undefined) ?? "/");
  };
  return (
    <form action={handleLogin} className="mx-auto max-w-sm py-12">
      <div className="mb-5">
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Your email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="name@flowbite.com"
          required
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
        >
          Your password
        </label>
        <input type="password" id="password" name="password" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;
