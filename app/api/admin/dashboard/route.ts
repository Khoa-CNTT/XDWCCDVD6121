import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/pclient";
import { OrderStatus, PaymentStatus, VayStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    // 1. Tính toán số lượng đơn hàng và doanh thu
    const [
      donHangStats,
      dressStats,
      venueBookings,
      makeupBookings,
      revenueByType,
      topDresses,
      topVenues,
      topMakeup,
    ] = await Promise.all([
      // 1. Thống kê đơn hàng
      prisma.donHang.groupBy({
        by: ["order_status"],
        _count: {
          id: true,
        },
      }),

      // 2. Thống kê váy cưới
      prisma.vayInstance.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),

      // 3. Số lượng đặt rạp (tính từ orderItems có rap_id)
      prisma.orderItem.count({
        where: {
          rap_id: {
            not: null,
          },
        },
      }),

      // 4. Số lượng đặt makeup (tính từ orderItems có makeup_id)
      prisma.orderItem.count({
        where: {
          makeup_id: {
            not: null,
          },
        },
      }),

      // 5. Doanh thu theo loại dịch vụ
      getRevenueByType(),

      // 6. Top váy cưới được thuê nhiều nhất
      prisma.orderItem
        .groupBy({
          by: ["vay_id", "vay_ten"],
          where: {
            vay_id: {
              not: null,
            },
            donhang: {
              order_status: {
                not: OrderStatus.CANCELLED,
              },
            },
          },
          _count: {
            vay_id: true,
          },
          _sum: {
            vay_gia: true,
          },
        })
        .then((results) =>
          results
            .map((item) => ({
              id: item.vay_id!,
              ten: item.vay_ten!,
              luot_thue: item._count.vay_id,
              doanh_thu: item._sum.vay_gia || 0,
            }))
            .sort((a, b) => b.luot_thue - a.luot_thue)
            .slice(0, 5)
        ),

      // 7. Top rạp cưới được thuê nhiều nhất
      prisma.orderItem
        .groupBy({
          by: ["rap_id", "rap_ten"],
          where: {
            rap_id: {
              not: null,
            },
            donhang: {
              order_status: {
                not: OrderStatus.CANCELLED,
              },
            },
          },
          _count: {
            rap_id: true,
          },
          _sum: {
            rap_gia: true,
          },
        })
        .then((results) =>
          results
            .map((item) => ({
              id: item.rap_id!,
              ten: item.rap_ten!,
              luot_thue: item._count.rap_id,
              doanh_thu: item._sum.rap_gia || 0,
            }))
            .sort((a, b) => b.luot_thue - a.luot_thue)
            .slice(0, 5)
        ),

      // 8. Top dịch vụ makeup được đặt nhiều nhất
      prisma.orderItem
        .groupBy({
          by: ["makeup_id", "makeup_ten"],
          where: {
            makeup_id: {
              not: null,
            },
            donhang: {
              order_status: {
                not: OrderStatus.CANCELLED,
              },
            },
          },
          _count: {
            makeup_id: true,
          },
          _sum: {
            makeup_gia: true,
          },
        })
        .then((results) =>
          results
            .map((item) => ({
              id: item.makeup_id!,
              ten: item.makeup_ten!,
              luot_thue: item._count.makeup_id,
              doanh_thu: item._sum.makeup_gia || 0,
            }))
            .sort((a, b) => b.luot_thue - a.luot_thue)
            .slice(0, 5)
        ),
    ]);

    // Tính tổng số đơn hàng và phân loại theo trạng thái
    const orderStatusMap = donHangStats.reduce(
      (acc, item) => {
        acc[item.order_status] = item._count.id;
        return acc;
      },
      {
        PENDING: 0,
        PROCESSING: 0,
        COMPLETED: 0,
        CANCELLED: 0,
      } as Record<OrderStatus, number>
    );

    const totalOrders = Object.values(orderStatusMap).reduce(
      (sum, count) => sum + count,
      0
    );

    // Tính tổng số váy và phân loại theo trạng thái
    const dressStatusMap = dressStats.reduce(
      (acc, item) => {
        acc[item.status] = item._count.id;
        return acc;
      },
      {
        AVAILABLE: 0,
        RENTED: 0,
        MAINTENANCE: 0,
      } as Record<VayStatus, number>
    );

    const totalDresses = Object.values(dressStatusMap).reduce(
      (sum, count) => sum + count,
      0
    );

    // Chuẩn bị data để gửi về client
    const dashboardData = {
      stats: {
        totalOrders,
        totalRevenue: revenueByType.totalRevenue,
        pendingOrders: orderStatusMap.PENDING || 0,
        processingOrders: orderStatusMap.PROCESSING || 0,
        completedOrders: orderStatusMap.COMPLETED || 0,
        cancelledOrders: orderStatusMap.CANCELLED || 0,

        totalDresses,
        availableDresses: dressStatusMap.AVAILABLE || 0,
        rentedDresses: dressStatusMap.RENTED || 0,
        maintenanceDresses: dressStatusMap.MAINTENANCE || 0,

        totalVenues: venueBookings,
        totalMakeupServices: makeupBookings,

        // Doanh thu phân loại
        dressRevenue: revenueByType.dressRevenue,
        venueRevenue: revenueByType.venueRevenue,
        makeupRevenue: revenueByType.makeupRevenue,
      },
      topServices: {
        topDresses,
        topVenues,
        topMakeup,
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

// Hàm tính doanh thu theo loại dịch vụ
async function getRevenueByType() {
  // Lấy doanh thu từ OrderItems
  const orderItems = await prisma.orderItem.findMany({
    where: {
      donhang: {
        order_status: {
          not: OrderStatus.CANCELLED,
        },
        transaction_id_relation: {
          payment_status: PaymentStatus.PAID,
        },
      },
    },
    select: {
      vay_id: true,
      vay_gia: true,
      rap_id: true,
      rap_gia: true,
      makeup_id: true,
      makeup_gia: true,
    },
  });

  let dressRevenue = 0;
  let venueRevenue = 0;
  let makeupRevenue = 0;

  for (const item of orderItems) {
    if (item.vay_id && item.vay_gia) {
      dressRevenue += item.vay_gia;
    }
    if (item.rap_id && item.rap_gia) {
      venueRevenue += item.rap_gia;
    }
    if (item.makeup_id && item.makeup_gia) {
      makeupRevenue += item.makeup_gia;
    }
  }

  const totalRevenue = dressRevenue + venueRevenue + makeupRevenue;

  return {
    dressRevenue,
    venueRevenue,
    makeupRevenue,
    totalRevenue,
  };
}
