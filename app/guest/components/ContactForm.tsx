"use client";

import { useState } from "react";
import { Input, Textarea, Button } from "@material-tailwind/react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("🎉 Gửi liên hệ thành công!");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } else {
      toast.error("❌ Gửi liên hệ thất bại. Vui lòng thử lại.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-20 max-w-2xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">
        Gửi tin nhắn cho chúng tôi
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Tên của bạn"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Input
          label="Số điện thoại"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          label="Chủ đề"
          name="subject"
          value={form.subject}
          onChange={handleChange}
        />
      </div>

      <div className="mb-6">
        <Textarea
          label="Nội dung"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className="text-center">
        <Button
          type="submit"
          className="bg-rose-500 hover:bg-rose-600"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Đang gửi...
            </div>
          ) : (
            "Gửi tin nhắn"
          )}
        </Button>
      </div>
    </form>
  );
}
