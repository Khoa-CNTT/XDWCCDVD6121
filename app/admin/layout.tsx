"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  ChevronDown,
  ShoppingBag,
  Package,
  Ruler,
  Palette,
  Clock,
  Building,
  Brush,
  Image as ImageIcon,
  Rows,
  LogOut,
} from "lucide-react";
import AdminAuthWrapper from "./components/AdminAuthWrapper";

// Import Components
import DashBoard from "./manager/dashboard/page";
import DonHang from "./manager/donhang/page";
import VayCuoi from "./manager/vaycuoi/page";
import Size from "./manager/utils/size/page";
import Mau from "./manager/utils/mau/page";
import DoTuoi from "./manager/utils/dotuoi/page";
import RapCuoi from "./manager/rapcuoi/page";
import SoDayGhe from "./manager/utils/sodayghe/page";
import SoGhe from "./manager/utils/soghe/page";
import Makeup from "./manager/makeup/page";
import PhongCach from "./manager/utils/phongcach/page";

type PageComponent =
  | "dashboard"
  | "donhang"
  | "vaycuoi"
  | "size"
  | "mau"
  | "dotuoi"
  | "rapcuoi"
  | "sodayghe"
  | "soghe"
  | "makeup"
  | "phongcach";

const getComponentForPage = (page: PageComponent) => {
  switch (page) {
    case "dashboard":
      return <DashBoard />;
    case "donhang":
      return <DonHang />;
    case "vaycuoi":
      return <VayCuoi />;
    case "size":
      return <Size />;
    case "mau":
      return <Mau />;
    case "dotuoi":
      return <DoTuoi />;
    case "rapcuoi":
      return <RapCuoi />;
    case "sodayghe":
      return <SoDayGhe />;
    case "soghe":
      return <SoGhe />;
    case "makeup":
      return <Makeup />;
    case "phongcach":
      return <PhongCach />;
    default:
      return <DashBoard />;
  }
};

export default function AdminLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [expandedDressMenu, setExpandedDressMenu] = useState(true);
  const [expandedMakeupMenu, setExpandedMakeupMenu] = useState(true);
  const [expandedVenueMenu, setExpandedVenueMenu] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageComponent>("dashboard");
  const pathname = usePathname();

  // Kiểm tra xem có phải trang không cần xác thực
  const isPublicPage = [
    "/admin/login",
    "/admin/login/quenmk",
    "/admin/login/quenmk/reset",
  ].includes(pathname);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        localStorage.removeItem("admin-token");
        window.location.href = "/admin/login";
      }
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // If we're on a public page like login, render children directly
  if (isPublicPage) {
    return <AdminAuthWrapper>{children}</AdminAuthWrapper>;
  }

  // Otherwise render the admin panel UI
  return (
    <AdminAuthWrapper>
      <div className="flex">
        {/* Sidebar - fixed and responsive */}
        <div
          className={`
          fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl flex flex-col
          transition-all duration-300 ease-in-out
          ${showMenu ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        >
          <div className="p-6">
            <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentPage("dashboard");
                  setShowMenu(false);
                }}
                className="hover:text-blue-400 transition-colors"
              >
                Admin Panel
              </button>
            </h1>
          </div>

          <div className="flex-1 overflow-y-auto px-4">
            <ul className="space-y-2">
              <li>
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all group"
                  onClick={() => {
                    setCurrentPage("donhang");
                    setShowMenu(false);
                  }}
                  id="order-management"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:text-blue-400" />
                  Quản lý đơn hàng
                </button>
              </li>
              <li className="relative">
                <div className="relative">
                  <div className="flex">
                    <button
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("vaycuoi");
                        setShowMenu(false);
                      }}
                      id="wedding-dress-management"
                    >
                      <Package className="w-5 h-5 group-hover:text-blue-400" />
                      Quản lý váy cưới
                    </button>
                    <button
                      onClick={() => setExpandedDressMenu(!expandedDressMenu)}
                      className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${
                        expandedDressMenu ? "bg-gray-700" : ""
                      }`}
                      aria-label="Toggle dress submenu"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedDressMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <ul
                  className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
                    expandedDressMenu
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("size");
                        setShowMenu(false);
                      }}
                      id="size-management"
                    >
                      <Ruler className="w-4 h-4 group-hover:text-blue-400" />
                      Quản lý Size
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("mau");
                        setShowMenu(false);
                      }}
                      id="color-management"
                    >
                      <Palette className="w-4 h-4 group-hover:text-blue-400" />
                      Quản lý màu sắc
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("dotuoi");
                        setShowMenu(false);
                      }}
                      id="age-management"
                    >
                      <Clock className="w-4 h-4 group-hover:text-blue-400" />
                      Quản lý độ tuổi
                    </button>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <div className="relative">
                  <div className="flex">
                    <button
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("rapcuoi");
                        setShowMenu(false);
                      }}
                      id="wedding-venue-management"
                    >
                      <Building className="w-5 h-5 group-hover:text-blue-400" />
                      Quản lý rạp cưới
                    </button>
                    <button
                      onClick={() => setExpandedVenueMenu(!expandedVenueMenu)}
                      className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${
                        expandedVenueMenu ? "bg-gray-700" : ""
                      }`}
                      aria-label="Toggle venue submenu"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedVenueMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <ul
                  className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
                    expandedVenueMenu
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("sodayghe");
                        setShowMenu(false);
                      }}
                      id="seat-rows-management"
                    >
                      <Rows className="w-4 h-4 group-hover:text-blue-400" />
                      Quản lý số dãy ghế
                    </button>
                  </li>
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("soghe");
                        setShowMenu(false);
                      }}
                      id="seat-management"
                    >
                      <Rows className="w-4 h-4 group-hover:text-blue-400" />
                      Quản lý số ghế
                    </button>
                  </li>
                </ul>
              </li>
              <li className="relative">
                <div className="relative">
                  <div className="flex">
                    <button
                      className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("makeup");
                        setShowMenu(false);
                      }}
                      id="makeup-management"
                    >
                      <Brush className="w-5 h-5 group-hover:text-blue-400" />
                      MAKEUP
                    </button>
                    <button
                      onClick={() => setExpandedMakeupMenu(!expandedMakeupMenu)}
                      className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${
                        expandedMakeupMenu ? "bg-gray-700" : ""
                      }`}
                      aria-label="Toggle makeup submenu"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedMakeupMenu ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <ul
                  className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${
                    expandedMakeupMenu
                      ? "max-h-48 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <li>
                    <button
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                      onClick={() => {
                        setCurrentPage("phongcach");
                        setShowMenu(false);
                      }}
                      id="makeup-style-management"
                    >
                      <ImageIcon className="w-4 h-4 group-hover:text-blue-400" />
                      Phong cách Makeup
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
              id="logout-button"
            >
              <LogOut className="w-4 h-4" />
              ĐĂNG XUẤT
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen md:ml-72 w-full">
          {/* Header cho mobile */}{" "}
          <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white sticky top-0 z-40">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold">Admin</span>
            <button
              onClick={handleLogout}
              className="hover:bg-gray-700 p-2 rounded-lg transition-colors text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <main className="p-5">{getComponentForPage(currentPage)}</main>
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
