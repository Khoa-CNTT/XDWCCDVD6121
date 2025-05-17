import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(request: NextRequest) {
  const data = await request.json();

  if (!data.password) {
    return NextResponse.json({ msg: "Mật khẩu là bắt buộc" }, { status: 400 });
  }

  if (!data.identifier) {
    return NextResponse.json(
      { msg: "Tên đăng nhập hoặc email là bắt buộc" },
      { status: 400 }
    );
  }

  // Tìm người dùng bằng username hoặc email
  const admin = await prisma.administrator.findFirst({
    where: {
      password: data.password,
      OR: [
        { username: data.identifier },
        { email: data.identifier }
      ]
    },
  });
  if (admin) {
    // Generate a random token
    const tokenValue = randomBytes(32).toString('hex');
    
    // Set token expiration (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    // Delete old auth tokens for this admin
    await prisma.token.deleteMany({
      where: {
        admin_id: admin.id,
        purpose: "auth"
      }
    });

    // Create a token in database
    await prisma.token.create({
      data: {
        token: tokenValue,
        admin_id: admin.id,
        purpose: "auth",
        expires: expiryDate,
      },
    });
      // Set the token in cookies
    const response = NextResponse.json({ msg: "success" }, { status: 201 });
    
    response.cookies.set({
      name: 'token',
      value: tokenValue,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiryDate,
      path: '/',
    });
    
    return response;
  } else {
    return NextResponse.json({ msg: "Thông tin đăng nhập không chính xác" }, { status: 400 });
  }
}
