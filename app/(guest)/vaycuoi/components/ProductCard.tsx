"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { toast } from "sonner";
import VayRentalModal from "./VayRentalModal";
import { CartItem, VayCuoiCartItem } from "../../cart/types";

interface VayInstance {
  id: number;
  vay_id: number;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE" | "RESERVED";
  rental_start: string | null;
  rental_end: string | null;
  reserved_at: string | null;
}

interface VayCuoi {
  id: number;
  ten: string;
  anh: string;
  gia: number;
  mau_id: number;
  size_id: number;
  do_tuoi_id: number;
  chi_tiet: string;
  instances: VayInstance[];
  mau_release: Mau;
  size_relation: KichThuoc;
  do_tuoi_relation: DoTuoi;
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface KichThuoc {
  id: number;
  size: string;
  min_chieu_cao: number;
  max_chieu_cao: number;
  min_can_nang: number;
  max_can_nang: number;
}

interface DoTuoi {
  id: number;
  dotuoi: number;
}

interface Filters {
  mauVay: number[];
  size: number[];
  doTuoi: number[];
  chieuCao?: number;
  canNang?: number;
}

interface ProductCardProps {
  filters: Filters;
}

const ProductCard: React.FC<ProductCardProps> = ({ filters }) => {
  const [vayCuoi, setVayCuoi] = useState<VayCuoi[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichThuoc[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<VayCuoi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [selectedVayId, setSelectedVayId] = useState<number | null>(null);
  const [selectedVay, setSelectedVay] = useState<VayCuoi | null>(null);

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

  const getVayCuoi = async () => {
    try {
      const res = await fetch("/api/vaycuoi");
      const data = await res.json();
      setVayCuoi(data.datas || []);

      // Only set loading false after data is loaded
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu váy cưới:", error);
      setIsLoading(false);
    }
  };

  const getKichThuoc = async () => {
    try {
      const res = await fetch("/api/size");
      const data = await res.json();
      setKichThuoc(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu kích thước:", error);
    }
  };

  const findSuitableSizeIds = useCallback(
    (height?: number, weight?: number) => {
      if (!height && !weight) return [];

      return kichThuoc
        .filter((size) => {
          const heightMatch =
            !height ||
            (height >= size.min_chieu_cao && height <= size.max_chieu_cao);
          const weightMatch =
            !weight ||
            (weight >= size.min_can_nang && weight <= size.max_can_nang);
          return heightMatch && weightMatch;
        })
        .map((size) => size.id);
    },
    [kichThuoc]
  );

  useEffect(() => {
    getVayCuoi();
    getKichThuoc();
  }, []);

  useEffect(() => {
    if (vayCuoi.length > 0) {
      let filtered = [...vayCuoi];

      // Filter by color
      if (filters.mauVay.length > 0) {
        filtered = filtered.filter((product) =>
          filters.mauVay.includes(product.mau_id)
        );
      }

      // Filter by height and weight or selected sizes
      if (filters.chieuCao || filters.canNang) {
        const suitableSizeIds = findSuitableSizeIds(
          filters.chieuCao,
          filters.canNang
        );
        if (suitableSizeIds.length > 0) {
          filtered = filtered.filter((product) =>
            suitableSizeIds.includes(product.size_id)
          );
        }
      } else if (filters.size.length > 0) {
        filtered = filtered.filter((product) =>
          filters.size.includes(product.size_id)
        );
      }

      // Filter by age
      if (filters.doTuoi.length > 0) {
        filtered = filtered.filter((product) =>
          filters.doTuoi.includes(product.do_tuoi_id)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [filters, vayCuoi, findSuitableSizeIds]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleRentalClick = (vayId: number) => {
    const selected = vayCuoi.find((v) => v.id === vayId);
    if (selected) {
      setSelectedVay(selected);
      setSelectedVayId(vayId);
      setRentalModalOpen(true);
    } else {
      toast.error("Không tìm thấy thông tin váy cưới");
    }
  };
  // Function to get current cart items (already checked by useCartExpirationChecker)
  const getCurrentCartItems = (): CartItem[] => {
    const stored = localStorage.getItem("cartItems");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  };
  const handleRentalSubmit = async (startDate: Date, endDate: Date) => {
    if (!selectedVayId || !selectedVay || !startDate || !endDate) return;

    try {
      // Get current cart items (already checked by useCartExpirationChecker in layout)
      const cartItems = getCurrentCartItems();

      // Call API to reserve the dress instance
      const reserveResponse = await fetch("/api/vayinstance/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vayId: selectedVayId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!reserveResponse.ok) {
        const errorData = await reserveResponse.json();
        toast.error(
          errorData.message || "Không thể đặt trước váy. Vui lòng thử lại."
        );
        return;
      }

      const reservedInstance = await reserveResponse.json();

      if (!reservedInstance || !reservedInstance.id) {
        toast.error("Không có váy nào sẵn có để đặt trước.");
        return;
      }

      // Create cart item
      const cartItem: VayCuoiCartItem = {
        id: Date.now(),
        type: "VAYCUOI",
        vayId: selectedVayId,
        instanceId: reservedInstance.id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        vayInfo: {
          ten: selectedVay.ten,
          anh: selectedVay.anh,
          gia: selectedVay.gia,
        },
        reserved_at: reservedInstance.reserved_at,
      };

      // Add new item to cart
      cartItems.push(cartItem);

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Show success message and close modal
      toast.success("Đã thêm vào giỏ hàng và giữ trong 15 phút!");
      setRentalModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi đặt thuê váy:", error);
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <>
      {" "}
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
                Không tìm thấy váy cưới phù hợp
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
                {" "}
                {/* Optimized image display */}{" "}
                <div className="relative aspect-[3/4] w-full overflow-hidden h-80">
                  <Image
                    src={product.anh}
                    alt={product.ten}
                    width={240}
                    height={320}
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>{" "}
                <div className="p-4">
                  <div className="mb-3 space-y-1.5">
                    <h5 className="text-lg font-medium mb-1 text-gray-900 dark:text-white truncate">
                      {product.ten}
                    </h5>
                    <p className="text-pink-600 dark:text-pink-400 font-bold text-base">
                      {product.gia.toLocaleString("vi-VN")}đ/ngày
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        Màu: {product.mau_release.ten_mau}
                      </span>
                      <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                        Size {product.size_relation.size}
                      </span>
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                        Độ tuổi: {product.do_tuoi_relation.dotuoi}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Trạng thái:{" "}
                      <span
                        className={`font-medium ${
                          product.instances.some(
                            (i) => i.status === "AVAILABLE"
                          )
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {product.instances.some((i) => i.status === "AVAILABLE")
                          ? "Có thể thuê"
                          : "Hết váy"}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleRentalClick(product.id)}
                    className={`w-full py-2.5 rounded-lg transition-colors ${
                      product.instances.some((i) => i.status === "AVAILABLE")
                        ? "bg-pink-500 text-white hover:bg-pink-600"
                        : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={
                      !product.instances.some((i) => i.status === "AVAILABLE")
                    }
                  >
                    {product.instances.some((i) => i.status === "AVAILABLE")
                      ? "Đặt Thuê"
                      : "Hết Váy"}
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
              // Display all page numbers if there are 5 or fewer pages
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
              // Display limited page numbers with ellipsis for many pages
              <>
                {/* First page */}
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

                {/* Ellipsis or page numbers */}
                {currentPage > 3 && (
                  <span className="w-10 h-10 flex items-center justify-center">
                    ...
                  </span>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  return pageNumber !== 1 &&
                    pageNumber !== totalPages &&
                    pageNumber >= currentPage - 1 &&
                    pageNumber <= currentPage + 1 ? (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors ${
                        currentPage === pageNumber
                          ? "bg-pink-500 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ) : null;
                })}

                {/* Ellipsis or page numbers */}
                {currentPage < totalPages - 2 && (
                  <span className="w-10 h-10 flex items-center justify-center">
                    ...
                  </span>
                )}

                {/* Last page if not the first page */}
                {totalPages > 1 && (
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
                )}
              </>
            )}

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              Tiếp &raquo;
            </button>
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Trang {currentPage} / {totalPages || 1} · Tổng{" "}
            {filteredProducts.length} váy cưới
          </p>
        </div>
      )}
      {selectedVay && (
        <VayRentalModal
          isOpen={rentalModalOpen}
          onClose={() => setRentalModalOpen(false)}
          onSubmit={handleRentalSubmit}
          vayInfo={{
            ten: selectedVay.ten,
            anh: selectedVay.anh,
            gia: selectedVay.gia,
            size: selectedVay.size_relation?.size,
            mau: selectedVay.mau_release?.ten_mau,
            doTuoi: selectedVay.do_tuoi_relation?.dotuoi,
            chiTiet: selectedVay.chi_tiet,
          }}
        />
      )}
    </>
  );
};

export default ProductCard;
