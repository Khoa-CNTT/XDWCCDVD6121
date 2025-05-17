"use client";

interface PaymentMethodProps {
  paymentMethod: string;
  onPaymentMethodChange: (value: string) => void;
}

export function PaymentMethod({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Phương thức thanh toán
      </h2>
      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="form-radio text-pink-500 focus:ring-pink-500 dark:focus:ring-pink-400"
          />
          <span className="text-gray-900 dark:text-white">
            Thanh toán khi nhận hàng
          </span>
        </label>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="PAYOS"
            checked={paymentMethod === "PAYOS"}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            className="form-radio text-pink-500 focus:ring-pink-500 dark:focus:ring-pink-400"
          />
          <span className="text-gray-900 dark:text-white">
            Chuyển khoản ngân hàng
          </span>
        </label>
      </div>
    </div>
  );
}
