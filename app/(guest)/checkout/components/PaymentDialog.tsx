"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: string;
  //   checkoutUrl: string;
  paymentLinkId: string;
  orderCode: string;
  originalAmount: number;
  processingFee: number;
  totalAmount: number;
  onPaid: () => void;
  onCancel: () => void;
}

export const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  qrCode,
  //   checkoutUrl,
  paymentLinkId,
  orderCode,
  originalAmount,
  processingFee,
  totalAmount,
  onPaid,
  onCancel,
}) => {
  const [status, setStatus] = useState<string>("PENDING");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string>("");

  // Poll payment status every 10s
  useEffect(() => {
    if (!open) return;
    if (!paymentLinkId) return;
    setStatus("PENDING");
    setError("");
    const interval = setInterval(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/payos/check-status?paymentLinkId=${paymentLinkId}`
        );
        const data = await res.json();
        if (data.status === "PAID") {
          setStatus("PAID");
          // Transaction already updated by the check-status API
          // and email has been sent, just complete the UI flow
          onPaid();
        } else if (data.status === "CANCELLED" || data.status === "EXPIRED") {
          setStatus(data.status);
          setError(data.vietnameseStatus || "Thanh toán thất bại");
        }
      } catch {
        setError("Lỗi kiểm tra trạng thái thanh toán");
      } finally {
        setChecking(false);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [open, paymentLinkId, onPaid]);

  const handleCheckStatus = async () => {
    setChecking(true);
    setError("");
    try {
      const res = await fetch(
        `/api/payos/check-status?paymentLinkId=${paymentLinkId}`
      );
      const data = await res.json();
      if (data.status === "PAID") {
        setStatus("PAID");
        // Transaction already updated by the check-status API
        // and email has been sent, just complete the UI flow
        onPaid();
      } else if (data.status === "CANCELLED" || data.status === "EXPIRED") {
        setStatus(data.status);
        setError(data.vietnameseStatus || "Thanh toán thất bại");
      } else {
        setError(data.vietnameseStatus || "Chưa thanh toán");
      }
    } catch {
      setError("Lỗi kiểm tra trạng thái thanh toán");
    } finally {
      setChecking(false);
    }
  };

  const handleCancel = async () => {
    setChecking(true);
    setError("");
    try {
      const res = await fetch(
        `/api/payos/cancel?paymentLinkId=${paymentLinkId}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data.success) {
        setStatus("CANCELLED");
        onCancel();
      } else {
        setError(data.message || "Không thể hủy thanh toán");
      }
    } catch {
      setError("Lỗi khi hủy thanh toán");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Quét mã QR để thanh toán
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <QRCodeSVG value={qrCode} size={256} level="H" />
          </div>
          <div className="text-sm text-gray-500">
            <p>Mã đơn hàng: {orderCode}</p>
            <p>Tiền hàng: {originalAmount.toLocaleString()}đ</p>
            <p>Phí xử lý: {processingFee.toLocaleString()}đ</p>
            <p className="font-semibold">
              Tổng cộng: {totalAmount.toLocaleString()}đ
            </p>
          </div>
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={checking || status === "PAID"}
          >
            Hủy
          </Button>
          <Button
            onClick={handleCheckStatus}
            disabled={checking || status === "PAID"}
          >
            {checking ? "Đang kiểm tra..." : "Kiểm tra thanh toán"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
