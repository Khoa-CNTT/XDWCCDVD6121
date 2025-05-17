import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Lấy token từ query parameters
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { 
          message: "Token không hợp lệ",
          valid: false 
        },
        { status: 400 }
      );
    }

    // Tìm token trong database
    const tokenData = await prisma.token.findUnique({
      where: { 
        token,
        purpose: "reset"
      },
    });

    if (!tokenData) {
      return NextResponse.json(
        { 
          message: "Token không hợp lệ hoặc đã hết hạn",
          valid: false 
        },
        { status: 400 }
      );
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (new Date() > tokenData.expires) {
      // Xóa token đã hết hạn khỏi database
      await prisma.token.delete({ where: { token } });
      
      return NextResponse.json(
        { 
          message: "Token đã hết hạn",
          valid: false 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Token hợp lệ",
        valid: true,
        admin_id: tokenData.admin_id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xác thực token:", error);
    return NextResponse.json(
      { 
        message: "Đã xảy ra lỗi khi xác thực token",
        valid: false 
      },
      { status: 500 }
    );
  }
}
