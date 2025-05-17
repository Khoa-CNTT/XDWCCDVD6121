"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingCartIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Header = ({
  scrolled,
  isMainPage = true,
}: {
  scrolled: boolean;
  isMainPage?: boolean;
}) => {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    // Initial count
    updateCartCount();

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount);

    // Check for updates every second (in case of changes in the same window)
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isMainPage
          ? "bg-white dark:bg-gray-900 shadow-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className={`flex items-center justify-between p-4 container mx-auto ${
          scrolled || !isMainPage ? "h-[8vh]" : "h-[10vh]"
        }`}
      >
        <Link href="/">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              className={`transition-all duration-300 ${
                scrolled || !isMainPage ? "w-24" : "w-32"
              }`}
            />
          </div>
        </Link>

        <div className="hidden lg:flex space-x-8 items-center text-lg">
          <Link
            href="/vaycuoi"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/vaycuoi"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Váy Cưới
          </Link>
          <Link
            href="/rapcuoi"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/rapcuoi"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Rạp Cưới
          </Link>
          <Link
            href="/makeup"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/makeup"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Make Up
          </Link>
          <Link
            href="/about"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/about"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Về Chúng Tôi
          </Link>
          <Link
            href="/contact"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/contact"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Liên Hệ
          </Link>
          <Link
            href="/search-order"
            className={`hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/search-order"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Tra Cứu Đơn Hàng
          </Link>
          <Link href="/cart" className="relative">
            <ShoppingCartIcon
              className={`h-6 w-6 ${
                pathname === "/cart"
                  ? "text-pink-500 dark:text-pink-400"
                  : "text-black dark:text-white"
              }`}
            />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>

        <div className="lg:hidden flex items-center">
          <Link
            href="/search-order"
            className={`mr-4 hover:text-pink-500 dark:hover:text-pink-400 ${
              pathname === "/search-order"
                ? "text-pink-500 dark:text-pink-400"
                : "text-black dark:text-white"
            }`}
          >
            Tra cứu
          </Link>
          <Link href="/cart" className="relative mr-4">
            <ShoppingCartIcon className="h-6 w-6 text-black dark:text-white" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMobileMenuOpen(true)}>
            <Bars3Icon className="h-6 w-6 text-black dark:text-white" />
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
