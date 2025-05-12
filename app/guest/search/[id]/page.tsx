// app/guest/search/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface DonHang {
  id: number;
  order_status: string;
  payment_method: string;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  email: string;
  transaction_id: number;
  created_at: string;
}

export default function OrderSearchPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const [order, setOrder] = useState<DonHang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/donhang/${orderId}`);
        if (!response.ok) {
          throw new Error("Không tìm thấy đơn hàng");
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Thông tin đơn hàng #{order.id}
        </h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Trạng thái:</h2>
            <p>{order.order_status}</p>
          </div>
          <div>
            <h2 className="font-semibold">Phương thức thanh toán:</h2>
            <p>{order.payment_method}</p>
          </div>
          <div>
            <h2 className="font-semibold">Khách hàng:</h2>
            <p>{order.ten_khach_hang}</p>
          </div>
          <div>
            <h2 className="font-semibold">Số điện thoại:</h2>
            <p>{order.so_dien_thoai}</p>
          </div>
          <div>
            <h2 className="font-semibold">Email:</h2>
            <p>{order.email}</p>
          </div>
          <div>
            <h2 className="font-semibold">Địa chỉ:</h2>
            <p>{order.dia_chi}</p>
          </div>
          <div>
            <h2 className="font-semibold">Transaction ID:</h2>
            <p>{order.transaction_id}</p>
          </div>
          <div>
            <h2 className="font-semibold">Ngày đặt hàng:</h2>
            <p>{new Date(order.created_at).toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
