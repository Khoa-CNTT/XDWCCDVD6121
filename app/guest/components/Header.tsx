"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Badge, Input } from "@material-tailwind/react";
import { HiArrowLongRight } from "react-icons/hi2";
import {
  Drawer,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ShoppingCartIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";

const hideScrollbarCSS = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

interface VayCuoi {
  id: number;
  ten: string;
  anh: string;
  gia: number;
  id_mau_vay: number;
  id_kich_thuoc: number;
  id_do_tuoi: number;
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
  kich_thuoc_id?: number;
  so_ghe_id?: number;
  so_day_ghe_id?: number;
  mau_rap?: string;
  so_luong_ghe?: string;
  so_luong_day_ghe?: string;
  phong_cach_id?: number;
  chi_tiet?: string;
  ngay_thue?: string;
  ngay_hen?: string;
}

const Header = ({
  scrolled,
  isMainPage = true,
}: {
  scrolled: boolean;
  isMainPage?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [expandHeader, setExpandHeader] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [mau, setMau] = useState<Mau[]>([]);
  const [soGhe, setSoGhe] = useState<SoGhe[]>([]);
  const [soDayGhe, setSoDayGhe] = useState<SoDayGhe[]>([]);
  const [kichThuoc, setKichThuoc] = useState<KichThuoc[]>([]);
  const [doTuoi, setDoTuoi] = useState<DoTuoi[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [phongCachList, setPhongCachList] = useState<any[]>([]);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  //Đảm bảo component được mounted ở client trước khi sử dụng các tính năng client-side
  useEffect(() => {
    setIsMounted(true);

    // Kiểm tra xem hiện tại có phải là mobile view không
    const checkIsMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Kiểm tra ban đầu
    checkIsMobile();

    // Thêm event listener để cập nhật khi resize cửa sổ
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  //Load cart items từ localStorage
  useEffect(() => {
    if (isMounted) {
      const loadCartItems = () => {
        try {
          const cart = JSON.parse(localStorage.getItem("cart") || "[]");
          setCartItems(cart);

          //Tính tổng giá trị giỏ hàng
          const total = cart.reduce((sum: number, item: CartItem) => {
            const price = item.gia || item.gia_thue || item.gia_makeup || 0;
            return sum + price;
          }, 0);
          setCartTotal(total);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu giỏ hàng:", error);
        }
      };

      loadCartItems();
      getMau();
      getSoGhe();
      getSoDayGhe();
      getKichThuoc();
      getDoTuoi();
      getPhongCach();

      //Event listener cập nhật giỏ hàng
      window.addEventListener("cartUpdated", loadCartItems);
      return () => {
        window.removeEventListener("cartUpdated", loadCartItems);
      };
    }
  }, [isMounted]);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  //Thêm event listener để bắt sự kiện click bên ngoài để đóng header
  useEffect(() => {
    if (!isMounted) return;

    const handleClickOutside = (event: MouseEvent) => {
      const headerElement = document.querySelector('[data-id="header-test"]');
      if (
        expandHeader &&
        headerElement &&
        !headerElement.contains(event.target as Node) &&
        document.activeElement !== inputRef.current
      ) {
        setShowInput(false);
        setExpandHeader(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandHeader, isMounted]);

  const handleHomeClick = () => router.push("/guest");

  const handleCartClick = () => {
    setOpenCartDrawer(true);
  };

  const handleRemoveItem = (id: number, type: string) => {
    try {
      const updatedCart = cartItems.filter(
        (item) => !(item.id === id && item.type === type)
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);

      // Cập nhật tổng giỏ hàng
      const total = updatedCart.reduce((sum: number, item: CartItem) => {
        const price = item.gia || item.gia_thue || item.gia_makeup || 0;
        return sum + price;
      }, 0);
      setCartTotal(total);

      // Trigger event để cập nhật giỏ hàng
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const getMau = async () => {
    try {
      const res = await fetch("/api/mau");
      const data = await res.json();
      setMau(data.datas || []);
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

  const getPhongCach = async () => {
    try {
      const res = await fetch("/api/phongcach");
      const data = await res.json();
      setPhongCachList(data.datas || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu phong cách:", error);
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

    if (key === "kich_thuoc") {
      return (item as KichThuoc).kich_thuoc;
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

  const handleCheckout = () => {
    setOpenCartDrawer(false);
    router.push("/guest/checkout");
  };

  const handleContinueShopping = () => {
    setOpenCartDrawer(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Chỉ expand header trên desktop
    if (isMobileView) return;

    timeoutRef.current = setTimeout(() => {
      setExpandHeader(true);
    }, 100);
    timeoutRef.current = setTimeout(() => {
      setShowInput(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Chỉ ẩn header expand trên desktop
    if (isMobileView) return;

    timeoutRef.current = setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setShowInput(false);
        setExpandHeader(false);
      }
    }, 100);
  };

  useEffect(() => {
    // Hàm đọc giỏ hàng từ localStorage và cập nhật số lượng
    const updateCartCount = () => {
      try {
        const cart = localStorage.getItem("cart");
        if (cart) {
          const cartItems = JSON.parse(cart);
          setCartCount(cartItems.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng:", error);
        setCartCount(0);
      }
    };

    // Cập nhật ngay khi component mount
    updateCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng
    window.addEventListener("cartUpdated", updateCartCount);

    // Cleanup
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Hàm lấy tên sản phẩm tùy theo loại
  const getItemName = (item: CartItem): string => {
    return item.ten || item.ten_rap || item.ten_makeup || "Sản phẩm không tên";
  };

  // Hàm lấy ảnh sản phẩm tùy theo loại
  const getItemImage = (item: CartItem): string => {
    return item.anh || item.anh_rap || item.anh_makeup || "";
  };

  // Hàm lấy giá sản phẩm tùy theo loại
  const getItemPrice = (item: CartItem): number => {
    return item.gia || item.gia_thue || item.gia_makeup || 0;
  };

  // Hàm lấy tên phong cách từ ID
  const getPhongCachName = (phongCachId: number): string => {
    const phongCach = phongCachList.find((pc) => pc.id === phongCachId);
    return phongCach ? phongCach.ten_phong_cach : "Không xác định";
  };

  // Cập nhật hàm getItemDetails
  const getItemDetails = (
    item: CartItem
  ): { primary: string; secondary: string; extraInfo?: string } => {
    switch (item.type) {
      case "vaycuoi":
        return {
          primary:
            mau.length > 0 && item.mau_id
              ? getValueById(mau, item.mau_id, "mau")
              : "Không xác định",
          secondary:
            kichThuoc.length > 0 && item.kich_thuoc_id
              ? getValueById(kichThuoc, item.kich_thuoc_id, "kich_thuoc")
              : "Không xác định",
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
          } / Số dãy: ${
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

  return (
    <>
      {isMounted && expandHeader && !isMobileView && (
        <div
          className={`z-30 fixed inset-0 bg-black/20 transition-all duration-300 ease-in-out 
          ${
            showInput ? "backdrop-blur-lg" : "backdrop-blur-none opacity-0"
          } delay-50`}
        ></div>
      )}
      <div
        className={`group z-50 fixed top-0 left-0 right-0 transition-all duration-300
          ${
            expandHeader && !isMobileView
              ? "bg-white h-[15vh] md:h-[15vh]"
              : isMobileView
              ? "h-[6vh]"
              : "h-[8vh]"
          } 
          ${scrolled || !isMainPage ? "bg-white" : "hover:bg-white"}`}
        data-id="header-test"
      >
        {/* Desktop Header */}
        <div className="hidden md:flex flex-row justify-between items-center h-[8vh]">
          <div className="basis-1/5 transition duration-300 px-10">
            <button onClick={handleHomeClick}>
              <Image
                src="/Logo.png"
                alt="Logo"
                width={128}
                height={128}
                className={`size-32 mt-2 transition duration-300 invert ${
                  scrolled || !isMainPage ? "invert-0" : "group-hover:invert-0"
                }`}
              />
            </button>
          </div>
          <div
            className={`basis-2/5 flex flex-row justify-evenly transition duration-300 tracking-tight text-lg 
              ${
                scrolled || !isMainPage ? "text-black" : "text-white"
              } group-hover:text-black`}
          >
            <button
              className={`uppercase alumni2 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-300 after:bg-black after:w-0 hover:after:w-full`}
              onClick={handleHomeClick}
            >
              Trang chủ
            </button>
            <button
              className={`uppercase alumni2 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-300 after:bg-black
              ${
                pathname === "/guest/vaycuoi"
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
              onClick={() => router.push("/guest/vaycuoi")}
            >
              Váy cưới
            </button>
            <button
              className={`uppercase alumni2 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-300 after:bg-black
              ${
                pathname === "/guest/rapcuoi"
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
              onClick={() => router.push("/guest/rapcuoi")}
            >
              Rạp cưới
            </button>
            <button
              className={`uppercase alumni2 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:transition-all after:duration-300 after:bg-black
              ${
                pathname === "/guest/makeup"
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              }`}
              onClick={() => router.push("/guest/makeup")}
            >
              make up
            </button>
          </div>

          <div>
            <div
              className={`px-12 basis-1/5 flex justify-between items-center gap-x-10 transition duration-300 tracking-tight
                ${
                  scrolled || !isMainPage ? "text-black" : "text-white"
                } group-hover:text-black`}
            >
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button className="uppercase alumni2 text-md relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                  Search
                </button>
              </div>
              <div className="flex items-center space-x-4 relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300">
                {cartCount > 0 ? (
                  <Badge
                    content={cartCount}
                    className={`bg-white/30 backdrop-blur-sm rounded-xl cursor-pointer absolute -right-3 text-black bg-none bg-clip-text font-normal transition-colors duration-300 ${
                      scrolled || !isMainPage ? "text-black" : "text-white"
                    } group-hover:text-black`}
                  >
                    <button
                      onClick={handleCartClick}
                      className="uppercase alumni2 text-md relative "
                    >
                      Giỏ Hàng
                    </button>
                  </Badge>
                ) : (
                  <button
                    onClick={handleCartClick}
                    className={`uppercase alumni2 text-md relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300 transition-colors duration-300 ${
                      scrolled || !isMainPage ? "text-black" : "text-white"
                    } group-hover:text-black`}
                  >
                    Giỏ Hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex sticky top-0 left-0 right-0 bg-white z-50 md:hidden justify-between items-center h-[6vh] px-4">
          <IconButton
            variant="text"
            className="text-black"
            onClick={() => setOpenMobileMenu(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </IconButton>

          <div className="absolute left-1/2 transform -translate-x-1/2">
            <button onClick={handleHomeClick}>
              <Image
                src="/Logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="size-20 mt-1 transition duration-300 invert-0"
              />
            </button>
          </div>

          <div className="flex items-center gap-1">
            <IconButton
              variant="text"
              className="text-black"
              onClick={() => setShowInput(!showInput)}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </IconButton>

            <div className="">
              <IconButton
                variant="text"
                className="text-black"
                onClick={handleCartClick}
              >
                <ShoppingCartIcon className="h-5 w-5 relative" />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showInput && (
          <div className="md:hidden bg-white px-4 py-2">
            <Input
              ref={inputRef}
              variant="outlined"
              className="border border-gray-300 rounded-md"
              placeholder="Tìm kiếm..."
              icon={
                <button>
                  <MagnifyingGlassIcon className="h-5 w-5" color="black" />
                </button>
              }
            />
          </div>
        )}

        {expandHeader && (
          <div
            className="hidden md:flex justify-end bg-white"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {showInput && (
              <div className="w-72 mr-10 -mt-3">
                <Input
                  ref={inputRef}
                  variant="static"
                  className="border-b"
                  icon={
                    <button>
                      <HiArrowLongRight className="size-6" color="black" />
                    </button>
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      <Drawer
        open={openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        className="p-4"
        placement="left"
      >
        <div className="flex items-center justify-between mb-6">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-normal tracking-tighter uppercase"
          >
            Menu
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenMobileMenu(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="flex flex-col gap-4">
          <button
            className={`py-2 text-left uppercase alumni2 text-lg ${
              pathname === "/guest" ? "font-bold" : ""
            }`}
            onClick={() => {
              router.push("/guest");
              setOpenMobileMenu(false);
            }}
          >
            Trang chủ
          </button>
          <button
            className={`py-2 text-left uppercase alumni2 text-lg ${
              pathname === "/guest/vaycuoi" ? "font-bold" : ""
            }`}
            onClick={() => {
              router.push("/guest/vaycuoi");
              setOpenMobileMenu(false);
            }}
          >
            Váy cưới
          </button>
          <button
            className={`py-2 text-left uppercase alumni2 text-lg ${
              pathname === "/guest/rapcuoi" ? "font-bold" : ""
            }`}
            onClick={() => {
              router.push("/guest/rapcuoi");
              setOpenMobileMenu(false);
            }}
          >
            Rạp cưới
          </button>
          <button
            className={`py-2 text-left uppercase alumni2 text-lg ${
              pathname === "/guest/makeup" ? "font-bold" : ""
            }`}
            onClick={() => {
              router.push("/guest/makeup");
              setOpenMobileMenu(false);
            }}
          >
            Make up
          </button>
        </div>
      </Drawer>

      {/* Giỏ Hàng Drawer */}
      <style jsx global>
        {hideScrollbarCSS}
      </style>
      <Drawer
        open={openCartDrawer}
        onClose={() => setOpenCartDrawer(false)}
        className="p-4 h-[90vh]"
        placement="right"
        size={700}
      >
        <div className="flex items-center justify-between mb-4">
          <Typography
            variant="h5"
            color="blue-gray"
            className="font-normal tracking-tighter uppercase"
          >
            giỏ hàng
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenCartDrawer(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </IconButton>
        </div>

        <div className="flex flex-col gap-5 h-[75vh] overflow-y-auto pr-2 hide-scrollbar">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const details = getItemDetails(item);
              const uniqueKey = `${item.type}-${item.id}`;
              return (
                <div
                  key={uniqueKey}
                  className="flex border-b border-gray-200 pb-4 mb-2"
                >
                  <div className="w-1/3 h-fit bg-gray-100">
                    <img
                      src={getItemImage(item)}
                      alt={getItemName(item)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-2/3 pl-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <Typography
                          variant="h6"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {getItemName(item)}
                        </Typography>
                        <Typography
                          color="blue-gray"
                          className="text-sm font-medium"
                        >
                          {getItemPrice(item)?.toLocaleString()} đ
                        </Typography>
                      </div>

                      <Typography color="gray" className="text-sm mb-2">
                        {details.primary}
                        <span className="mx-2">/</span>
                        {details.secondary}
                      </Typography>

                      {details.extraInfo && (
                        <Typography color="gray" className="text-sm mb-2">
                          {details.extraInfo}
                        </Typography>
                      )}

                      <button
                        className="text-red-500 text-sm mb-3"
                        onClick={() => handleRemoveItem(item.id, item.type)}
                      >
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <Typography
                variant="h6"
                color="blue-gray"
                className="font-normal mb-2"
              >
                Giỏ hàng trống
              </Typography>
              <Typography
                variant="small"
                color="blue-gray"
                className="text-center"
              >
                Hãy thêm sản phẩm vào giỏ hàng của bạn
              </Typography>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t">
            <div className="flex justify-between mt-4">
              <Typography variant="h6" color="blue-gray" className="uppercase">
                tổng tiền:
              </Typography>
              <Typography variant="h6" color="blue-gray" className="uppercase">
                {cartTotal.toLocaleString()} ₫
              </Typography>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="filled"
                color="black"
                className="bg-black text-white py-2 rounded-none uppercase"
                onClick={handleCheckout}
              >
                thanh toán
              </Button>
              <Button
                variant="outlined"
                color="black"
                className="border-black text-black py-2 rounded-none uppercase"
                onClick={handleContinueShopping}
              >
                tiếp tục mua sắm
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Header;
