"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { ShippingForm } from "./components/ShippingForm";
import { PaymentMethod } from "./components/PaymentMethod";
import { OrderSummary } from "./components/OrderSummary";
import { PaymentDialog } from "./components/PaymentDialog";
import { CartItem, ShippingInfo } from "./types";
import type { PayosPaymentData } from "./types.payos";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<string>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payosDialogOpen, setPayosDialogOpen] = useState(false);
  const [payosData, setPayosData] = useState<PayosPaymentData | null>(null);
  const router = useRouter();
  // Lưu ý: Việc kiểm tra và xóa váy hết hạn đã được xử lý bởi useCartExpirationChecker hook
  // trong app/(guest)/layout.tsx nên không cần thực hiện lại ở đây
  const getCurrentCartItems = (): CartItem[] => {
    const stored = localStorage.getItem("cartItems");
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing cart items:", error);
      return [];
    }
  };
  useEffect(() => {
    const loadCart = () => {
      try {
        // Đọc trực tiếp từ localStorage (đã được useCartExpirationChecker kiểm tra và cập nhật)
        setCartItems(getCurrentCartItems());
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        toast.error("Không thể tải giỏ hàng");
      }
    };

    loadCart();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!shippingInfo.firstName.trim()) {
      toast.error("Vui lòng nhập họ");
      return false;
    }
    if (!shippingInfo.lastName.trim()) {
      toast.error("Vui lòng nhập tên");
      return false;
    }
    if (!shippingInfo.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!shippingInfo.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!shippingInfo.address.trim()) {
      toast.error("Vui lòng nhập địa chỉ");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Force a check for expired reservations through the API before proceeding
      await fetch("/api/vayinstance/check-expired", {
        method: "GET",
        cache: "no-store",
      });

      // Get the latest cart items (which should be updated by the useCartExpirationChecker hook)
      const latestCartItems = getCurrentCartItems();

      // If items changed since we loaded the page, update state and notify
      if (latestCartItems.length !== cartItems.length) {
        setCartItems(latestCartItems);
        setIsSubmitting(false);
        toast.error(
          "Một số mặt hàng đã hết hạn đặt trước và đã được xóa. Vui lòng kiểm tra lại giỏ hàng."
        );
        return;
      }

      // If no items at all, stop
      if (latestCartItems.length === 0) {
        setIsSubmitting(false);
        toast.error("Giỏ hàng trống, không thể thanh toán.");
        return;
      }
      const total = latestCartItems.reduce((sum, item) => {
        switch (item.type) {
          case "VAYCUOI":
            return sum + item.vayInfo.gia;
          case "RAPCUOI":
            return sum + item.rapInfo.gia_thue;
          case "MAKEUP":
            return sum + item.makeupInfo.gia_makeup;
          default:
            return sum;
        }
      }, 0);

      if (isNaN(total) || total <= 0) {
        toast.error("Có lỗi khi tính tổng tiền. Vui lòng thử lại.");
        setIsSubmitting(false);
        return;
      }
      const orderData = {
        items: latestCartItems.map((item) => {
          if (item.type === "VAYCUOI") {
            return {
              ...item,
              id: item.vayId,
            };
          }
          return item;
        }),
        shippingInfo,
        paymentMethod,
        totalAmount: total,
      };

      if (paymentMethod === "PAYOS") {
        localStorage.setItem("shippingInfo", JSON.stringify(shippingInfo));

        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const responseData = await response.json();

        if (response.ok) {
          localStorage.setItem(
            "payosTransactionId",
            responseData.transactionId.toString()
          );
          setPayosData(responseData);
          setPayosDialogOpen(true);
        } else {
          throw new Error(responseData.error || "Lỗi khi xử lý thanh toán");
        }
      } else {
        const response = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        const responseData = await response.json();

        if (response.ok) {
          localStorage.setItem(
            "lastOrderDetails",
            JSON.stringify(responseData)
          );
          localStorage.removeItem("cartItems");
          toast.success(
            `Đơn hàng #${responseData.orderCode} đã được tạo thành công!`
          );
          router.push("/order-success");
        } else {
          throw new Error(responseData.error || "Lỗi khi xử lý đơn hàng");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xử lý đơn hàng"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayosPaid = () => {
    setPayosDialogOpen(false);
    toast.success("Thanh toán thành công!");
    router.push("/payment-success");
  };

  const handlePayosCancel = () => {
    setPayosDialogOpen(false);
    toast.info("Đã hủy thanh toán");
    router.push("/payment-cancelled");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h1>
          <Link href="/vaycuoi" className="text-blue-500 hover:text-blue-600">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ShippingForm
            shippingInfo={shippingInfo}
            onShippingInfoChange={handleInputChange}
          />
          <PaymentMethod
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
          />
        </div>

        <div className="space-y-6">
          <OrderSummary
            cartItems={cartItems}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <PaymentDialog
        open={payosDialogOpen}
        onOpenChange={setPayosDialogOpen}
        qrCode={payosData?.qrCode || ""}
        // checkoutUrl={payosData?.checkoutUrl || ""}
        paymentLinkId={payosData?.paymentLinkId || ""}
        orderCode={payosData?.orderCode || ""}
        originalAmount={payosData?.originalAmount || 0}
        processingFee={payosData?.processingFee || 0}
        totalAmount={payosData?.totalAmount || 0}
        onPaid={handlePayosPaid}
        onCancel={handlePayosCancel}
      />
    </div>
  );
}
