import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  type: "VAYCUOI" | "RAPCUOI" | "MAKEUP";
  startDate?: string;
  endDate?: string;
  ngay_hen?: string;
}

interface OrderDetails {
  orderCode: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
}

export const sendOrderConfirmationEmail = async (
  email: string,
  orderDetails: OrderDetails
) => {
  const { orderCode, customerName, items, totalAmount } = orderDetails;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getDateDisplay = (item: OrderItem) => {
    switch (item.type) {
      case "MAKEUP":
        return item.ngay_hen ? formatDate(item.ngay_hen) : "N/A";
      case "VAYCUOI":
        return item.startDate && item.endDate
          ? `${formatDate(item.startDate)} - ${formatDate(item.endDate)}`
          : "N/A";
      case "RAPCUOI":
        return item.startDate ? formatDate(item.startDate) : "N/A";
      default:
        return "N/A";
    }
  };

  const getTimeHeader = (item: OrderItem) => {
    switch (item.type) {
      case "MAKEUP":
        return "Ngày hẹn";
      case "VAYCUOI":
        return "Thời gian thuê";
      case "RAPCUOI":
        return "Ngày tổ chức";
      default:
        return "Thời gian";
    }
  };

  // Group items by type
  const groupedItems = items.reduce(
    (groups, item) => {
      const key = item.type;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<string, OrderItem[]>
  );

  // Generate HTML for each type of item
  const itemsHtmlByType = Object.entries(groupedItems)
    .map(([type, typeItems]) => {
      const firstItem = typeItems[0];
      return `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #4b5563; margin-bottom: 10px;">${
          type === "VAYCUOI"
            ? "Váy cưới"
            : type === "RAPCUOI"
              ? "Rạp cưới"
              : "Make up"
        }</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 10px; text-align: left;">Sản phẩm</th>
              <th style="padding: 10px; text-align: left;">Số lượng</th>
              <th style="padding: 10px; text-align: left;">Giá</th>
              <th style="padding: 10px; text-align: left;">${getTimeHeader(firstItem)}</th>
            </tr>
          </thead>
          <tbody>
            ${typeItems
              .map(
                (item) => `
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${formatPrice(item.price)}</td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">${getDateDisplay(item)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
    })
    .join("");

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@wedding.com",
    to: email,
    subject: `Xác nhận đơn hàng #${orderCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d97706;">Xác Nhận Đơn Hàng</h2>
        <p>Chào ${customerName},</p>
        <p>Cảm ơn bạn đã đặt hàng tại Wedding. Đơn hàng của bạn đã được xác nhận với chi tiết như sau:</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; margin: 20px 0; border-radius: 5px;">
          <p style="margin: 5px 0;"><strong>Mã đơn hàng:</strong> #${orderCode}</p>
        </div>

        ${itemsHtmlByType}

        <div style="margin-top: 20px; text-align: right;">
          <p style="font-size: 18px;"><strong>Tổng cộng:</strong> ${formatPrice(totalAmount)}</p>
        </div>

        <p style="margin-top: 30px;">
          Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lại và thảo luận về các chi tiết.
        </p>

        <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại được cung cấp trên website.</p>

        <p>Trân trọng,<br>Đội ngũ Wedding</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
