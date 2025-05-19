"use client";

import { TopServiceFilter, TopServiceStats } from "../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PopularServicesProps {
  topServices: TopServiceStats;
  onFilterChange?: (filter: TopServiceFilter) => void;
  filter: TopServiceFilter;
}

export function PopularServices({
  topServices,
  onFilterChange,
  filter,
}: PopularServicesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleTimePeriodChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        timePeriod: value as "month" | "quarter" | "year" | "all",
      });
    }
  };

  const handleLimitChange = (value: string) => {
    if (onFilterChange) {
      onFilterChange({
        ...filter,
        limit: parseInt(value, 10),
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Dịch vụ được thuê nhiều nhất</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="time-period">Khoảng thời gian:</Label>
            <Select
              value={filter.timePeriod}
              onValueChange={handleTimePeriodChange}
            >
              <SelectTrigger id="time-period" className="w-[180px]">
                <SelectValue placeholder="Chọn thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Tháng hiện tại</SelectItem>
                <SelectItem value="quarter">Quý hiện tại</SelectItem>
                <SelectItem value="year">Năm hiện tại</SelectItem>
                <SelectItem value="all">Tất cả thời gian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="limit">Số lượng hiển thị:</Label>
            <Select
              value={filter.limit.toString()}
              onValueChange={handleLimitChange}
            >
              <SelectTrigger id="limit" className="w-[100px]">
                <SelectValue placeholder="Số lượng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Váy cưới phổ biến */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Váy cưới được thuê nhiều</CardTitle>
            <CardDescription>
              Top {filter.limit} váy cưới được khách hàng yêu thích
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Lượt thuê</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topServices.topDresses.map((dress) => (
                  <TableRow key={dress.id}>
                    <TableCell>{dress.ten}</TableCell>
                    <TableCell>{dress.luot_thue}</TableCell>
                    <TableCell>{formatCurrency(dress.doanh_thu)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Rạp cưới phổ biến */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Rạp cưới được thuê nhiều</CardTitle>
            <CardDescription>
              Top {filter.limit} rạp cưới được khách hàng yêu thích
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Lượt thuê</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topServices.topVenues.map((venue) => (
                  <TableRow key={venue.id}>
                    <TableCell>{venue.ten}</TableCell>
                    <TableCell>{venue.luot_thue}</TableCell>
                    <TableCell>{formatCurrency(venue.doanh_thu)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dịch vụ makeup phổ biến */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">
              Dịch vụ makeup được đặt nhiều
            </CardTitle>
            <CardDescription>
              Top {filter.limit} dịch vụ makeup được khách hàng yêu thích
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Lượt đặt</TableHead>
                  <TableHead>Doanh thu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topServices.topMakeup.map((makeup) => (
                  <TableRow key={makeup.id}>
                    <TableCell>{makeup.ten}</TableCell>
                    <TableCell>{makeup.luot_thue}</TableCell>
                    <TableCell>{formatCurrency(makeup.doanh_thu)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
