import { NextRequest, NextResponse } from "next/server";
import { VayInstanceService } from "@/app/services/vayInstance.service";

export async function POST(request: NextRequest) {
  console.log("API_RELEASE: Received request to /api/vayinstance/release");
  try {
    const body = await request.json();
    const { instanceId } = body;

    if (!instanceId) {
      console.error("API_RELEASE: Missing required field 'instanceId'", body);
      return NextResponse.json(
        { message: "Thiếu thông tin bắt buộc (instanceId)" },
        { status: 400 }
      );
    }

    console.log(`API_RELEASE: Attempting to release instance ${instanceId}`);

    // First check if the instance exists and get its current state
    const instance = await VayInstanceService.getInstance(Number(instanceId));

    if (!instance) {
      console.log(`API_RELEASE: Instance ${instanceId} not found`);
      return NextResponse.json(
        { message: `Không tìm thấy váy với ID ${instanceId}` },
        { status: 404 }
      );
    }

    // If instance exists but is not in RESERVED state, we can return early
    if (instance.status !== "RESERVED") {
      console.log(
        `API_RELEASE: Instance ${instanceId} is not in RESERVED state (current: ${instance.status})`
      );
      return NextResponse.json(
        {
          message: `Váy hiện không ở trạng thái chờ (${instance.status})`,
          currentStatus: instance.status,
        },
        { status: 200 } // Using 200 as this is not an error condition
      );
    }

    // Try to release the instance
    const releasedInstance = await VayInstanceService.releaseReservedInstance(
      Number(instanceId)
    );

    if (!releasedInstance) {
      // This should not happen as we already checked existence, but just in case
      console.error(
        `API_RELEASE: Unexpected - Failed to release instance ${instanceId} after confirmation of RESERVED state`
      );
      return NextResponse.json(
        {
          message: "Không thể giải phóng váy do lỗi hệ thống",
          originalStatus: instance.status,
        },
        { status: 500 }
      );
    }

    // Confirm the instance was actually released
    if (
      releasedInstance.status === "AVAILABLE" &&
      !releasedInstance.reserved_at
    ) {
      console.log(`API_RELEASE: Successfully released instance ${instanceId}`);
      return NextResponse.json(
        {
          message: "Đã giải phóng váy thành công",
          instance: releasedInstance,
        },
        { status: 200 }
      );
    } else {
      // This case shouldn't happen given our service implementation
      console.error(
        `API_RELEASE: Unexpected state after release - instance ${instanceId}`,
        `Expected status AVAILABLE, got ${releasedInstance.status}`,
        `Reserved_at should be null, got ${releasedInstance.reserved_at}`
      );
      return NextResponse.json(
        {
          message: "Váy được giải phóng nhưng trạng thái không như mong đợi",
          instance: releasedInstance,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API_RELEASE: Error during release operation:", error);
    const errorMessage =
      error instanceof Error
        ? `Lỗi khi giải phóng váy: ${error.message}`
        : "Lỗi máy chủ nội bộ";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}
