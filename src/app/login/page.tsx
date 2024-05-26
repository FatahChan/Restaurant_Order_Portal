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
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
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
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
        <input
          type="password"
          id="password"
          name="password"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto"
      >
        Submit
      </button>
    </form>
  );
}

export default Login;
