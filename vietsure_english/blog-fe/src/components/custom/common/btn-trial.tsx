"use client"

import useUserLoginStore from "@/state-manager/user-login-store";
import useTrialModalStore from "@/state-manager/trial-modal-store";

interface BtnTrialProps {
  className?: string;
  children?: React.ReactNode;
  triggerPopup?: boolean;
}

export default function BtnTrial({ className, children, triggerPopup = false }: BtnTrialProps) {
  const { user } = useUserLoginStore();
  const openModal = useTrialModalStore((state) => state.openModal);

  const handleTrialClick = () => {
    if (triggerPopup) {
      openModal();
    } else {
      const trialSection = document.getElementById('trial-section');
      if (trialSection) {
        trialSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback if section doesn't exist on page
        openModal();
      }
    }
  };

  if (user) {
    return null; // Nếu đã đăng nhập, không hiển thị nút
  }

  // Base classes that handle mobile text sizing and spacing
  const defaultClass = "px-6 md:px-9 py-2.5 md:h-12 bg-[#1e3a8a] text-white rounded-full hover:bg-blue-800 transition-all text-sm md:text-lg font-bold shadow-md hover:shadow-lg flex items-center justify-center";

  return (
    <button
      className={className || defaultClass}
      onClick={handleTrialClick}
    >
      {children || "Học thử miễn phí"}
    </button>
  );
}