'use client';

import { useState } from 'react';
import { postData } from '@/service/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CtvRegisterSection() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [success, setSuccess] = useState(false);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e: any) => {
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
        } catch (err) {
            console.error(err);
            setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại!' });
        }
    };

    return (
        <section className="px-6 py-16 bg-white">
            <div className="max-w-4xl mx-auto">

                {/* TITLE */}
                <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-[#1d3557] mb-8 uppercase">
                    ĐĂNG KÝ CTV ĐỂ BẮT ĐẦU CƠ HỘI THU NHẬP ĐẾN 30 TRIỆU/THÁNG
                </h2>

                {success && (
                    <div className="mb-6 px-4 py-3 bg-green-50 border border-green-300 text-green-700 rounded-lg text-center text-sm font-medium">
                        🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.
                    </div>
                )}

                {errors.submit && (
                    <div className="mb-6 px-4 py-3 bg-red-50 border border-red-300 text-red-600 rounded-lg text-center text-sm font-medium">
                        {errors.submit}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* FULL NAME */}
                    <div>
                        <Input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Họ và tên"
                            className={`bg-white ${errors.fullName ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* PHONE */}
                    <div>
                        <Input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Số điện thoại / Zalo"
                            className={`bg-white ${errors.phone ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* EMAIL */}
                    <div>
                        <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`bg-white ${errors.email ? 'border-red-400 focus-visible:ring-red-400' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    {/* CTA */}
                    <Button
                        type="submit"
                        className="block mx-auto px-12 py-3 mt-2 bg-[#f5568f] text-white font-bold rounded-lg hover:bg-[#e6466e] transition-all tracking-widest"
                    >
                        ĐĂNG KÝ NGAY
                    </Button>

                </form>
            </div>
        </section>
    );
}