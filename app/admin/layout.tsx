"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronDown, ShoppingBag, CreditCard, Package, Ruler, Palette, Clock, Building, Brush, Image, Rows } from "lucide-react"; 

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);
    const [expandedDressMenu, setExpandedDressMenu] = useState(true);
    const [expandedMakeupMenu, setExpandedMakeupMenu] = useState(true);
    const [expandedVenueMenu, setExpandedVenueMenu] = useState(true);

    // Các page cần full screen (không có left menu)
    const fullScreenPages = ["/admin/login", ];

    if (fullScreenPages.includes(pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="flex">
            {/* Sidebar - fixed and responsive */}
            <div className={`
                fixed top-0 left-0 z-50 h-screen w-72 bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl flex flex-col
                transition-all duration-300 ease-in-out
                ${showMenu ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Link href="/admin" onClick={() => setShowMenu(false)} className="hover:text-blue-400 transition-colors">
                            Admin Panel
                        </Link>
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto px-4">
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href="/admin/qlydonhang"
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all group"
                                onClick={() => setShowMenu(false)}
                                id="order-management"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:text-blue-400" />
                                Quản lý đơn hàng
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/qlytransaction"
                                className="flex items-center gap-3 px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all group"
                                onClick={() => setShowMenu(false)}
                                id="transaction-management"
                            >
                                <CreditCard className="w-5 h-5 group-hover:text-blue-400" />
                                Quản lý Transaction
                            </Link>
                        </li>
                        <li className="relative">
                            <div className="relative">
                                <div className="flex">
                                    <Link
                                        href="/admin/qlyvaycuoi"
                                        className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="wedding-dress-management"
                                    >
                                        <Package className="w-5 h-5 group-hover:text-blue-400" />
                                        Quản lý váy cưới
                                    </Link>
                                    <button
                                        onClick={() => setExpandedDressMenu(!expandedDressMenu)}
                                        className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${expandedDressMenu ? 'bg-gray-700' : ''}`}
                                        aria-label="Toggle dress submenu"
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedDressMenu ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <ul className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${expandedDressMenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <li>
                                    <Link
                                        href="/admin/size"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="size-management"
                                    >
                                        <Ruler className="w-4 h-4 group-hover:text-blue-400" />
                                        Quản lý Size
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/mau"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="color-management"
                                    >
                                        <Palette className="w-4 h-4 group-hover:text-blue-400" />
                                        Quản lý màu sắc
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/dotuoi"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="age-management"
                                    >
                                        <Clock className="w-4 h-4 group-hover:text-blue-400" />
                                        Quản lý độ tuổi
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="relative">
                            <div className="relative">
                                <div className="flex">
                                    <Link
                                        href="/admin/qlyrapcuoi"
                                        className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="wedding-venue-management"
                                    >
                                        <Building className="w-5 h-5 group-hover:text-blue-400" />
                                        Quản lý rạp cưới
                                    </Link>
                                    <button
                                        onClick={() => setExpandedVenueMenu(!expandedVenueMenu)}
                                        className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${expandedVenueMenu ? 'bg-gray-700' : ''}`}
                                        aria-label="Toggle venue submenu"
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedVenueMenu ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <ul className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${expandedVenueMenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <li>
                                    <Link
                                        href="/admin/sodayghe"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="seat-rows-management"
                                    >
                                        <Rows className="w-4 h-4 group-hover:text-blue-400" />
                                        Quản lý số dãy ghế
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/admin/soghe"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="seat-management"
                                    >
                                        <Rows className="w-4 h-4 group-hover:text-blue-400" />
                                        Quản lý số ghế
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="relative">
                            <div className="relative">
                                <div className="flex">
                                    <Link
                                        href="/admin/makeup"
                                        className="flex-1 flex items-center gap-3 px-4 py-3 text-gray-300 rounded-l-lg hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="makeup-management"
                                    >
                                        <Brush className="w-5 h-5 group-hover:text-blue-400" />
                                        MAKEUP
                                    </Link>
                                    <button
                                        onClick={() => setExpandedMakeupMenu(!expandedMakeupMenu)}
                                        className={`px-2 py-3 text-gray-300 rounded-r-lg hover:bg-gray-700 hover:text-white transition-all group border-l border-gray-600 ${expandedMakeupMenu ? 'bg-gray-700' : ''}`}
                                        aria-label="Toggle makeup submenu"
                                    >
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMakeupMenu ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </div>
                            <ul className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-200 ${expandedMakeupMenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <li>
                                    <Link
                                        href="/admin/phongcach"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-all group"
                                        onClick={() => setShowMenu(false)}
                                        id="makeup-style-management"
                                    >
                                        <Image className="w-4 h-4 group-hover:text-blue-400" />
                                        Phong cách Makeup
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <div className="p-4">
                    <button
                        onClick={() => {
                            document.cookie = 'auth-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            window.location.href = "/admin/login";
                        }}
                        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
                        id="logout-button"
                    >
                        ĐĂNG XUẤT
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-h-screen md:ml-72 w-full">
                {/* Header cho mobile */}
                <div className="md:hidden flex items-center justify-between p-4 bg-gray-800 text-white sticky top-0 z-40">
                    <button onClick={() => setShowMenu(!showMenu)} className="hover:bg-gray-700 p-2 rounded-lg transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-lg font-bold">Admin</span>
                </div>

                <main className="p-5">
                    {children}
                </main>
            </div>
        </div>
    );
}
