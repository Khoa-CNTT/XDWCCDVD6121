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

interface VayCuoi {
  id: number;
  ten: string;
  anh: string;
  gia: number;
  mau_id: number;
  size_id: number;
  do_tuoi_id: number;
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
  const [mauVay, setMauVay] = useState<Mau[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichThuoc[]>([]);
  const [doTuoi, setDoTuoi] = useState<DoTuoi[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VayCuoi | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<VayCuoi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getVayCuoi = async () => {
    try {
      const res = await fetch("/api/vaycuoi");
      const data = await res.json();
      setVayCuoi(data.datas || []);

      //Timeout
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu váy cưới:", error);
      setIsLoading(false);
    }
  };

  const getMauVay = async () => {
    try {
      const res = await fetch("/api/mau");
      const data = await res.json();
      setMauVay(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu màu váy:", error);
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

  const getDoTuoi = async () => {
    try {
      const res = await fetch("/api/dotuoi");
      const data = await res.json();
      setDoTuoi(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu độ tuổi phù hợp:", error);
    }
  };

  useEffect(() => {
    getVayCuoi();
    getMauVay();
    getKichThuoc();
    getDoTuoi();
  }, []);

  // Tìm size phù hợp dựa trên chiều cao và cân nặng
  const findSuitableSizeIds = (
    chieuCao?: number,
    canNang?: number
  ): number[] => {
    if (!chieuCao && !canNang) return [];

    return kichThuoc
      .filter((size) => {
        // Nếu chỉ có chiều cao
        if (chieuCao && !canNang) {
          return (
            size.min_chieu_cao <= chieuCao && chieuCao <= size.max_chieu_cao
          );
        }

        // Nếu chỉ có cân nặng
        if (canNang && !chieuCao) {
          return size.min_can_nang <= canNang && canNang <= size.max_can_nang;
        }

        // Nếu có cả chiều cao và cân nặng
        return (
          size.min_chieu_cao <= chieuCao! &&
          chieuCao! <= size.max_chieu_cao &&
          size.min_can_nang <= canNang! &&
          canNang! <= size.max_can_nang
        );
      })
      .map((size) => size.id);
  };

  useEffect(() => {
    if (vayCuoi.length > 0) {
      let filtered = [...vayCuoi];

      // Lọc màu
      if (filters.mauVay.length > 0) {
        filtered = filtered.filter((product) =>
          filters.mauVay.includes(product.mau_id)
        );
      }

      // Lọc size dựa trên chiều cao và cân nặng
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
      }
      // Nếu không có lọc theo chiều cao/cân nặng thì lọc theo size đã chọn
      else if (filters.size.length > 0) {
        filtered = filtered.filter((product) =>
          filters.size.includes(product.size_id)
        );
      }

      // Lọc tuổi
      if (filters.doTuoi.length > 0) {
        filtered = filtered.filter((product) =>
          filters.doTuoi.includes(product.do_tuoi_id)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [filters, vayCuoi, kichThuoc]);

  const getValueById = (
    dataList: (Mau | KichThuoc | DoTuoi)[],
    id: number,
    key: string
  ): string => {
    const item = dataList.find((item) => item.id === id);
    if (!item) return "Không xác định";

    if (key === "do_tuoi") {
      return String((item as DoTuoi).dotuoi);
    }

    if (key === "mau") {
      return (item as Mau).ten_mau;
    }

    if (key === "kich_thuoc") {
      return (item as KichThuoc).size;
    }

    return "Không xác định";
  };

  const addToCart = (product: VayCuoi) => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      ) as CartItem[];

      const productWithType: CartItem = {
        ...product,
        type: "vaycuoi",
      };

      const index = cart.findIndex(
        (item) => item.id === product.id && item.type === "vaycuoi"
      );

      if (index === -1) {
        cart.push(productWithType);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(`Đã thêm "${product.ten}" vào giỏ hàng!`);
        closeModal();
      } else {
        toast.info("Sản phẩm đã có trong giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error("Không thể thêm sản phẩm vào giỏ hàng!");
    }
  };

  const handleProductClick = (product: VayCuoi) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="w-full justify-center flex-wrap gap-0 md:gap-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
        {!isLoading && filteredProducts.length > 0 ? (
          filteredProducts.map((item, index) => (
            <Card
              key={index}
              className="w-full md:w-full h-full shadow-none cursor-pointer bg-white rounded-none"
              onClick={() => handleProductClick(item)}
            >
              <CardHeader
                shadow={false}
                floated={false}
                className="h-[30vh] sm:h-[45vh] md:h-[75vh] rounded-none"
              >
                <img
                  src={item.anh}
                  alt={item.ten}
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
                      {item.ten}
                    </Typography>
                    <Typography
                      color="blue-gray"
                      className="text-gray-600 text-xs md:text-md font-medium tracking-tighter md:-mt-2"
                    >
                      {item.gia.toLocaleString()}{" "}
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
      {/* Hiển thị modal chi tiết sản phẩm khi click vào sản phẩm */}
      {selectedProduct && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="absolute top-14 md:top-36 bg-white rounded-xl w-[95vw] md:w-[80vw] max-w-6xl h-[90vh] md:h-[80vh] shadow-xl overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút đóng */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl z-10"
              aria-label="Đóng"
            >
              &times;
            </button>

            {/* Hình ảnh */}
            <div className="w-full md:w-1/2 h-[40vh] md:h-full overflow-hidden">
              <img
                src={selectedProduct.anh}
                alt={selectedProduct.ten}
                className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {selectedProduct.ten}
                </h2>
                <p className="text-lg font-semibold text-pink-600">
                  {selectedProduct.gia.toLocaleString()}₫
                </p>

                <div className="text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold">Màu sắc:</span>{" "}
                    {getValueById(mauVay, selectedProduct.mau_id, "mau")}
                  </p>
                  <p>
                    <span className="font-semibold">Kích thước:</span>{" "}
                    {getValueById(
                      kichThuoc,
                      selectedProduct.size_id,
                      "kich_thuoc"
                    )}
                  </p>
                  <p>
                    <span className="font-semibold">Độ tuổi:</span>{" "}
                    {getValueById(
                      doTuoi,
                      selectedProduct.do_tuoi_id,
                      "do_tuoi"
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => addToCart(selectedProduct)}
                className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all uppercase tracking-wide"
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
