import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token và mật khẩu mới là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra mật khẩu có đủ mạnh không
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Mật khẩu phải có ít nhất 6 ký tự" },
        { status: 400 }
      );
    }

    // Tìm token trong database
    const tokenData = await prisma.token.findUnique({
      where: { 
        token,
        purpose: "reset"
      },
      include: {
        administrator: true
      }
    });

    if (!tokenData) {
      return NextResponse.json(
        { message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (new Date() > tokenData.expires) {
      // Xóa token đã hết hạn khỏi database
      await prisma.token.delete({ where: { token } });
      
      return NextResponse.json(
        { message: "Token đã hết hạn" },
        { status: 400 }
      );
    }

    // Cập nhật mật khẩu cho admin
    await prisma.administrator.update({
      where: { id: tokenData.admin_id },
      data: {
        password: password,
      },
    });

    // Xóa token sau khi sử dụng
    await prisma.token.delete({ where: { token } });

    return NextResponse.json(
      { message: "Đặt lại mật khẩu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi đặt lại mật khẩu" },
      { status: 500 }
    );
  }
}
