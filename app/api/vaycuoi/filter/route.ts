import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { chieu_cao, can_nang } = body;

    if (typeof chieu_cao !== "number" || typeof can_nang !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const suitableSizes = await prisma.size.findMany({
      where: {
        min_chieu_cao: { lte: chieu_cao },
        max_chieu_cao: { gte: chieu_cao },
        min_can_nang: { lte: can_nang },
        max_can_nang: { gte: can_nang },
      },
      select: { id: true },
    });

    const sizeIds = suitableSizes.map((size) => size.id);

    if (sizeIds.length === 0) {
      return NextResponse.json({ datas: [] }, { status: 200 });
    }

    const vayPhuHop = await prisma.vayCuoi.findMany({
      where: {
        size_id: { in: sizeIds },
      },
      include: {
        size_relation: true,
        do_tuoi_relation: true,
        mau_release: true,
      },
    });

    return NextResponse.json({ datas: vayPhuHop }, { status: 200 });
  } catch (err) {
    console.error("Error filtering vay cuoi:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
