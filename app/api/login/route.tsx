import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const data = await request.json();

  if (!data.password) {
    return NextResponse.json({ msg: "Password is required" }, { status: 400 });
  }

  if (!data.username && !data.email) {
    return NextResponse.json(
      { msg: "Username or email is required" },
      { status: 400 }
    );
  }

  const whereCondition: any = {
    password: data.password,
  };

  if (data.username) {
    whereCondition.username = data.username;
  } else if (data.email) {
    whereCondition.email = data.email;
  }

  const datas = await prisma.administrator.findFirst({
    where: whereCondition,
  });

  if (datas) {
    return NextResponse.json({ msg: "success" }, { status: 201 });
  } else {
    return NextResponse.json({ msg: "error" }, { status: 400 });
  }
}
