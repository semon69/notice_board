"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAnother: () => void;
  noticeTitle?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  onCreateAnother,
  noticeTitle = "Holiday Schedule - November 2026",
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-20 max-w-2xl w-full mx-4 text-center">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#10B981] rounded-full flex items-center justify-center">
            <Check size={36} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl text-[#1A1F3C] mb-6">
          Notice Published Successfully
        </h2>

        <p className="text-[#1A1F3C] text-[16px] mb-6">
          Your notice "{noticeTitle}" has been published and is now visible to
          all selected departments.
        </p>

        <div className="flex gap-3 justify-center flex-wrap mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 bg-transparent  text-[#3B82F6] rounded-full"
          >
            View Notice
          </Button>
          <Button
            variant="outline"
            onClick={onCreateAnother}
            className="px-6 gap-2 text-[#F95524] rounded-full"
          >
            + Create Another
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 bg-transparent text-[#1A1F3C] rounded-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
