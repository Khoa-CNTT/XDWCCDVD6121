import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "../types";

interface RevenueBreakdownProps {
  stats: DashboardStats;
}

// Format currency (VND)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format percentage for stats
const calculatePercentage = (part: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export function RevenueBreakdown({ stats }: RevenueBreakdownProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Doanh thu theo loại dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="mr-4 font-medium">Váy cưới</div>
              <div className="flex-1">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.dressRevenue, stats.totalRevenue)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm">
                {formatCurrency(stats.dressRevenue)} (
                {calculatePercentage(stats.dressRevenue, stats.totalRevenue)}
                %)
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-4 font-medium">Rạp cưới</div>
              <div className="flex-1">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.venueRevenue, stats.totalRevenue)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm">
                {formatCurrency(stats.venueRevenue)} (
                {calculatePercentage(stats.venueRevenue, stats.totalRevenue)}
                %)
              </div>
            </div>

            <div className="flex items-center">
              <div className="mr-4 font-medium">Makeup</div>
              <div className="flex-1">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{
                      width: `${calculatePercentage(stats.makeupRevenue, stats.totalRevenue)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="ml-4 text-sm">
                {formatCurrency(stats.makeupRevenue)} (
                {calculatePercentage(stats.makeupRevenue, stats.totalRevenue)}
                %)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tình trạng váy cưới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[180px] w-[180px] relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Circle for available dresses - Green */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10b981"
                strokeWidth="12"
                strokeDasharray="251.2"
                strokeDashoffset={
                  stats.totalDresses === 0
                    ? 251.2
                    : 251.2 -
                      (251.2 * (stats.availableDresses || 0)) /
                        stats.totalDresses
                }
                transform="rotate(-90 50 50)"
              />
              {/* Circle for rented dresses - Blue */}
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="28"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeDasharray="175.84"
                strokeDashoffset={
                  stats.totalDresses === 0
                    ? 175.84
                    : 175.84 -
                      (175.84 * (stats.rentedDresses || 0)) / stats.totalDresses
                }
                transform="rotate(-90 50 50)"
              />
              {/* Circle for maintenance dresses - Red */}
              <circle
                cx="50"
                cy="50"
                r="16"
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="12"
              />
              <circle
                cx="50"
                cy="50"
                r="16"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeDasharray="100.48"
                strokeDashoffset={
                  stats.totalDresses === 0
                    ? 100.48
                    : 100.48 -
                      (100.48 * (stats.maintenanceDresses || 0)) /
                        stats.totalDresses
                }
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-medium">{stats.availableDresses}</div>
              <div className="text-[10px] text-muted-foreground">Có sẵn</div>
            </div>
            <div>
              <div className="font-medium">{stats.rentedDresses}</div>
              <div className="text-[10px] text-muted-foreground">Đang thuê</div>
            </div>
            <div>
              <div className="font-medium">{stats.maintenanceDresses}</div>
              <div className="text-[10px] text-muted-foreground">Bảo trì</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
