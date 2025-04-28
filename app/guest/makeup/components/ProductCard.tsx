"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

interface Makeup {
  id: number;
  ten_makeup: string;
  anh_makeup: string;
  gia_makeup: number;
  phong_cach_id: number;
  chi_tiet: string;
}

interface PhongCach {
  id: number;
  ten_phong_cach: string;
}

interface CartItem {
  id: number;
  type: string;
  ten?: string;
  ten_rap?: string;
  ten_makeup?: string;
  anh?: string;
  anh_rap?: string;
  anh_makeup?: string;
  gia?: number;
  gia_thue?: number;
  gia_makeup?: number;
  mau_id?: number;
  kich_thuoc_id?: number;
  mau_rap?: string;
  so_ghe?: string;
  so_day_ghe?: string;
  phong_cach_id?: number;
  chi_tiet?: string;
  ngay_thue?: string;
  ngay_hen?: string;
}

interface Filters {
  phongCach: number[];
}

interface ProductCardProps {
  filters: Filters;
}

const ProductCard: React.FC<ProductCardProps> = ({ filters }) => {
  const [makeup, setMakeup] = useState<Makeup[]>([]);
  const [phongCachList, setPhongCachList] = useState<PhongCach[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Makeup | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredProducts, setFilteredProducts] = useState<Makeup[]>([]);

  const getMakeup = async () => {
    try {
      const res = await fetch("/api/makeup");
      const data = await res.json();
      setMakeup(data.datas || []);

      // Thêm timeout để hiển thị hiệu ứng skeleton loader
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Tăng thời gian delay từ 1000ms lên 2000ms
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu makeup:", error);
      setIsLoading(false);
    }
  };

  const getPhongCach = async () => {
    try {
      const res = await fetch("/api/phongcach");
      const data = await res.json();
      setPhongCachList(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phong cách:", error);
    }
  };

  useEffect(() => {
    getMakeup();
    getPhongCach();
  }, []);

  useEffect(() => {
    if (makeup.length > 0) {
      let filtered = [...makeup];

      // Lọc phong cách
      if (filters.phongCach.length > 0) {
        filtered = filtered.filter((product) =>
          filters.phongCach.includes(product.phong_cach_id)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [filters, makeup]);

  const getPhongCachName = (phongCachId: number): string => {
    const phongCach = phongCachList.find((pc) => pc.id === phongCachId);
    return phongCach ? phongCach.ten_phong_cach : "Không xác định";
  };

  const addToCart = (product: Makeup) => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as CartItem[];

      const productWithType: CartItem = {
        ...product,
        type: "makeup",
      };

      const index = cart.findIndex(
        (item) => item.id === product.id && item.type === "makeup"
      );

      if (index === -1) {
        cart.push(productWithType);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`Đã thêm "${product.ten_makeup}" vào giỏ hàng!`);
        closeModal();
      } else {
        toast.info("Sản phẩm đã có trong giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleProductClick = (product: Makeup) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="w-full justify-center flex-wrap gap-0 md:gap-10 my-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        {!isLoading && filteredProducts.length > 0 ? (
          filteredProducts.map((item, index) => (
            <Card
              key={index}
              className="w-[calc(100%+1px)] h-full shadow-none cursor-pointer bg-white rounded-none"
              onClick={() => handleProductClick(item)}
            >
              <CardHeader
                shadow={false}
                floated={false}
                className="h-[30vh] sm:h-[45vh] md:h-[75vh] rounded-none"
              >
                <img
                  src={item.anh_makeup}
                  alt={item.ten_makeup}
                  className="h-full w-full object-cover bg-gray-100 rounded-none"
                />
              </CardHeader>
              <div className="h-fit mt-2 md:mt-0">
                <CardBody className="py-1 px-4 md:px-4 md:mt-4 md:-mb-5">
                  <div className="mb-1 md:mb-2 flex flex-col gap-0 md:gap-3 -mt-1 md:-mt-3">
                    <Typography
                      color="blue-gray"
                      className="font-bold text-xs md:text-lg tracking-tighter dosis"
                    >
                      {item.ten_makeup}
                    </Typography>
                    <Typography
                      color="blue-gray"
                      className="text-gray-600 text-xs md:text-md font-medium tracking-tighter md:-mt-2"
                    >
                      {item.gia_makeup.toLocaleString()}{" "}
                      <span className="text-[10px] md:text-sm">₫</span>
                    </Typography>
                  </div>
                </CardBody>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-10">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card
                  key={item}
                  className="w-full h-full shadow-none bg-white rounded-none overflow-hidden"
                >
                  <div className="animate-pulse">
                    {/* Phần ảnh skeleton */}
                    <div className="h-[30vh] sm:h-[45vh] md:h-[75vh] bg-gray-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 -translate-x-full animate-shimmer"></div>
                    </div>
                    {/* Phần thông tin skeleton */}
                    <div className="h-fit mt-2 md:mt-0 px-4 py-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 -translate-x-full animate-shimmer"></div>
                      </div>
                      <div className="h-3 bg-gray-300 rounded w-1/2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 -translate-x-full animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black"
          onClick={closeModal}
        >
          <div
            className="bg-white p-4 md:p-6 rounded-lg w-[95vw] md:w-[90vw] h-[90vh] flex flex-col md:flex-row justify-between overflow-y-auto md:overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Khoảng trống bên trái - chỉ hiển thị trên desktop */}
            <div className="hidden md:block md:w-1/3"></div>

            {/* Ảnh sản phẩm */}
            <div className="w-full md:w-1/3 bg-gray-100 h-[40vh] md:h-full">
              <img
                src={selectedProduct.anh_makeup}
                alt={selectedProduct.ten_makeup}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="w-full md:w-1/3 h-full flex flex-col justify-start md:justify-center items-center tracking-tighter pt-6 md:pt-0">
              <div className="flex flex-col items-start justify-start w-[90%] md:w-[70%]">
                <div className="big-shoulders text-sm opacity-90 tracking-tighter">
                  Makeup Artist
                </div>
                {/* Tên sản phẩm */}
                <div className="big-shoulders text-2xl md:text-3xl tracking-tighter">
                  {selectedProduct.ten_makeup}
                </div>
                {/* Giá sản phẩm */}
                <div className="big-shoulders text-sm opacity-50 tracking-tighter mt-1 mb-4">
                  {selectedProduct.gia_makeup.toLocaleString()}₫
                </div>

                {/* Thông tin chi tiết sản phẩm */}
                <div className="space-y-2 mb-4">
                  {/* Phong cách */}
                  <div className="flex">
                    <span className="w-24 font-medium">Phong cách:</span>
                    <span>
                      {getPhongCachName(selectedProduct.phong_cach_id)}
                    </span>
                  </div>

                  {/* Chi tiết */}
                  {selectedProduct.chi_tiet && (
                    <div className="flex">
                      <span className="w-24 font-medium">Chi tiết:</span>
                      <span>{selectedProduct.chi_tiet}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => addToCart(selectedProduct)}
                className="mt-4 w-[90%] md:w-[70%] bg-gray-900 text-white px-4 py-3 uppercase hover:bg-gray-800 transition-colors"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default ProductCard;
