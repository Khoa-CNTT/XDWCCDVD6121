"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

interface Mau {
  id: number;
  ten_mau: string;
}

interface KichThuoc {
  id: number;
  size: string;
}

interface DoTuoi {
  id: number;
  dotuoi: string;
}

interface SoGhe {
  id: number;
  so_luong_ghe: string;
}

interface SoDayGhe {
  id: number;
  so_luong_day_ghe: string;
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
  size_id?: number;
  so_ghe_id?: number;
  so_day_ghe_id?: number;
  mau_rap?: string;
  so_luong_ghe?: string;
  so_luong_day_ghe?: string;
  phong_cach_id?: number;
  chi_tiet?: string;
  ngay_thue?: string;
  ngay_hen?: string;
  quantity: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [mau, setMau] = useState<Mau[]>([]);
  const [soGhe, setSoGhe] = useState<SoGhe[]>([]);
  const [soDayGhe, setSoDayGhe] = useState<SoDayGhe[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichThuoc[]>([]);
  const [doTuoi, setDoTuoi] = useState<DoTuoi[]>([]);
  const [phongCachList, setPhongCachList] = useState<any[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const router = useRouter();

  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem("cart");
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    };

    loadCart();
    getMau();
    getSoGhe();
    getSoDayGhe();
    getKichThuoc();
    getDoTuoi();
    getPhongCach();

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      return cartItems.reduce((sum, item) => {
        const price = item.gia || item.gia_thue || item.gia_makeup || 0;
        return sum + price;
      }, 0);
    };

    setTotal(calculateTotal());
  }, [cartItems]);

  const getMau = async () => {
    try {
      const res = await fetch("/api/mau");
      const data = await res.json();
      setMau(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu màu:", error);
    }
  };

  const getSoGhe = async () => {
    try {
      const res = await fetch("/api/soghe");
      const data = await res.json();
      setSoGhe(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số ghế:", error);
    }
  };

  const getSoDayGhe = async () => {
    try {
      const res = await fetch("/api/sodayghe");
      const data = await res.json();
      setSoDayGhe(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu số dãy ghế:", error);
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
      console.error("Lỗi khi lấy dữ liệu độ tuổi:", error);
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

  const getValueById = (
    dataList: (Mau | KichThuoc | DoTuoi | SoGhe | SoDayGhe)[],
    id: number,
    key: string
  ): string => {
    const item = dataList.find((item) => item.id === id);
    if (!item) return "Không xác định";

    if (key === "mau") {
      return (item as Mau).ten_mau;
    }

    if (key === "size") {
      return (item as KichThuoc).size;
    }

    if (key === "do_tuoi") {
      return (item as DoTuoi).dotuoi;
    }

    if (key === "so_ghe") {
      return (item as SoGhe).so_luong_ghe;
    }

    if (key === "so_day_ghe") {
      return (item as SoDayGhe).so_luong_day_ghe;
    }

    return "Không xác định";
  };

  const getPhongCachName = (phongCachId: number): string => {
    const phongCach = phongCachList.find((pc) => pc.id === phongCachId);
    return phongCach ? phongCach.ten_phong_cach : "Không xác định";
  };

  const getItemDetails = (
    item: CartItem
  ): { primary: string; secondary: string; extraInfo?: string } => {
    switch (item.type) {
      case "vaycuoi":
        return {
          primary: `Màu: ${
            item.mau_id
              ? getValueById(mau, item.mau_id, "mau")
              : "Không xác định"
          }`,
          secondary: `Kích thước: ${
            item.size_id
              ? getValueById(kichThuoc, item.size_id, "size")
              : "Không xác định"
          }`,
        };
      case "rapcuoi":
        return {
          primary: `Màu: ${
            item.mau_id
              ? getValueById(mau, item.mau_id, "mau")
              : "Không xác định"
          }`,
          secondary: `Số ghế: ${
            item.so_ghe_id
              ? getValueById(soGhe, item.so_ghe_id, "so_ghe")
              : "Không xác định"
          } / Số dãy ghế: ${
            item.so_day_ghe_id
              ? getValueById(soDayGhe, item.so_day_ghe_id, "so_day_ghe")
              : "Không xác định"
          }`,
          extraInfo: item.ngay_thue
            ? `Ngày thuê: ${new Date(item.ngay_thue).toLocaleDateString(
                "vi-VN"
              )}`
            : undefined,
        };
      case "makeup":
        return {
          primary: `Phong cách: ${
            item.phong_cach_id
              ? getPhongCachName(item.phong_cach_id)
              : "Không xác định"
          }`,
          secondary: item.chi_tiet ? `Chi tiết: ${item.chi_tiet}` : "Makeup",
          extraInfo: item.ngay_hen
            ? `Ngày hẹn: ${new Date(item.ngay_hen).toLocaleDateString("vi-VN")}`
            : undefined,
        };
      default:
        return {
          primary: "Không xác định",
          secondary: "Không xác định",
        };
    }
  };

  const removeItem = (id: number, type: string) => {
    const updatedCart = cartItems.filter(
      (item) => !(item.id === id && item.type === type)
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.info("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.address
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, vui lòng thêm sản phẩm trước khi đặt hàng");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ten_khach_hang: `${shippingInfo.lastName} ${shippingInfo.firstName}`,
          so_dien_thoai: shippingInfo.phone,
          dia_chi: shippingInfo.address,
          email: shippingInfo.email,
          payment_method: paymentMethod.toUpperCase(), // "COD"
          so_tien: total,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua sắm.");
        localStorage.removeItem("cart");
        setCartItems([]);
        setTimeout(() => {
          router.push("/guest");
        }, 2000);
      } else {
        toast.error("Lỗi đặt hàng: " + data.message);
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại sau.");
    }
  };

  const getItemName = (item: CartItem): string => {
    return item.ten || item.ten_rap || item.ten_makeup || "Sản phẩm không tên";
  };

  const getItemImage = (item: CartItem): string => {
    const image = item.anh || item.anh_rap || item.anh_makeup || "";
    return image || "/placeholder.jpg";
  };

  const getItemPrice = (item: CartItem): number => {
    return item.gia || item.gia_thue || item.gia_makeup || 0;
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <Link href="/guest/product" className="text-sm font-medium">
            ← Tiếp tục mua sắm
          </Link>
          <Typography variant="h6" className="font-medium">
            Thanh toán
          </Typography>
          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Typography variant="h5" className="mb-4 font-medium">
            Giỏ hàng
          </Typography>
          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const details = getItemDetails(item);
                const uniqueKey = `${item.type}-${item.id}`;
                return (
                  <div
                    key={uniqueKey}
                    className="flex items-center justify-between py-4 border-b"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 overflow-hidden">
                        <img
                          src={getItemImage(item)}
                          alt={getItemName(item)}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <Typography variant="small" className="font-medium">
                          {getItemName(item)}
                        </Typography>
                        <Typography color="gray" className="text-sm">
                          {details.primary}
                          <span className="mx-2">/</span>
                          {details.secondary}
                        </Typography>
                        {details.extraInfo && (
                          <Typography color="gray" className="text-sm">
                            {details.extraInfo}
                          </Typography>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Typography className="font-medium min-w-[100px] text-right">
                        {getItemPrice(item).toLocaleString()}đ
                      </Typography>
                      <IconButton
                        variant="text"
                        size="sm"
                        onClick={() => removeItem(item.id, item.type)}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Typography className="text-gray-500">
                Giỏ hàng của bạn đang trống
              </Typography>
              <Link href="/guest">
                <Button variant="text" className="mt-4">
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mb-8">
          <Typography variant="h5" className="mb-4 font-medium">
            Tổng đơn hàng
          </Typography>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Typography>Tạm tính</Typography>
              <Typography>{total.toLocaleString()}đ</Typography>
            </div>
            <div className="flex justify-between">
              <Typography>Phí vận chuyển</Typography>
              <Typography>Miễn phí</Typography>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between">
                <Typography className="font-medium">Tổng cộng</Typography>
                <Typography className="font-medium">
                  {total.toLocaleString()}đ
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Typography variant="h5" className="mb-4 font-medium">
            Thông tin giao hàng
          </Typography>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Họ"
                name="firstName"
                value={shippingInfo.firstName}
                onChange={handleInputChange}
              />
              <Input
                label="Tên"
                name="lastName"
                value={shippingInfo.lastName}
                onChange={handleInputChange}
              />
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
            />
            <Input
              label="Số điện thoại"
              type="tel"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
            />
            <Input
              label="Địa chỉ"
              name="address"
              value={shippingInfo.address}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-8">
          <Typography variant="h5" className="mb-4 font-medium">
            Phương thức thanh toán
          </Typography>
          <div className="space-y-4">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                paymentMethod === "cod" ? "border-black" : ""
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment"
                  className="w-4 h-4"
                  checked={paymentMethod === "cod"}
                  readOnly
                />
                <div>
                  <Typography className="font-medium">
                    Thanh toán khi nhận hàng
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                paymentMethod === "bank" ? "border-black" : ""
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <div className="flex items-center space-x-4">
                <input
                  type="radio"
                  name="payment"
                  className="w-4 h-4"
                  checked={paymentMethod === "bank"}
                  readOnly
                />
                <div>
                  <Typography className="font-medium">
                    Chuyển khoản ngân hàng
                  </Typography>
                  <Typography variant="small" className="text-gray-600">
                    Chuyển khoản trực tiếp đến tài khoản ngân hàng
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          size="lg"
          className="w-full bg-black text-white hover:bg-gray-900"
          onClick={handlePlaceOrder}
          disabled={cartItems.length === 0}
        >
          Đặt hàng
        </Button>
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default CheckoutPage;
