"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

// Các kiểu dữ liệu
type AdminData = {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type AuthState = {
  isLoading: boolean;
  isAuthenticated: boolean;
  admin: AdminData | null;
};

// Component bọc xác thực cho Admin Layout
export default function AdminAuthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    admin: null,
  });
  const router = useRouter();
  const pathname = usePathname();
  // Kiểm tra xem có phải trang không cần xác thực
  const isPublicPage = [
    "/admin/login",
    "/admin/login/quenmk",
    "/admin/login/quenmk/reset",
  ].some((publicPath) => pathname.startsWith(publicPath));
  useEffect(() => {
    // Hàm kiểm tra xác thực
    async function checkAuth() {
      // Nếu là trang công khai, không cần kiểm tra xác thực
      if (isPublicPage) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          admin: null,
        });
        return;
      }
      try {
        const response = await fetch("/api/token");

        if (!response.ok) {
          // Nếu token không hợp lệ
          throw new Error("Invalid token");
        }
        const data = await response.json();

        if (response.ok && data.authenticated) {
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            admin: data.admin,
          });
        } else {
          // Nếu không xác thực, chuyển hướng đến trang đăng nhập
          router.push("/admin/login");
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra xác thực:", error);
        // Xóa token và admin data khi có lỗi xác thực
        localStorage.removeItem("admin-token");
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          admin: null,
        });
        // Chuyển hướng về trang đăng nhập
        router.replace("/admin/login");
      }
    }

    checkAuth();
  }, [router, isPublicPage]);
  // Nếu là trang công khai hoặc đã xác thực, hiển thị nội dung
  if (isPublicPage || !authState.isLoading) {
    return <>{children}</>;
  }

  // Hiển thị loader trong khi kiểm tra xác thực
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-amber-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  );
}
