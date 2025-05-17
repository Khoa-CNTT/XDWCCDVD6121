"use client";

import { TopServiceStats } from "../types";
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

interface PopularServicesProps {
  topServices: TopServiceStats;
}

export function PopularServices({ topServices }: PopularServicesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Váy cưới phổ biến */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Váy cưới được thuê nhiều</CardTitle>
          <CardDescription>
            Top 5 váy cưới được khách hàng yêu thích
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
            Top 5 rạp cưới được khách hàng yêu thích
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
            Top 5 dịch vụ makeup được khách hàng yêu thích
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
  );
}
