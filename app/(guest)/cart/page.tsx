"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CartItem } from "./types";
import { CartItemComponent } from "./components/CartItem";
import { CartSummary } from "./components/CartSummary";
import { EmptyCart } from "./components/EmptyCart";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Lưu ý: Việc kiểm tra và xóa váy hết hạn đã được xử lý bởi useCartExpirationChecker hook
  // trong app/(guest)/layout.tsx nên không cần thực hiện lại ở đây
  useEffect(() => {
    const loadCart = () => {
      setIsLoading(true);
      try {
        const stored = localStorage.getItem("cartItems");
        if (stored) {
          // Đọc trực tiếp từ localStorage (đã được useCartExpirationChecker kiểm tra và cập nhật)
          const items = JSON.parse(stored);
          setCartItems(items);
        }
      } catch (error) {
        console.error("Error parsing cart items:", error);
        toast.error("Có lỗi khi tải giỏ hàng");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const removeFromCart = async (id: number) => {
    const itemToRemove = cartItems.find((item) => item.id === id);

    if (
      itemToRemove &&
      itemToRemove.type === "VAYCUOI" &&
      itemToRemove.instanceId
    ) {
      try {
        const response = await fetch("/api/vayinstance/release", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instanceId: itemToRemove.instanceId }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(
            errorData.message || "Không thể giải phóng váy. Vui lòng thử lại."
          );
          // Optionally, decide if you still want to remove from cart if release fails
          // For now, we'll proceed to remove from local cart anyway
        } else {
          // toast.info("Đã giải phóng váy khỏi trạng thái giữ trước.");
        }
      } catch (error) {
        console.error("Lỗi khi giải phóng váy:", error);
        toast.error("Có lỗi xảy ra khi cố gắng giải phóng váy.");
        // Optionally, decide if you still want to remove from cart if release fails
      }
    }

    const newItems = cartItems.filter((item) => item.id !== id);
    setCartItems(newItems);
    localStorage.setItem("cartItems", JSON.stringify(newItems));
    toast.success("Đã xóa khỏi giỏ hàng");
  };

  const proceedToCheckout = () => {
    router.push("/checkout");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-8">Giỏ Hàng</h1>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-8">Giỏ Hàng</h1>

      <div className="grid grid-cols-1 gap-6">
        {cartItems.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      <CartSummary cartItems={cartItems} onCheckout={proceedToCheckout} />
    </div>
  );
}
