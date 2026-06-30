'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TrialSection from '@/components/custom/common/traial-section';
import useTrialModalStore from '@/state-manager/trial-modal-store';

export default function GlobalTrialModal() {
  const { isOpen, closeModal } = useTrialModalStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-5xl p-0 overflow-y-auto max-h-[90vh] rounded-[32px] bg-[#badeff] brand-light-border shadow-2xl z-[99999]">
        <DialogTitle className="sr-only">Đăng ký học thử miễn phí</DialogTitle>
        <TrialSection isPopup={true} onSuccess={closeModal} />
      </DialogContent>
    </Dialog>
  );
}
