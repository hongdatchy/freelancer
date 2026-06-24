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
            className="px-9 h-12 bg-[#1e3a8a] text-white rounded-full hover:bg-blue-800 transition-all text-lg font-bold shadow-md hover:shadow-lg flex items-center justify-center"
            onClick={handleTrialClick}
        >
            Học thử miễn phí
        </button>
    );
}