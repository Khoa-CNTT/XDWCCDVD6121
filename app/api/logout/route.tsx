import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";

export async function POST(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('token')?.value;
    
    if (token) {
      // Delete the token from database
      await prisma.token.deleteMany({
        where: {
          token: token
        }
      });
      
      // Create a response
      const response = NextResponse.json({ msg: "Đăng xuất thành công" }, { status: 200 });
      
      // Delete the cookie
      response.cookies.delete('token');
      
      return response;
    }
    
    return NextResponse.json({ msg: "Đã đăng xuất" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi đăng xuất:", error);
    return NextResponse.json({ msg: "Đăng xuất thất bại" }, { status: 500 });
  }
}