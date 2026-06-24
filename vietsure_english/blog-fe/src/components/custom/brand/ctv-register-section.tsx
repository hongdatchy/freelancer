'use client';

import { useState } from 'react';
import { postData } from '@/service/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function CtvRegisterSection() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ và tên';
        if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);

        try {
            await postData('api/ctv-registrations', {
                data: formData,
            });

            setSuccess(true);
            setFormData({
                fullName: '',
                phone: '',
                email: '',
            });
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error(err);
            setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại!' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="ctv-register-section" className="px-4 py-16 bg-white">
            <div className="w-full flex flex-col items-center mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
                {/* Tiêu đề phía trên Form */}
                <div className="text-center mb-8">
                    <p className="section-subtitle mb-2">
                        Form đăng ký
                    </p>
                    <h2 className="section-title text-[#1b2b85]">
                        ĐĂNG KÝ TRỞ THÀNH CỘNG TÁC VIÊN<br />CÙNG VIETSURE ENGLISH
                    </h2>
                </div>

                {/* Card chứa Form */}
                <div className="w-full bg-[#badeff] brand-light-border rounded-[36px] md:rounded-[48px] shadow-2xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Phần bên trái: Mascot & Khuyến mãi */}
                    <div className="lg:col-span-5 pt-8 px-6 md:pt-10 md:px-8 pb-0 flex flex-col justify-between items-center relative overflow-hidden min-h-[380px] lg:min-h-full">
                        <h3 className="text-[#1b2b85] font-black text-xl md:text-2xl lg:text-[24px] uppercase leading-snug tracking-wide text-center lg:text-left w-full max-w-none lg:max-w-[320px]">
                            BẮT ĐẦU CƠ HỘI THU NHẬP LÊN ĐẾN 30 TRIỆU/THÁNG
                        </h3>
                        
                        <div className="relative w-full flex justify-center items-end mt-4">
                            <Image 
                                src="/images/phan-khich-nang-dong.png" 
                                alt="Mascot Vietsure English Waving" 
                                width={310} 
                                height={310} 
                                className="object-contain translate-y-1 md:translate-y-2 select-none"
                            />
                        </div>
                    </div>

                    {/* Phần bên phải: Các trường Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col justify-center gap-5 p-2 md:p-6">
                        {success && (
                            <div className="px-4 py-3 bg-green-50 border border-green-300 text-green-700 rounded-2xl text-center text-sm font-medium">
                                🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất nhé.
                            </div>
                        )}

                        {errors.submit && (
                            <div className="px-4 py-3 bg-red-50 border border-red-300 text-red-600 rounded-2xl text-center text-sm font-medium">
                                {errors.submit}
                            </div>
                        )}

                        {/* Hàng 1: Họ và tên & Số điện thoại */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Họ và tên"
                                    disabled={isLoading}
                                    className={`h-16 px-6 rounded-[24px] bg-white border-none text-gray-800 text-base shadow-[0_4px_10px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#3f4ebd] ${
                                        errors.fullName ? 'ring-2 ring-red-400' : ''
                                    }`}
                                />
                                {errors.fullName && <p className="text-red-500 text-xs pl-4 mt-1">{errors.fullName}</p>}
                            </div>
                            <div>
                                <Input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Số điện thoại / Zalo"
                                    disabled={isLoading}
                                    className={`h-16 px-6 rounded-[24px] bg-white border-none text-gray-800 text-base shadow-[0_4px_10px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#3f4ebd] ${
                                        errors.phone ? 'ring-2 ring-red-400' : ''
                                    }`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs pl-4 mt-1">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Hàng 2: Email */}
                        <div>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email liên hệ"
                                disabled={isLoading}
                                className={`h-16 px-6 rounded-[24px] bg-white border-none text-gray-800 text-base shadow-[0_4px_10px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-[#3f4ebd] ${
                                    errors.email ? 'ring-2 ring-red-400' : ''
                                }`}
                            />
                            {errors.email && <p className="text-red-500 text-xs pl-4 mt-1">{errors.email}</p>}
                        </div>

                        {/* Hàng nút bấm */}
                        <div className="flex justify-center mt-2">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-14 px-12 rounded-[24px] bg-[#3f4ebd] hover:bg-[#2c3993] text-white font-extrabold text-lg shadow-lg shadow-[#3f4ebd]/30 transition-all tracking-wide uppercase"
                            >
                                {isLoading ? 'Đang gửi...' : 'Đăng Ký Ngay'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}