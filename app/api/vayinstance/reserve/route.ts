import { NextRequest, NextResponse } from "next/server";
import { VayInstanceService } from "@/app/services/vayInstance.service";

export async function POST(request: NextRequest) {
  console.log("API_RESERVE: Received request to /api/vayinstance/reserve");
  try {
    const body = await request.json();
    console.log("API_RESERVE: Request body:", body);
    const { vayId, startDate, endDate } = body;

    if (!vayId || !startDate || !endDate) {
      console.error("API_RESERVE: Missing required fields", {
        vayId,
        startDate,
        endDate,
      });
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc (vayId, startDate, endDate)" },
        { status: 400 }
      );
    }

    console.log(
      `API_RESERVE: Calling VayInstanceService.reserveInstance with vayId: ${vayId}, startDate: ${startDate}, endDate: ${endDate}`
    );
    const reservedInstance = await VayInstanceService.reserveInstance(
      Number(vayId),
      new Date(startDate),
      new Date(endDate)
    );

    if (!reservedInstance) {
      console.log(
        "API_RESERVE: No instance available for reservation or reservation failed."
      );
      return NextResponse.json(
        {
          message:
            "Không có váy nào sẵn có để đặt trước trong khoảng thời gian này.",
        },
        { status: 404 }
      );
    }

    console.log(
      "API_RESERVE: Instance reserved successfully:",
      reservedInstance
    );
    return NextResponse.json(reservedInstance, { status: 200 });
  } catch (error) {
    console.error("API_RESERVE: Error during reservation:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi máy chủ nội bộ";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
