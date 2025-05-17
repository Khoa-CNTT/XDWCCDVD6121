import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";

// Get all instances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vayId = searchParams.get('vayId');

    if (!vayId) {
      return NextResponse.json(
        { message: "Vay ID is required" },
        { status: 400 }
      );
    }

    const instances = await prisma.vayInstance.findMany({
      where: {
        vay_id: parseInt(vayId),
      },
    });

    return NextResponse.json({ instances }, { status: 200 });
  } catch (error) {
    console.error("Error fetching instances:", error);
    return NextResponse.json(
      { message: "Failed to fetch instances" },
      { status: 500 }
    );
  }
}

// Create a new rental
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vayId, startDate, endDate } = body;

    if (!vayId || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find an available instance for the given dress
    const availableInstance = await prisma.vayInstance.findFirst({
      where: {
        vay_id: vayId,
        status: 'AVAILABLE',
        OR: [
          {
            rental_start: null,
            rental_end: null,
          },
          {
            AND: [
              {
                OR: [
                  { rental_end: { lt: new Date(startDate) } },
                  { rental_start: { gt: new Date(endDate) } },
                ],
              },
            ],
          },
        ],
      },
    });

    if (!availableInstance) {
      return NextResponse.json(
        { message: "Không có váy trống trong khoảng thời gian này" },
        { status: 400 }
      );
    }

    // Update the instance with rental dates
    const updatedInstance = await prisma.vayInstance.update({
      where: {
        id: availableInstance.id,
      },
      data: {
        status: 'RENTED',
        rental_start: new Date(startDate),
        rental_end: new Date(endDate),
      },
    });

    return NextResponse.json(updatedInstance, { status: 200 });
  } catch (error) {
    console.error("Error creating rental:", error);
    return NextResponse.json(
      { message: "Failed to create rental" },
      { status: 500 }
    );
  }
}
