import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Package,
  Calendar,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { DashboardStats } from "../types";
import { formatCurrency } from "../utils";

interface SummaryCardsProps {
  stats: DashboardStats;
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            <TrendingUp className="mr-1 h-4 w-4 inline" />
            <span className="text-green-500 font-medium">+2.1%</span> so với
            tháng trước
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="inline-block px-1 rounded-sm bg-yellow-100 text-yellow-800 mr-1">
              {stats.pendingOrders} đang chờ
            </span>
            <span className="inline-block px-1 rounded-sm bg-blue-100 text-blue-800 mr-1">
              {stats.processingOrders} đang xử lý
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Váy cưới</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDresses}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="inline-block px-1 rounded-sm bg-green-100 text-green-800 mr-1">
              {stats.availableDresses} có sẵn
            </span>
            <span className="inline-block px-1 rounded-sm bg-blue-100 text-blue-800 mr-1">
              {stats.rentedDresses} đang cho thuê
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lịch hẹn</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalVenues + stats.totalMakeupServices}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="inline-block px-1 rounded-sm bg-pink-100 text-pink-800 mr-1">
              {stats.totalVenues} đặt rạp
            </span>
            <span className="inline-block px-1 rounded-sm bg-purple-100 text-purple-800 mr-1">
              {stats.totalMakeupServices} makeup
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
