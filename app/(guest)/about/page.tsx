"use client";

import FlairButton from "../components/FlairButton";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">About HADY</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-700 mb-4">
            Hady Shop được thành lập vào năm 2015 bởi nhóm 5 sinh viên Đại học
            Duy Tân, những người nhận ra khoảng trống trên thị trường cho các
            phụ kiện cưới chất lượng cao nhưng giá cả phải chăng.
          </p>
          <p className="text-gray-700 mb-4">
            Sau nhiều năm giúp các cô dâu tìm kiếm những điểm nhấn hoàn hảo cho
            vẻ ngoài trong ngày cưới, chúng tôi quyết định tự tay tạo nên bộ sưu
            tập phụ kiện thủ công của riêng mình - những món đồ giúp mỗi cô dâu
            cảm thấy đặc biệt mà không lo vượt ngân sách.
          </p>
          <p className="text-gray-700">
            Từ một cửa hàng nhỏ hoạt động online, Hady Shop đã phát triển thành
            một thương hiệu được yêu mến, nổi bật với sự tỉ mỉ trong từng chi
            tiết, tay nghề tinh xảo và dịch vụ khách hàng xuất sắc.
          </p>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden">
          <img
            src="https://i.imgur.com/J9OAqsl.jpeg"
            alt="Tổ đội thành viên"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Các Giá Trị</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Về chất lượng",
              description:
                "Chúng tôi chỉ sử dụng những chất liệu cao cấp nhất và tay nghề thủ công tinh xảo trong tất cả các sản phẩm phụ kiện, đảm bảo rằng chúng đặc biệt không kém gì chính ngày cưới của bạn.",
            },
            {
              title: "Về giá cả",
              description:
                "Chúng tôi tin rằng mọi cô dâu đều xứng đáng được cảm thấy xinh đẹp, đó là lý do Hady Shop mang đến chất lượng vượt trội với mức giá dễ tiếp cận.",
            },
            {
              title: "Về môi trường",
              description:
                "Chúng tôi cam kết thực hiện quy trình sản xuất có đạo đức và giảm thiểu tác động đến môi trường thông qua việc lựa chọn nguồn nguyên liệu có trách nhiệm.",
            },
          ].map((value, index) => (
            <div key={index} className="bg-rose-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">
          Các Thành Viên Trong Nhóm
        </h2>

        <div className="mb-12">
          <div className="text-center max-w-md mx-auto">
            <div className="rounded-full overflow-hidden size-96 mx-auto mb-4">
              <img
                src="https://i.imgur.com/xLhAsL3.png"
                alt="Nguyễn Minh Quang"
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-2xl mb-2">Nguyễn Minh Quang</h3>
            <p className="text-gray-500 text-lg">Founder & Developer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="text-center">
            <div className="rounded-full overflow-hidden h-48 w-48 mx-auto mb-4">
              <img
                src="https://i.imgur.com/V2WqkVv.png"
                alt="Phan Công Châu"
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-lg">Phan Công Châu</h3>
            <p className="text-gray-500">Co-Founder & Developer</p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden h-48 w-48 mx-auto mb-4">
              <img
                src="https://i.imgur.com/C5WMV8S.png"
                alt="Michael Rodriguez"
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-lg">Nguyễn Văn Quang</h3>
            <p className="text-gray-500">Designer & Developer</p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden h-48 w-48 mx-auto mb-4">
              <img
                src="https://i.imgur.com/VGGYVuE.png"
                alt="Lê Thiên Phát"
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-lg">Lê Thiên Phát</h3>
            <p className="text-gray-500">Designer & Developer</p>
          </div>

          <div className="text-center">
            <div className="rounded-full overflow-hidden h-48 w-48 mx-auto mb-4">
              <img
                src="https://i.imgur.com/VixkBjQ.png"
                alt="Trần Tịnh Tài"
                className="object-cover w-full h-full"
              />
            </div>
            <h3 className="font-bold text-lg">Trần Tịnh Tài</h3>
            <p className="text-gray-500">Designer & Developer</p>
          </div>
        </div>
      </div>

      <div className="bg-rose-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Bạn sẵn sàng để tìm kiếm những phụ kiện cưới hoàn hảo cho mình?
        </h2>{" "}
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Khám phá bộ sưu tập phụ kiện cưới thủ công, trang sức và phụ kiện tóc
          được thiết kế để làm cho ngày cưới của bạn thêm đặc biệt.
        </p>
        <FlairButton text="Mua Ngay" className="bg-black" href="/vaycuoi" />
      </div>
    </div>
  );
}
