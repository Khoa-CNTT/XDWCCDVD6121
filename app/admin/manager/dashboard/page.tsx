"use client";

import { useEffect, useState } from "react";
import { DashboardStats, TopServiceStats } from "./types";
import { SummaryCards } from "./components/SummaryCards";
import { RevenueBreakdown } from "./components/RevenueBreakdown";
import { PopularServices } from "./components/PopularServices";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalDresses: 0,
    totalVenues: 0,
    totalMakeupServices: 0,
    availableDresses: 0,
    rentedDresses: 0,
    maintenanceDresses: 0,
    dressRevenue: 0,
    venueRevenue: 0,
    makeupRevenue: 0,
  });

  const [topServices, setTopServices] = useState<TopServiceStats>({
    topDresses: [],
    topVenues: [],
    topMakeup: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setStats(data.stats);
        setTopServices(data.topServices);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Bảng điều khiển</h1>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards stats={stats} />

      {/* Revenue Breakdown */}
      <RevenueBreakdown stats={stats} />

      {/* Popular Services */}
      <PopularServices topServices={topServices} />
    </div>
  );
};

export default Dashboard;
