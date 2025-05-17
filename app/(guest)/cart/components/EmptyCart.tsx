"use client";

import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Giỏ Hàng</h1>
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 mb-4">Giỏ hàng trống</p>
        <Link
          href="/vaycuoi"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
}
