"use client";

import Link from "next/link";

interface LogoProps {
  logoSrc: string;
}

export default function Logo({ logoSrc }: LogoProps) {
  return (
    <Link
      href="/"
      prefetch={false}
      className="relative h-10 md:h-14 w-auto flex items-center shrink-0"
      aria-label="Retour à l'accueil - GreenRoots"
    >
      <img
        src={logoSrc}
        alt="Logo"
        className="h-10 md:h-14 w-auto transition-all duration-300"
      />
    </Link>
  );
} 