import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";

// API endpoint để lấy thông tin admin từ token hiện tại
export async function GET(request: NextRequest) {
  try {
    // Lấy token từ cookies
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        msg: "Không tìm thấy token" 
      }, { status: 401 });
    }    // Tìm token trong database và lấy thông tin admin kèm theo
    const tokenData = await prisma.token.findFirst({
      where: { 
        token,
        purpose: "auth"
      },
      include: {
        administrator: {
          select: {
            id: true,
            username: true,
            email: true,
            created_at: true,
            updated_at: true
          }
        }
      }
    });

    if (!tokenData) {
      return NextResponse.json({ 
        authenticated: false,
        msg: "Token không hợp lệ" 
      }, { status: 401 });
    }

    // Kiểm tra xem token đã hết hạn chưa
    if (new Date() > tokenData.expires) {
      // Xóa token đã hết hạn khỏi database
      await prisma.token.delete({ where: { token } });
      
      return NextResponse.json({ 
        authenticated: false,
        msg: "Token đã hết hạn" 
      }, { status: 401 });
    }

    // Trả về thông tin admin
    return NextResponse.json({
      authenticated: true,
      admin: tokenData.administrator
    }, { status: 200 });
    
  } catch (error) {
    console.error("Lỗi xác thực token:", error);
    return NextResponse.json({ 
      authenticated: false,
      msg: "Lỗi server khi xác thực token" 
    }, { status: 500 });
  }
}
