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
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <Check size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Notice Published Successfully
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          Your notice "{noticeTitle}" has been published and is now visible to
          all selected departments.
        </p>

        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 bg-transparent"
          >
            Close
          </Button>
          <Button
            onClick={onCreateAnother}
            className="px-6 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Create Another
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 bg-transparent"
          >
            View Notice
          </Button>
        </div>
      </div>
    </div>
  );
}
