import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mark function as async since we're using await inside
export async function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /admin/dotuoi)
  const path = request.nextUrl.pathname; // Define paths that don't require authentication
  const publicPaths = [
    "/admin/login",
    "/admin/login/quenmk",
    "/admin/login/quenmk/reset",
    "/api/login",
    "/api/token",
    "/api/logout",
    "/api/password-reset/request",
    "/api/password-reset/verify",
    "/api/password-reset/reset",
  ];

  const isPublicPath =
    publicPaths.some((publicPath) => path.startsWith(publicPath)) ||
    !path.startsWith("/admin");
  // Get the token from cookies
  const token = request.cookies.get("token")?.value;

  // Nếu là admin route và không phải public path
  if (path.startsWith("/admin") && !isPublicPath) {
    // Nếu không có token, redirect về login
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    try {
      // Verify token
      const response = await fetch(`${request.nextUrl.origin}/api/token`, {
        headers: {
          Cookie: `token=${token}`,
        },
      });

      if (!response.ok) {
        // Token không hợp lệ, xóa cookie và redirect về login
        const response = NextResponse.redirect(
          new URL("/admin/login", request.url)
        );
        response.cookies.delete("token");
        return response;
      }
    } catch (error) {
      // Lỗi verify token, redirect về login
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Nếu đã đăng nhập và cố truy cập trang login
  if (token && path.startsWith("/admin/login")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/token",
    "/api/login",
    "/api/logout",
    "/api/password-reset/:path*",
    "/admin/login/quenmk",
    "/admin/login/quenmk/reset",
  ],
};
