import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logo.png"
        alt="MailMass Logo"
        width={42}
        height={42}
        priority
      />

      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">
          MailMass
        </h1>

        <p className="text-xs text-zinc-400">
          Email Marketing Platform
        </p>
      </div>
    </Link>
  );
}