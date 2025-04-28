"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export default function OrderSearchPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Vui lòng nhập mã đơn hàng");
        setLoading(false);
        return;
      }

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

    fetchOrder();
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
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h1>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold">Mã đơn hàng:</h2>
            <p>{order.id}</p>
          </div>
          <div>
            <h2 className="font-semibold">Trạng thái:</h2>
            <p>{order.status}</p>
          </div>
          <div>
            <h2 className="font-semibold">Ngày đặt hàng:</h2>
            <p>{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="font-semibold">Sản phẩm:</h2>
            <ul className="list-disc pl-5">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} - {item.quantity} x {item.price.toLocaleString()}đ
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold">Tổng tiền:</h2>
            <p>{order.total.toLocaleString()}đ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
