"use client";

import type React from "react";

import { Mail, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import FlairButton from "../components/FlairButton";
import ContactForm from "../components/ContactForm";
export default function ContactPage() {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Liên hệ với chúng tôi
      </h1>
      <div>
        {/* Contact Information */}
        <div>
          <p className="text-gray-700 mb-8">
            Nếu bạn có câu hỏi về sản phẩm của chúng tôi hoặc cần trợ giúp với
            đơn hàng? Chúng tôi sẵn sàng giúp bạn! Hãy liên hệ trực tiếp với
            chúng tôi bằng thông tin liên hệ dưới đây.
          </p>

          <div className="space-y-6">
            <div className="flex items-start">
              <MapPin className="h-6 w-6 text-rose-400 mr-4 mt-1" />
              <div>
                <h3 className="font-medium">Địa chỉ cửa hàng</h3>
                <p className="text-gray-600">
                  181 Lê Đại Hành, phường Hoà Thọ Đông, quận Cẩm Lệ, thành phố
                  Đà Nẵng.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-6 w-6 text-rose-400 mr-4 mt-1" />{" "}
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">
                  {process.env.NEXT_PUBLIC_EMAIL_USER}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-6 w-6 text-rose-400 mr-4 mt-1" />
              <div>
                <h3 className="font-medium">Gọi cho chúng tôi</h3>
                <p className="text-gray-600">{process.env.NEXT_PUBLIC_PHONE}</p>
                <p className="text-gray-600">
                  Thứ Hai - Chủ Nhật: 9:30 AM - 6:00 PM EST+7:00
                </p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-8 h-64 rounded-lg">
            <div className="w-full h-full flex items-center justify-center">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.829481337413!2d108.2016943!3d16.0223897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421987dbbe2b9f%3A0xf88a3862dd3fc4d4!2zMTgxIEzDqiDEkOG6oWkgSMOgbmgsIEjDsmEgVGjhu40gxJDDtG5nLCBD4bqpbSBM4buHLCDEkMOgIE7hurVuZyA1NTAwMDA!5e0!3m2!1svi!2s!4v1744039351532!5m2!1svi!2s"
                width="1300"
                height="250"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20" id="faq">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Câu Hỏi Thường Gặp (FAQ)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              question: "Thời gian giao hàng tốn bao lâu?",
              answer:
                "Vận chuyển tiêu chuẩn thường mất từ 3-5 ngày làm việc trong phạm vi toàn quốc. Vận chuyển quốc tế có thể mất từ 15-30 ngày làm việc tùy thuộc vào điểm đến. Đặc biệt, vận chuyển trong nội thành Đà Nẵng chỉ mất 1-2 giờ.",
            },
            {
              question: "Bạn có thể tạo ra bất kỳ thiết kế nào đúng chứ?",
              answer:
                "Đúng! Chúng tôi rất thích tạo ra các mặt hàng tùy chỉnh theo nhu cầu riêng của khách hàng. Vui lòng liên hệ trực tiếp với chúng tôi với ý tưởng của bạn và chúng tôi sẽ làm việc với bạn để tạo ra điều gì đó đặc biệt.",
            },
            {
              question: "Chính sách trả hàng như thế nào?",
              answer:
                "Chúng tôi chấp nhận trả hàng trong vòng 14 ngày sau khi giao hàng cho các mặt hàng chưa được sử dụng và sản phẩm có lỗi từ nhà sản xuất. Các mặt hàng tùy chỉnh không được trả hàng.",
            },
            {
              question: "Bạn có giao hàng quốc tế không?",
              answer:
                "Có, chúng tôi giao hàng đến hầu hết các quốc gia trên thế giới. Tỷ lệ vận chuyển quốc tế khác nhau tùy thuộc vào điểm đến.",
            },
          ].map((faq, index) => (
            <div key={index} className="border border-gray-400 rounded-lg p-6">
              <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center mt-10">
        <FlairButton
          accentColor="#000"
          primaryColor="#fff"
          text="Cần thêm câu hỏi?"
          onClick={() => {
            router.push("/faq");
          }}
        />
      </div>
      <ContactForm />
    </div>
  );
}
