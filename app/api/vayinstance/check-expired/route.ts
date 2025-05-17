import { NextRequest, NextResponse } from "next/server";
import { VayInstanceService } from "@/app/services/vayInstance.service";

export async function GET(request: NextRequest) {
  try {
    const releasedCount =
      await VayInstanceService.checkAndReleaseExpiredReservations();

    return NextResponse.json(
      {
        success: true,
        message:
          releasedCount > 0
            ? `Đã giải phóng ${releasedCount} váy hết hạn`
            : "Không có váy nào cần giải phóng",
        releasedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "API_CHECK_EXPIRED: Error checking expired reservations:",
      error
    );
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi máy chủ nội bộ";
    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
