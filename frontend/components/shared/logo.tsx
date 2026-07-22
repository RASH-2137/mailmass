import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md transition-transform group-hover:scale-105">
        <Image
          src="/logo.png"
          alt="MailMass Logo"
          width={24}
          height={24}
          className="h-6 w-6 object-contain brightness-0 invert"
          priority
        />
      </div>

      <div>
        <h1 className="text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-blue-500">
          MailMass
        </h1>
        <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
          Email Platform
        </p>
      </div>
    </Link>
  );
}