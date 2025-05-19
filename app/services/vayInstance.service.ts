import { VayStatus, VayInstance } from "@prisma/client";
import prisma from "@/prisma/pclient";

export class VayInstanceService {
  static async getInstance(instanceId: number) {
    return await prisma.vayInstance.findUnique({
      where: { id: instanceId },
    });
  }

  static async getInstances(vayId: number) {
    return await prisma.vayInstance.findMany({
      where: {
        vay_id: vayId,
      },
    });
  }

  static async getAvailableInstance(
    vayId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VayInstance | null> {
    // Find an instance that is available and doesn't have overlapping rental dates
    const instance = await prisma.vayInstance.findFirst({
      where: {
        vay_id: vayId,
        status: "AVAILABLE", // Only look for truly available instances
        OR: [
          {
            rental_start: null,
            rental_end: null,
          },
          {
            AND: [
              {
                OR: [
                  { rental_end: { lt: startDate } },
                  { rental_start: { gt: endDate } },
                ],
              },
            ],
          },
        ],
      },
    });
    return instance;
  }

  static async reserveInstance(
    vayId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VayInstance | null> {
    const instance = await this.getAvailableInstance(vayId, startDate, endDate);
    if (instance) {
      return await prisma.vayInstance.update({
        where: { id: instance.id },
        data: {
          status: "RESERVED",
          reserved_at: new Date(),
          // Tentatively set rental dates, can be confirmed at checkout
          // rental_start: startDate,
          // rental_end: endDate,
        },
      });
    }
    return null;
  }

  static async releaseReservedInstance(
    instanceId: number
  ): Promise<VayInstance | null> {
    const instance = await prisma.vayInstance.findUnique({
      where: { id: instanceId },
    });

    if (instance && instance.status === "RESERVED") {
      return await prisma.vayInstance.update({
        where: { id: instanceId },
        data: {
          status: "AVAILABLE",
          reserved_at: null,
          rental_start: null, // Clear tentative rental dates
          rental_end: null,
        },
      });
    }
    return instance; // Return instance even if not updated, or null if not found
  }

  static async confirmReservationAndRent(
    instanceId: number,
    startDate: Date,
    endDate: Date
  ): Promise<VayInstance | null> {
    const instance = await prisma.vayInstance.findUnique({
      where: { id: instanceId },
    });

    if (!instance) {
      throw new Error("Không tìm thấy instance váy.");
    }

    if (instance.status !== "RESERVED") {
      // If already RENTED by this flow (e.g. duplicate call), or AVAILABLE (released), or MAINTENANCE
      // This check prevents re-renting or renting a non-reserved item through this flow.
      throw new Error(
        "Váy này không ở trạng thái đã đặt trước hoặc đã được xử lý."
      );
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (!instance.reserved_at || instance.reserved_at < fifteenMinutesAgo) {
      // Reservation expired, release it
      await this.releaseReservedInstance(instanceId);
      throw new Error(
        "Thời gian đặt trước cho váy này đã hết hạn. Vui lòng thêm lại vào giỏ hàng."
      );
    }

    return await prisma.vayInstance.update({
      where: { id: instanceId },
      data: {
        status: "RENTED",
        rental_start: startDate,
        rental_end: endDate,
        reserved_at: null, // Clear reservation time
      },
    });
  }

  static async checkAndReleaseExpiredReservations(): Promise<number> {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const expiredInstances = await prisma.vayInstance.findMany({
      where: {
        status: "RESERVED",
        reserved_at: {
          lt: fifteenMinutesAgo,
        },
      },
    });

    if (expiredInstances.length === 0) {
      return 0;
    }

    const idsToRelease = expiredInstances.map((instance) => instance.id);

    await prisma.vayInstance.updateMany({
      where: {
        id: {
          in: idsToRelease,
        },
      },
      data: {
        status: "AVAILABLE",
        reserved_at: null,
        rental_start: null,
        rental_end: null,
      },
    });
    // console.log(`Released ${expiredInstances.length} expired reservations.`);
    return expiredInstances.length;
  }

  static async updateStatus(
    instanceId: number,
    newStatus: VayStatus,
    startDate?: Date,
    endDate?: Date
  ) {
    return await prisma.vayInstance.update({
      where: {
        id: instanceId,
      },
      data: {
        status: newStatus,
        rental_start: startDate,
        rental_end: endDate,
      },
    });
  }

  static async updateRentalDates(
    instanceId: number,
    startDate: Date,
    endDate: Date
  ) {
    return await prisma.vayInstance.update({
      where: {
        id: instanceId,
      },
      data: {
        rental_start: startDate,
        rental_end: endDate,
        status: "RENTED",
      },
    });
  }

  static async countByStatus(vayId: number) {
    const instances = await prisma.vayInstance.groupBy({
      by: ["status"],
      where: {
        vay_id: vayId,
      },
      _count: {
        status: true,
      },
    });
    return instances;
  }

  static async deleteInstance(instanceId: number) {
    try {
      // First check if instance is not rented
      const instance = await prisma.vayInstance.findUnique({
        where: { id: instanceId },
      });

      if (!instance) {
        throw new Error("Không tìm thấy instance");
      }

      if (instance.status === "RENTED") {
        throw new Error("Không thể xóa váy đang cho thuê");
      }

      // If not rented, proceed with deletion
      const deleted = await prisma.vayInstance.delete({
        where: { id: instanceId },
      });

      return deleted;
    } catch (error) {
      console.error("Error deleting instance:", error);
      throw error;
    }
  }
}
