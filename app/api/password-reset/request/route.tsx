import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm admin bằng email
    const admin = await prisma.administrator.findFirst({
      where: {
        email: email,
      },
    });

    if (!admin) {
      // Để tránh lộ thông tin về người dùng tồn tại hay không, luôn trả về thành công
      return NextResponse.json(
        { message: "Nếu email này tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu" },
        { status: 200 }
      );
    }

    // Tạo token ngẫu nhiên
    const tokenValue = randomBytes(32).toString("hex");

    // Thiết lập thời gian hết hạn (1 giờ)
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Xóa các token reset password cũ của admin nếu có
    await prisma.token.deleteMany({
      where: {
        admin_id: admin.id,
        purpose: "reset"
      },
    });

    // Tạo token mới trong database
    await prisma.token.create({
      data: {
        token: tokenValue,
        admin_id: admin.id,
        purpose: "reset",
        expires: expiryDate,
      },
    });

    // Tạo URL reset password
    const resetUrl = `${request.nextUrl.origin}/admin/login/quenmk/reset?token=${tokenValue}`;

    // Cấu hình transporter cho nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER || "smtp.gmail.com",
      port: parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Tạo nội dung email
    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@wedding.com",
      to: email,
      subject: "Đặt lại mật khẩu cho tài khoản Wedding Admin",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d97706;">Đặt lại mật khẩu</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu:</p>
          <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #d97706; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px;">Đặt lại mật khẩu</a>
          </p>
          <p>Liên kết này sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ Wedding</p>
        </div>
      `,
    };

    // Gửi email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Nếu email này tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu đặt lại mật khẩu:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi khi xử lý yêu cầu của bạn" },
      { status: 500 }
    );
  }
}
