"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import Logo from "./Logo";
import NavigationIcons from "./NavigationIcons";

export default function HeaderWithScroll() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isErrorPage = pathname === "/500";
  const shouldBeTransparent = isHomePage || isErrorPage;

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    if (typeof window !== "undefined") {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isTransparent = mounted && shouldBeTransparent && !scrolled;
  const headerClasses = `fixed top-0 z-50 w-full transition-colors duration-300 ${isTransparent ? "bg-transparent" : "bg-white shadow-md"
    }`;

  const logoSrc = isTransparent ? "/logo11.webp" : "/logo12.webp";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Logo logoSrc={logoSrc} />

        <SearchBar isTransparent={isTransparent} />

        <NavigationIcons isTransparent={isTransparent} />
      </div>
    </header>
  );
}
