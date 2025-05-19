import prisma from "@/prisma/pclient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vayId = parseInt(params.id);

    // Sử dụng transaction để đảm bảo tính toàn vẹn dữ liệu
    await prisma.$transaction(async (tx) => {
      // Xóa tất cả instances của váy cưới
      await tx.vayInstance.deleteMany({
        where: { vay_id: vayId },
      });

      // Sau đó xóa váy cưới
      await tx.vayCuoi.delete({
        where: { id: vayId },
      });
    });

    return NextResponse.json(
      { message: "deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting", error);
    return NextResponse.json({ message: "Failed to delete" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vayId = parseInt(params.id);
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { message: "Missing request body" },
        { status: 400 }
      );
    } // Lấy số lượng instance hiện tại
    const currentInstances = await prisma.vayInstance.count({
      where: { vay_id: vayId },
    });

    // Số lượng instance cần thêm hoặc xóa
    const diff = body.so_luong - currentInstances;

    // Cập nhật thông tin váy cưới
    const datas = await prisma.$transaction(async (tx) => {
      // Cập nhật thông tin cơ bản của váy cưới
      const updatedVay = await tx.vayCuoi.update({
        where: { id: vayId },
        data: {
          ten: body.ten,
          gia: body.gia,
          anh: body.anh,
          mau_id: body.mau_id,
          do_tuoi_id: body.do_tuoi_id,
          size_id: body.size_id,
          chi_tiet: body.chi_tiet,
        },
        include: {
          instances: true,
        },
      });
      if (diff > 0) {
        // Lấy số lớn nhất hiện tại trong tên váy để tiếp tục đánh số
        const existingInstances = await tx.vayInstance.findMany({
          where: { vay_id: vayId },
          orderBy: { id: "desc" },
        });

        // Tìm số lớn nhất trong tên váy hiện tại
        let maxNumber = 0;
        existingInstances.forEach((instance) => {
          const match = instance.ten.match(/Váy số: (\d+)/);
          if (match && match[1]) {
            const num = parseInt(match[1]);
            if (num > maxNumber) maxNumber = num;
          }
        });

        // Tạo mảng các váy mới với số tăng dần và status là một enum hợp lệ
        const newInstances = [];
        for (let i = 0; i < diff; i++) {
          newInstances.push({
            ten: `Váy số: ${maxNumber + i + 1}`,
            vay_id: vayId,
            status: "AVAILABLE" as const, // Chỉ định kiểu cụ thể để TypeScript hiểu đây là giá trị cố định
          });
        }

        // Thêm instances mới
        await tx.vayInstance.createMany({
          data: newInstances,
        });
      } else if (diff < 0) {
        // Lấy các instance có thể xóa (những instance không đang được thuê)
        // Sắp xếp theo ID giảm dần để xóa từ mới nhất (ID cao nhất) trước
        const deletableInstances = await tx.vayInstance.findMany({
          where: {
            vay_id: vayId,
            status: "AVAILABLE",
          },
          orderBy: {
            id: "desc", // Sắp xếp giảm dần theo ID
          },
          take: Math.abs(diff),
          select: { id: true },
        });

        if (deletableInstances.length < Math.abs(diff)) {
          throw new Error(
            "Không thể giảm số lượng vì một số váy đang được thuê"
          );
        }

        // Xóa instances
        await tx.vayInstance.deleteMany({
          where: {
            id: {
              in: deletableInstances.map((i) => i.id),
            },
          },
        });
      }

      // Lấy thông tin váy cưới đã cập nhật với instances mới
      return await tx.vayCuoi.findUnique({
        where: { id: vayId },
        include: {
          mau_release: true,
          size_relation: true,
          do_tuoi_relation: true,
          instances: true,
        },
      });
    });

    return NextResponse.json(
      {
        message: "updated successfully",
        data: datas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating:", error);
    return NextResponse.json({ message: "Failed to update" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vayId = parseInt(params.id);
    const datas = await prisma.$transaction(async (tx) => {
      const vay = await tx.vayCuoi.findUnique({
        where: { id: vayId },
        include: {
          mau_release: true,
          size_relation: true,
          do_tuoi_relation: true,
          instances: {
            orderBy: {
              id: "asc",
            },
          },
        },
      });

      if (!vay) {
        return null;
      }

      const instances = await tx.vayInstance.findMany({
        where: {
          vay_id: vayId,
        },
        orderBy: {
          id: "asc",
        },
      });

      return {
        ...vay,
        instances,
      };
    });

    if (!datas) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "success", vay: datas },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching by id", error);
    return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
  }
}
