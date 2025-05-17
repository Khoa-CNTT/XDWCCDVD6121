"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import RapRentalModal from "./RapRentalModal";

interface RapCuoi {
  id: number;
  ten_rap: string;
  mau_id: number;
  so_ghe_id: number;
  so_day_ghe_id: number;
  anh_rap: string;
  gia_thue: number;
  mau_release?: { ten_mau: string };
  so_luong_ghe?: { so_luong_ghe: number };
  so_luong_day_ghe?: { so_luong_day_ghe: number };
}

interface CartItem {
  id: number;
  type: string;
  rapId: number;
  startDate: string;
  endDate: string;
  rapInfo: {
    ten_rap: string;
    anh_rap: string;
    gia_thue: number;
    mau?: string;
    soGhe?: string;
    soDayGhe?: string;
  };
}

interface Filters {
  mau: number[];
  soGhe: number[];
  soDayGhe: number[];
}

interface ProductCardProps {
  filters: Filters;
}

const ProductCard: React.FC<ProductCardProps> = ({ filters }) => {
  const [rapCuoi, setRapCuoi] = useState<RapCuoi[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<RapCuoi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<RapCuoi[]>([]);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);

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

  const getRapCuoi = async () => {
    try {
      const res = await fetch("/api/rapcuoi");
      const data = await res.json();
      setRapCuoi(data.datas || []);
      setFilteredProducts(data.datas || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu rạp cưới:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRapCuoi();
  }, []);

  useEffect(() => {
    if (rapCuoi.length > 0) {
      let filtered = [...rapCuoi];

      if (filters.mau.length > 0) {
        filtered = filtered.filter((item) => filters.mau.includes(item.mau_id));
      }

      if (filters.soGhe.length > 0) {
        filtered = filtered.filter((item) =>
          filters.soGhe.includes(item.so_ghe_id)
        );
      }

      if (filters.soDayGhe.length > 0) {
        filtered = filtered.filter((item) =>
          filters.soDayGhe.includes(item.so_day_ghe_id)
        );
      }

      setFilteredProducts(filtered);
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters, rapCuoi]);

  const handleProductClick = (product: RapCuoi) => {
    setSelectedProduct(product);
    setRentalModalOpen(true);
  };

  const handleRentalSubmit = (startDate: Date, endDate: Date) => {
    if (!selectedProduct) return;

    const cartItem: CartItem = {
      id: Date.now(),
      type: "RAPCUOI",
      rapId: selectedProduct.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      rapInfo: {
        ten_rap: selectedProduct.ten_rap,
        anh_rap: selectedProduct.anh_rap,
        gia_thue: selectedProduct.gia_thue,
        mau: selectedProduct.mau_release?.ten_mau,
        soGhe: selectedProduct.so_luong_ghe?.so_luong_ghe?.toString(),
        soDayGhe:
          selectedProduct.so_luong_day_ghe?.so_luong_day_ghe?.toString(),
      },
    };

    const existingCart = localStorage.getItem("cartItems");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];

    const isAlreadyInCart = cartItems.some(
      (item: CartItem) =>
        item.rapId === selectedProduct.id && item.type === "RAPCUOI"
    );

    if (isAlreadyInCart) {
      toast.error("Rạp cưới này đã có trong giỏ hàng!");
      return;
    }

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
                Không tìm thấy rạp cưới phù hợp
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
                    src={product.anh_rap}
                    alt={product.ten_rap}
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
                      {product.ten_rap}
                    </h5>
                    <p className="text-pink-600 dark:text-pink-400 font-bold text-base">
                      {product.gia_thue.toLocaleString("vi-VN")}đ/ngày
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {" "}
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        Màu: {product.mau_release?.ten_mau}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                        {product.so_luong_ghe?.so_luong_ghe} ghế
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        {product.so_luong_day_ghe?.so_luong_day_ghe} dãy
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleProductClick(product)}
                    className="w-full py-2.5 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
                  >
                    Đặt Thuê
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

      {selectedProduct && (
        <RapRentalModal
          isOpen={rentalModalOpen}
          onClose={() => setRentalModalOpen(false)}
          onSubmit={handleRentalSubmit}
          rapInfo={{
            ten_rap: selectedProduct.ten_rap,
            anh_rap: selectedProduct.anh_rap,
            gia_thue: selectedProduct.gia_thue,
            mau: selectedProduct.mau_release?.ten_mau,
            soGhe: selectedProduct.so_luong_ghe?.so_luong_ghe?.toString(),
            soDayGhe:
              selectedProduct.so_luong_day_ghe?.so_luong_day_ghe?.toString(),
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
