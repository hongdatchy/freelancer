"use client"

import useUserLoginStore from "@/state-manager/user-login-store";

export default function BtnTrial() {

    const { user, logout } = useUserLoginStore();


    const handleTrialClick = () => {
        const trialSection = document.getElementById('trial-section');
        if (trialSection) {
            trialSection.scrollIntoView({ behavior: 'smooth' });
        }
    };
    if (user) {
        return null; // Nếu đã đăng nhập, không hiển thị nút
    }
    return (
        <button
            className="px-6 h-10 bg-[#1e3a8a] text-white rounded-full hover:bg-blue-800 transition-all text-sm font-bold shadow-md hover:shadow-lg"
            onClick={handleTrialClick}
        >
            Học Thử Miễn Phí
        </button>
    );
}