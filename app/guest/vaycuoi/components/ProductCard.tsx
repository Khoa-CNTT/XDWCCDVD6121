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
  kich_thuoc_id: number;
  do_tuoi_id: number;
}

interface Mau {
  id: number;
  ten_mau: string;
}

interface KichThuoc {
  id: number;
  kich_thuoc: string;
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
  kichThuoc: number[];
  doTuoi: number[];
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
      const res = await fetch("/api/kichthuoc");
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

  useEffect(() => {
    if (vayCuoi.length > 0) {
      let filtered = [...vayCuoi];

      //Lọc màu
      if (filters.mauVay.length > 0) {
        filtered = filtered.filter((product) =>
          filters.mauVay.includes(product.mau_id)
        );
      }
      //Lọc size
      if (filters.kichThuoc.length > 0) {
        filtered = filtered.filter((product) =>
          filters.kichThuoc.includes(product.kich_thuoc_id)
        );
      }
      //Lọc tuổi
      if (filters.doTuoi.length > 0) {
        filtered = filtered.filter((product) =>
          filters.doTuoi.includes(product.do_tuoi_id)
        );
      }

      setFilteredProducts(filtered);
    }
  }, [filters, vayCuoi]);

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
      return (item as KichThuoc).kich_thuoc;
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black"
          onClick={closeModal} // Khi ấn vô cái khoảng trống ngoài modal (ấn vào nền) thì sẽ tắt modal
        >
          <div
            className="bg-white p-4 md:p-6 rounded-lg w-[95vw] md:w-[90vw] h-[90vh] flex flex-col md:flex-row justify-between overflow-y-auto md:overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Ngăn không cho tắt modal khi click vào modal
          >
            {/* Khoảng trống bên trái - chỉ hiển thị trên desktop */}
            <div className="hidden md:block md:w-1/3"></div>

            {/* Ảnh sản phẩm */}
            <div className="w-full md:w-1/3 bg-gray-100 h-[40vh] md:h-full">
              <img
                src={selectedProduct.anh}
                alt={selectedProduct.ten}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thông tin chi tiết */}
            <div className="w-full md:w-1/3 h-full flex flex-col justify-start md:justify-center items-center tracking-tighter pt-6 md:pt-0">
              <div className="flex flex-col items-start justify-start w-[90%] md:w-[70%]">
                <div className="big-shoulders text-sm opacity-90 tracking-tighter">
                  Wedding Dress
                </div>
                {/* Tên sản phẩm */}
                <div className="big-shoulders text-2xl md:text-3xl tracking-tighter">
                  {selectedProduct.ten}
                </div>
                {/* Giá sản phẩm */}
                <div className="big-shoulders text-sm opacity-50 tracking-tighter mt-1 mb-4">
                  {selectedProduct.gia.toLocaleString()}₫
                </div>

                {/* Thông tin chi tiết sản phẩm */}
                <div className="space-y-2 mb-4">
                  {/* Màu sắc sản phẩm */}
                  <div className="flex">
                    <span className="w-24 font-medium">Màu sắc:</span>
                    <span>
                      {getValueById(mauVay, selectedProduct.mau_id, "mau")}
                    </span>
                  </div>

                  {/* Kích thước sản phẩm */}
                  <div className="flex">
                    <span className="w-24 font-medium">Kích thước:</span>
                    <span>
                      {getValueById(
                        kichThuoc,
                        selectedProduct.kich_thuoc_id,
                        "kich_thuoc"
                      )}
                    </span>
                  </div>

                  {/* Độ tuổi phù hợp */}
                  <div className="flex">
                    <span className="w-24 font-medium">Độ tuổi:</span>
                    <span>
                      {getValueById(
                        doTuoi,
                        selectedProduct.do_tuoi_id,
                        "do_tuoi"
                      )}
                    </span>
                  </div>
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
