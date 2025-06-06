"use client";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import FooterTest from "./components/Footer";
import CozeChat from "./components/Chatbox";
import Header from "./components/Header";
import { useCartExpirationChecker } from "../hooks/useCartExpirationChecker";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isMainTestPage = pathname === "/";

  // Use the cart expiration checker hook to periodically check for expired items
  useCartExpirationChecker();

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 50);
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen flex flex-col overflow-auto scrollbar-none"
    >
      <Header scrolled={scrolled} isMainPage={isMainTestPage} />
      <div className={`flex-grow ${!isMainTestPage ? "pt-[8vh]" : ""}`}>
        {children}
      </div>
      <FooterTest />
      <CozeChat />
      {/* <ExportButton tableName="vaycuoi" /> */}
    </div>
  );
}
