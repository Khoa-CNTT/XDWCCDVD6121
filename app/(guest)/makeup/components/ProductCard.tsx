"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import MakeupRentalModal from "./MakeupRentalModal";

interface Makeup {
  id: number;
  ten_makeup: string;
  anh_makeup: string;
  gia_makeup: number;
  phong_cach_id: number;
  chi_tiet: string;
  phong_cach_relation?: { ten_phong_cach: string };
}

interface CartItem {
  id: number;
  type: string;
  makeupId: number;
  ngay_hen: string;
  makeupInfo: {
    ten_makeup: string;
    anh_makeup: string;
    gia_makeup: number;
    phong_cach?: string;
    chi_tiet?: string;
  };
}

interface Filters {
  phongCach: number[];
}

interface ProductCardProps {
  filters: Filters;
}

const ProductCard: React.FC<ProductCardProps> = ({ filters }) => {
  const [makeup, setMakeup] = useState<Makeup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Makeup[]>([]);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [selectedMakeup, setSelectedMakeup] = useState<Makeup | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9; // 3x3 grid

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const getMakeup = async () => {
    try {
      const res = await fetch("/api/makeup");
      const data = await res.json();
      setMakeup(data.datas || []);
      setFilteredProducts(data.datas || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu makeup:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMakeup();
  }, []);

  useEffect(() => {
    if (makeup.length > 0) {
      let filtered = [...makeup];

      // Filter by phong cách
      if (filters.phongCach.length > 0) {
        filtered = filtered.filter((item) =>
          filters.phongCach.includes(item.phong_cach_id)
        );
      }

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters, makeup]);

  const handleRentalClick = (makeup: Makeup) => {
    setSelectedMakeup(makeup);
    setRentalModalOpen(true);
  };

  const handleRentalSubmit = (appointmentDate: Date) => {
    if (!selectedMakeup) return;

    // Create cart item
    const cartItem: CartItem = {
      id: Date.now(),
      type: "MAKEUP",
      makeupId: selectedMakeup.id,
      ngay_hen: appointmentDate.toISOString(),
      makeupInfo: {
        ten_makeup: selectedMakeup.ten_makeup,
        anh_makeup: selectedMakeup.anh_makeup,
        gia_makeup: selectedMakeup.gia_makeup,
        phong_cach: selectedMakeup.phong_cach_relation?.ten_phong_cach,
        chi_tiet: selectedMakeup.chi_tiet,
      },
    };

    // Get existing cart
    const existingCart = localStorage.getItem("cartItems");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    // Check if the makeup service has already been booked
    const isAlreadyInCart = cartItems.some(
      (item: CartItem) =>
        item.makeupId === selectedMakeup.id && item.type === "MAKEUP"
    );

    if (isAlreadyInCart) {
      toast.error("Dịch vụ trang điểm này đã được đặt!");
      return;
    }

    // Add new item to cart
    cartItems.push(cartItem);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    toast.success("Đã thêm vào giỏ hàng thành công!");
    setRentalModalOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow animate-pulse"
            >
              <div className="h-80 bg-gray-300" />
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Không tìm thấy dịch vụ makeup phù hợp
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Vui lòng thử lại với các bộ lọc khác.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden h-80">
                  <Image
                    src={product.anh_makeup}
                    alt={product.ten_makeup}
                    width={240}
                    height={320}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-3 space-y-1.5">
                    <h5 className="text-lg font-medium mb-1 text-gray-900 dark:text-white truncate">
                      {product.ten_makeup}
                    </h5>
                    <p className="text-pink-600 dark:text-pink-400 font-bold text-base">
                      {product.gia_makeup.toLocaleString("vi-VN")}đ
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        Phong cách:{" "}
                        {product.phong_cach_relation?.ten_phong_cach}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRentalClick(product)}
                    className="w-full py-2.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                  >
                    Đặt Lịch
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination controls */}
      {filteredProducts.length > 0 && (
        <div className="mt-8 mb-4">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              &laquo; Trước
            </button>

            {totalPages <= 5 ? (
              Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === index + 1
                      ? "bg-pink-500 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => paginate(1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === 1
                      ? "bg-pink-500 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  1
                </button>

                {currentPage > 3 && (
                  <span className="w-10 h-10 flex items-center justify-center">
                    ...
                  </span>
                )}

                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => i + Math.max(1, currentPage - 2)
                )
                  .filter((page) => page > 1 && page < totalPages)
                  .map((page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                        currentPage === page
                          ? "bg-pink-500 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                {currentPage < totalPages - 2 && (
                  <span className="w-10 h-10 flex items-center justify-center">
                    ...
                  </span>
                )}

                <button
                  onClick={() => paginate(totalPages)}
                  className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                    currentPage === totalPages
                      ? "bg-pink-500 text-white"
                      : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Sau &raquo;
            </button>
          </div>
        </div>
      )}

      {selectedMakeup && (
        <MakeupRentalModal
          isOpen={rentalModalOpen}
          onClose={() => setRentalModalOpen(false)}
          onSubmit={handleRentalSubmit}
          makeupInfo={{
            ten_makeup: selectedMakeup.ten_makeup,
            anh_makeup: selectedMakeup.anh_makeup,
            gia_makeup: selectedMakeup.gia_makeup,
            phong_cach: selectedMakeup.phong_cach_relation?.ten_phong_cach,
            chi_tiet: selectedMakeup.chi_tiet,
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
