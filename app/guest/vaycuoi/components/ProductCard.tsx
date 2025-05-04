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
  chieuCao?: number;
  canNang?: number;
}

interface ProductCardProps {
  filters: Filters;
  overrideProducts?: VayCuoi[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  filters,
  overrideProducts,
}) => {
  const [vayCuoi, setVayCuoi] = useState<VayCuoi[]>([]);
  const [mauVay, setMauVay] = useState<Mau[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichThuoc[]>([]);
  const [doTuoi, setDoTuoi] = useState<DoTuoi[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<VayCuoi | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<VayCuoi[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const getFilteredVayCuoi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/vaycuoi/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mauVay: filters.mauVay,
          kichThuoc: filters.kichThuoc,
          doTuoi: filters.doTuoi,
          chieuCao: filters.chieuCao,
          canNang: filters.canNang,
        }),
      });
      const data = await res.json();
      setFilteredProducts(data.datas || []);
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Lỗi khi gọi API lọc váy cưới:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMauVay();
    getKichThuoc();
    getDoTuoi();
  }, []);

  useEffect(() => {
    getFilteredVayCuoi();
  }, [filters]);

  return (
    <div className="w-full justify-center flex-wrap gap-0 md:gap-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
      {!isLoading && filteredProducts.length > 0 ? (
        filteredProducts.map((item, index) => (
          <Card
            key={index}
            className="w-full md:w-full h-full shadow-none cursor-pointer bg-white rounded-none"
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
      ) : isLoading ? (
        <div className="col-span-full text-center text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="col-span-full text-center text-gray-500">
          Không có sản phẩm phù hợp
        </div>
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default ProductCard;
