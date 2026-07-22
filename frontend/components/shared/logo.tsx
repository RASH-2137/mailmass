import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-block">
      <Image
        src="/logo.png"
        alt="MailMass"
        width={220}
        height={60}
        priority
        className="h-12 w-auto"
      />
    </Link>
  );
}