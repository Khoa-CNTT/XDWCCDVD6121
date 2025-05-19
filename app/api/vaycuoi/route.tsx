import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const datas = await prisma.vayCuoi.findMany({
    include: {
      instances: true,
      mau_release: true,
      do_tuoi_relation: true,
      size_relation: true,
    },
  });
  return NextResponse.json({ datas: datas }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.ten ||
      !data.gia ||
      !data.so_luong ||
      !data.mau_id ||
      !data.do_tuoi_id ||
      !data.size_id
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Use transaction to ensure both dress and instances are created
    const result = await prisma.$transaction(async (tx) => {
      // Create the dress
      const newVay = await tx.vayCuoi.create({
        data: {
          ten: data.ten,
          gia: data.gia,
          anh: data.anh,
          mau_id: data.mau_id,
          do_tuoi_id: data.do_tuoi_id,
          size_id: data.size_id,
          chi_tiet: data.chi_tiet,
        },
      });
      let stt = 0;
      // Create instances based on so_luong
      const instances = await Promise.all(
        Array(data.so_luong)
          .fill(null)
          .map(() =>
            tx.vayInstance.create({
              data: {
                ten: `Váy số: ${++stt}`,
                vay_id: newVay.id,
                status: "AVAILABLE",
              },
            })
          )
      );

      return {
        vay: newVay,
        instances: instances,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating dress:", error);
    return NextResponse.json(
      { message: "Failed to create dress and instances" },
      { status: 500 }
    );
  }
}
