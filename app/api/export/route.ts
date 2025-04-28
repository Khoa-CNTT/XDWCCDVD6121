import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableName = searchParams.get("table");

    if (!tableName) {
      return NextResponse.json(
        { error: "Table name is required" },
        { status: 400 }
      );
    }

    // Lấy dữ liệu từ database dựa trên tên bảng
    let data;
    switch (tableName) {
      case "vaycuoi":
        data = await prisma.vayCuoi.findMany({
          include: {
            mau_release: {
              select: {
                ten_mau: true,
              },
            },
            kich_thuoc_relation: {
              select: {
                kich_thuoc: true,
              },
            },
            do_tuoi_relation: {
              select: {
                dotuoi: true,
              },
            },
          },
        });
        // Chuyển đổi dữ liệu để chỉ lấy các trường cần thiết
        data = data.map((item) => ({
          ten: item.ten,
          gia: item.gia,
          anh: item.anh,
          mau: item.mau_release.ten_mau,
          kich_thuoc: item.kich_thuoc_relation.kich_thuoc,
          do_tuoi: item.do_tuoi_relation.dotuoi,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        break;
      case "rapcuoi":
        data = await prisma.rapCuoi.findMany({
          include: {
            mau_release: {
              select: {
                ten_mau: true,
              },
            },
            so_luong_ghe: {
              select: {
                so_luong_ghe: true,
              },
            },
            so_luong_day_ghe: {
              select: {
                so_luong_day_ghe: true,
              },
            },
          },
        });
        // Chuyển đổi dữ liệu để chỉ lấy các trường cần thiết
        data = data.map((item) => ({
          ten_rap: item.ten_rap,
          gia_thue: item.gia_thue,
          anh_rap: item.anh_rap,
          mau: item.mau_release.ten_mau,
          so_ghe: item.so_luong_ghe.so_luong_ghe,
          so_day_ghe: item.so_luong_day_ghe.so_luong_day_ghe,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        break;
      case "makeup":
        data = await prisma.makeUp.findMany({
          include: {
            phong_cach_relation: {
              select: {
                ten_phong_cach: true,
              },
            },
          },
        });
        // Chuyển đổi dữ liệu để chỉ lấy các trường cần thiết
        data = data.map((item) => ({
          ten_makeup: item.ten_makeup,
          gia_makeup: item.gia_makeup,
          anh_makeup: item.anh_makeup,
          chi_tiet: item.chi_tiet,
          phong_cach: item.phong_cach_relation.ten_phong_cach,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
        break;
      default:
        return NextResponse.json(
          { error: "Invalid table name" },
          { status: 400 }
        );
    }

    // Chuyển đổi dữ liệu sang định dạng Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Tạo buffer từ workbook
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Tạo response với file Excel
    const response = new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${tableName}_export.xlsx"`,
      },
    });

    return response;
  } catch (error) {
    console.error("Error exporting data:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
