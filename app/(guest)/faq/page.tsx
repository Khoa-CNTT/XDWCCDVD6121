import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2 text-center">
        Câu Hỏi Thường Gặp
      </h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Tìm câu trả lời cho các câu hỏi thường gặp về sản phẩm, vận chuyển, đổi
        trả và hơn thế nữa.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Sản Phẩm & Đặt Hàng</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Dịch vụ của bạn có được làm thủ công không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vâng, tất cả dịch vụ cưới của chúng tôi đều được làm thủ
                    công bởi các nghệ nhân lành nghề. Mỗi sản phẩm đều được chế
                    tác với sự chú ý đến từng chi tiết để đảm bảo chất lượng cao
                    nhất cho ngày trọng đại của bạn. Ngoài ra, chúng tôi vẫn có
                    những mẫu sản phẩm có sẵn.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Làm thế nào để biết độ dài khăn voan phù hợp với tôi?
                  </AccordionTrigger>
                  <AccordionContent>
                    Độ dài khăn voan lý tưởng phụ thuộc vào kiểu váy và phong
                    cách bạn muốn đạt được. Khăn voan mang lại vẻ đẹp ấn tượng
                    và trang trọng, trong khi khăn voan ngón tay phù hợp với hầu
                    hết các kiểu váy. Chúng tôi khuyên bạn nênliên hệ với các
                    nhà tạo mẫu của chúng tôi để được tư vấn cá nhân.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Tôi có thể yêu cầu thiết kế tùy chỉnh không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Chúng tôi rất thích tạo ra những mẫu thiết kế tùy chỉnh. Vui
                    lòng truy cập trangliên hệ trực tiếp với chúng tôi với ý
                    tưởng của bạn, và chúng tôi sẽ làm việc cùng bạn để tạo ra
                    một sản phẩm đặc biệt.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Tôi nên đặt dịch vụ trước bao lâu?
                  </AccordionTrigger>
                  <AccordionContent>
                    Chúng tôi khuyên bạn nên đặt dịch vụ trước ngày cưới 15-30
                    ngày, tốt nhất là trong khoảng từ 3-6 tháng. Điều này cho
                    phép có thời gian để tùy chỉnh và đảm bảo sản phẩm của bạn
                    đến đúng hạn với nhiều thời gian cho bất kỳ điều chỉnh hoặc
                    quyết định tạo kiểu nào.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Vận Chuyển & Giao Hàng</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping-1">
                  <AccordionTrigger>
                    Thời gian vận chuyển mất bao lâu?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vận chuyển tiêu chuẩn trong nước thường mất 3-5 ngày làm
                    việc. Vận chuyển quốc tế có thể mất 15-30 ngày làm việc tùy
                    thuộc vào điểm đến. Các tùy chọn vận chuyển nhanh có sẵn khi
                    thanh toán. Đặc biệt, vận chuyển nội thành Đà Nẵng chỉ trong
                    vòng 2 giờ.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-2">
                  <AccordionTrigger>
                    Bạn có vận chuyển quốc tế không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vâng, chúng tôi vận chuyển đến hầu hết các quốc gia trên thế
                    giới. Phí vận chuyển quốc tế thay đổi theo địa điểm và sẽ
                    được tính khi thanh toán. Xin lưu ý rằng bất kỳ khoản thuế
                    nhập khẩu nào đều là trách nhiệm của khách hàng.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-3">
                  <AccordionTrigger>
                    Tôi có thể theo dõi đơn hàng của mình không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vâng, một khi đơn hàng của bạn được gửi đi, bạn sẽ nhận được
                    email xác nhận với thông tin theo dõi. Bạn cũng có thể theo
                    dõi đơn hàng trong bảng điều khiển tài khoản của mình nếu
                    bạn đã tạo tài khoản khi thanh toán.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-4">
                  <AccordionTrigger>
                    Vận chuyển có miễn phí không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Điều này sẽ tuỳ thuộc vào đích đến của sản phẩm. Chúng tôi
                    sẽ miễn phí vận chuyển trong nước. Các đơn hàng quốc tế sẽ
                    được tính phí vận chuyển khi thanh toán dựa trên điểm đến và
                    trọng lượng.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Đổi Trả & Hoàn Tiền</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="returns-1">
                  <AccordionTrigger>
                    Chính sách đổi trả của bạn là gì?
                  </AccordionTrigger>
                  <AccordionContent>
                    Chúng tôi chấp nhận đổi trả trong vòng 14 ngày kể từ ngày
                    giao hàng cho các sản phẩm chưa sử dụng trong bao bì gốc.
                    Các sản phẩm tùy chỉnh không thể đổi trả. để biết chi tiết
                    đầy đủ.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-2">
                  <AccordionTrigger>
                    Làm thế nào để bắt đầu quy trình đổi trả?
                  </AccordionTrigger>
                  <AccordionContent>
                    Để bắt đầu quy trình đổi trả, vui lòng liên hệ với đội ngũ
                    dịch vụ khách hàng của chúng tôi tại returns@elegantwed.com
                    với số đơn hàng và lý do đổi trả. Chúng tôi sẽ cung cấp cho
                    bạn giấy phép đổi trả và hướng dẫn.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-3">
                  <AccordionTrigger>
                    Tôi có thể đổi sản phẩm không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Vâng, chúng tôi sẵn lòng đổi sản phẩm sang kích thước hoặc
                    kiểu dáng khác trong vòng 14 ngày kể từ ngày giao hàng. Vui
                    lòng liên hệ với đội ngũ dịch vụ khách hàng của chúng tôi để
                    sắp xếp việc đổi hàng.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-4">
                  <AccordionTrigger>
                    Sản phẩm giảm giá có thể đổi trả không?
                  </AccordionTrigger>
                  <AccordionContent>
                    Sản phẩm bán cuối cùng không thể đổi trả. Tất cả các sản
                    phẩm giảm giá khác tuân theo chính sách đổi trả tiêu chuẩn
                    14 ngày. Trang sản phẩm sẽ chỉ rõ nếu một sản phẩm là bán
                    cuối cùng.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4">Vẫn Còn Câu Hỏi?</h2>
          <p className="text-gray-700 mb-6">
            Đội ngũ dịch vụ khách hàng của chúng tôi luôn sẵn sàng hỗ trợ! Liên
            hệ với chúng tôi và chúng tôi sẽ phản hồi sớm nhất có thể.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full bg-rose-400 hover:bg-rose-500">
              <Link href="/contact">Liên Hệ Chúng Tôi</Link>
            </Button>
            <div className="text-center text-gray-600">
              <p>Email: info@hadyshop.com</p>
              <p>Điện thoại: (+84) 783-324-234</p>
              <p>Giờ làm việc: Thứ 2 - Chủ Nhật, 9:30 AM - 6:00 PM EST+7:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
