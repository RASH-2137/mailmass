import Link from "next/link";

export function AuthFooter() {
  return (
    <p className="text-center text-sm text-zinc-400">
      Don&apos;t have an account?{" "}
      <Link
        href="/signup"
        className="font-medium text-blue-500 hover:text-blue-400"
      >
        Sign Up
      </Link>
    </p>
  );
}