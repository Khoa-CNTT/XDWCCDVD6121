export interface PayosPaymentData {
  transactionId: number;
  orderCode: string;
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
  originalAmount: number;
  processingFee: number;
  totalAmount: number;
}
