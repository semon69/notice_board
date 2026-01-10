"use client";

import { useState } from "react";
import { MainLayout } from "@/components/main-layout";
import { CreateNoticeForm } from "@/components/create-notice-form";
import { NoticeListingTable } from "@/components/notice-listing-table";
import { SuccessModal } from "@/components/success-modal";

export default function NoticeBoardPage() {
  const [activeTab, setActiveTab] = useState("listing");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);

  const handleNoticePublished = (data: any) => {
    setSuccessData(data);
    setShowSuccessModal(true);
    setActiveTab("listing");
  };

  return (
    <MainLayout greeting="Good Afternoon Asif" date="13 June, 2026">
      <div className="p-3 sm:p-4 md:p-6 w-full">
        {activeTab === "create" ? (
          <CreateNoticeForm
            onSuccess={handleNoticePublished}
            onCancel={() => setActiveTab("listing")}
          />
        ) : (
          <NoticeListingTable onCreateNotice={() => setActiveTab("create")} />
        )}

        {showSuccessModal && (
          <SuccessModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            onCreateAnother={() => {
              setShowSuccessModal(false);
              setActiveTab("create");
            }}
            noticeTitle={
              successData?.title || "Holiday Schedule - November 2026"
            }
          />
        )}
      </div>
    </MainLayout>
  );
}
