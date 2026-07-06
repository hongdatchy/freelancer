'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TrialSection from '@/components/custom/common/traial-section';
import useTrialModalStore from '@/state-manager/trial-modal-store';

export default function GlobalTrialModal() {
  const { isOpen, closeModal } = useTrialModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-5xl w-[calc(100%-40px)] max-[400px]:w-full max-[400px]:max-w-full max-[400px]:rounded-none max-[400px]:border-none md:w-full p-0 overflow-y-auto max-h-[95vh] max-[400px]:max-h-[100dvh] md:max-h-[90vh] rounded-[32px] bg-[#badeff] brand-light-border shadow-2xl z-[99999]">
        <DialogTitle className="sr-only">Đăng ký học thử miễn phí</DialogTitle>
        <div className="
            max-md:[&_input]:!h-[40px] 
            max-md:[&_form]:!gap-2 
            max-md:[&_form]:!p-4 max-[400px]:[&_form]:!px-2
            max-md:[&_button[type=submit]]:!h-[42px]
            max-md:[&_img.select-none]:!w-[140px] max-md:[&_img.select-none]:!h-[140px] 
            max-[400px]:[&_img.select-none]:!w-[110px] max-[400px]:[&_img.select-none]:!h-[110px]
            max-md:[&_.min-h-\[380px\]]:!min-h-[140px] max-[400px]:[&_.min-h-\[380px\]]:!min-h-[110px]
            max-md:[&_h3]:!text-[15px] max-[400px]:[&_h3]:!text-[13px]
        ">
          <TrialSection isPopup={true} onSuccess={closeModal} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
