"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    
    const [status, setStatus] = useState({
        message: "",
        isError: false,
        isSuccess: false,
        isLoading: true,
        isValidToken: false,
    });

    // Kiểm tra tính hợp lệ của token khi component được mount
    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus({
                    ...status,
                    message: "Token không hợp lệ hoặc đã hết hạn",
                    isError: true,
                    isLoading: false,
                });
                return;
            }

            try {
                const response = await fetch(`/api/password-reset/verify?token=${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus({
                        ...status,
                        isLoading: false,
                        isValidToken: true,
                    });
                } else {
                    setStatus({
                        ...status,
                        message: data.message || "Token không hợp lệ hoặc đã hết hạn",
                        isError: true,
                        isLoading: false,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi xác thực token:", error);
                setStatus({
                    ...status,
                    message: "Lỗi kết nối đến máy chủ",
                    isError: true,
                    isLoading: false,
                });
            }
        };

        verifyToken();
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate password
        if (formData.password.length < 6) {
            setStatus({
                ...status,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
                isError: true,
            });
            return;
        }

        // Validate password matching
        if (formData.password !== formData.confirmPassword) {
            setStatus({
                ...status,
                message: "Mật khẩu không khớp",
                isError: true,
            });
            return;
        }

        try {
            const response = await fetch("/api/password-reset/reset", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    ...status,
                    message: "Đặt lại mật khẩu thành công",
                    isError: false,
                    isSuccess: true,
                });
            } else {
                setStatus({
                    ...status,
                    message: data.message || "Không thể đặt lại mật khẩu",
                    isError: true,
                });
            }
        } catch (error) {
            console.error("Lỗi khi đặt lại mật khẩu:", error);
            setStatus({
                ...status,
                message: "Lỗi kết nối đến máy chủ",
                isError: true,
            });
        }
    };

    // Loading state
    if (status.isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center"
                style={{ backgroundImage: "url('https://thethaovanhoa.mediacdn.vn/372676912336973824/2024/12/29/dah7144-1735440052943290598464.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <Card className="w-full max-w-md shadow-xl">
                    <CardContent className="pt-6">
                        <div className="text-center p-4">
                            <div className="w-10 h-10 border-4 border-t-amber-600 border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
                            <p>Đang kiểm tra token...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Invalid token or success state
    if (status.isError || status.isSuccess) {
        return (
            <div className="flex min-h-screen items-center justify-center"
                style={{ backgroundImage: "url('https://thethaovanhoa.mediacdn.vn/372676912336973824/2024/12/29/dah7144-1735440052943290598464.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            {status.isSuccess ? "Đặt Lại Mật Khẩu Thành Công" : "Lỗi"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <p className={status.isSuccess ? "text-green-600" : "text-red-600"}>
                                {status.message}
                            </p>
                            <Button
                                onClick={() => router.push('/admin/login')}
                                className="bg-amber-600 hover:bg-amber-700 text-white"
                            >
                                Quay lại trang đăng nhập
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Valid token, show password reset form
    return (
        <div className="flex min-h-screen items-center justify-center"
            style={{ backgroundImage: "url('https://thethaovanhoa.mediacdn.vn/372676912336973824/2024/12/29/dah7144-1735440052943290598464.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Đặt Lại Mật Khẩu</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Mật Khẩu Mới</Label>
                            <Input
                                id="password-input"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                placeholder="Nhập mật khẩu mới"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác Nhận Mật Khẩu</Label>
                            <Input
                                id="confirm-password-input"
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                placeholder="Xác nhận mật khẩu mới"
                            />
                        </div>

                        {status.isError && <p className="text-red-500 text-sm">{status.message}</p>}

                        <Button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                        >
                            Đặt Lại Mật Khẩu
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
