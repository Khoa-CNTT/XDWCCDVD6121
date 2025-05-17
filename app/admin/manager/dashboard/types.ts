export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;

  totalDresses: number;
  availableDresses: number;
  rentedDresses: number;
  maintenanceDresses: number;

  totalVenues: number;
  totalMakeupServices: number;

  dressRevenue: number;
  venueRevenue: number;
  makeupRevenue: number;
}

export interface RecentOrder {
  id: number;
  ma_don_hang: string;
  order_status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  ten_khach_hang: string;
  so_dien_thoai: string;
  tong_tien: number;
  created_at: string;
}

export interface TopServiceStats {
  topDresses: Array<{
    id: number;
    ten: string;
    luot_thue: number;
    doanh_thu: number;
  }>;
  topVenues: Array<{
    id: number;
    ten: string;
    luot_thue: number;
    doanh_thu: number;
  }>;
  topMakeup: Array<{
    id: number;
    ten: string;
    luot_thue: number;
    doanh_thu: number;
  }>;
}
