"use client";

import { useEffect } from "react";
import { CartItem } from "@/app/(guest)/cart/types";
import { toast } from "sonner";

export function useCartExpirationChecker() {
  useEffect(() => {
    const checkCartItemExpiration = async () => {
      try {
        const stored = localStorage.getItem("cartItems");
        if (!stored) return;

        let cartItems: CartItem[];
        try {
          cartItems = JSON.parse(stored);
          if (!cartItems.length) return;
        } catch (e) {
          console.error("Error parsing cart items:", e);
          return;
        }

        // Only check if there are váy items in the cart
        const hasVayItems = cartItems.some(
          (item) => item.type === "VAYCUOI" && "instanceId" in item
        );
        if (!hasVayItems) return;

        // Call the API to check and release expired items
        await fetch("/api/vayinstance/check-expired", {
          method: "GET",
          cache: "no-store", // Prevent caching to always get fresh results
        });

        // Now check each item in localStorage to see if it's still valid
        const updatedItems: CartItem[] = [];
        let expiredCount = 0;

        // Loop through each item to check if váy instances are still valid
        for (const item of cartItems) {
          if (
            item.type === "VAYCUOI" &&
            "instanceId" in item &&
            item.instanceId
          ) {
            try {
              // Check this specific instance
              const response = await fetch(
                `/api/vayinstance/${item.instanceId}`
              );
              if (response.ok) {
                const instance = await response.json();
                if (instance.status === "RESERVED") {
                  // Still valid, keep it
                  updatedItems.push(item);
                } else {
                  // No longer reserved, skip it
                  expiredCount++;
                }
              } else {
                // If API error, keep the item to be safe
                updatedItems.push(item);
              }
            } catch (error) {
              // On error, keep the item to be safe
              console.error("Error checking instance status:", error);
              updatedItems.push(item);
            }
          } else {
            // For non-váy items, keep them as is
            updatedItems.push(item);
          }
        }

        // If any items were removed, update localStorage
        if (expiredCount > 0) {
          localStorage.setItem("cartItems", JSON.stringify(updatedItems));
          toast.info(
            `${expiredCount} váy trong giỏ hàng đã hết hạn giữ chỗ và đã được xóa.`
          );
        }
      } catch (error) {
        console.error("Error checking expired cart items:", error);
      }
    };

    // Check when the component mounts
    checkCartItemExpiration();

    // Check more frequently (every 30 seconds) for better local testing
    const interval = setInterval(checkCartItemExpiration, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
