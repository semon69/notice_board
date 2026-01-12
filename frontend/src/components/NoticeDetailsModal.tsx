"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "./notice-listing-table";

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: any;
}

export function NoticeDetailModal({
  isOpen,
  onClose,
  notice,
}: NoticeDetailModalProps) {
  if (!isOpen) return null;

  const getTypeColor = (type: string): string => {
    if (type?.includes("General")) return "bg-blue-100 text-blue-800";
    if (type?.includes("Holiday")) return "bg-green-100 text-green-800";
    if (type?.includes("HR")) return "bg-purple-100 text-purple-800";
    if (type?.includes("Finance")) return "bg-amber-100 text-amber-800";
    if (type?.includes("IT")) return "bg-cyan-100 text-cyan-800";
    if (type?.includes("Department")) return "bg-indigo-100 text-indigo-800";
    if (type?.includes("Warning")) return "bg-orange-100 text-orange-800";
    if (type?.includes("Emergency")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  console.log({ notice });

  return (
    <div
      className="fixed inset-0  z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b flex items-center justify-between p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Notice Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
              Notice Title
            </label>
            <p className="text-sm md:text-base text-gray-900">
              {notice.noticeTitle}
            </p>
          </div>

          {/* Type and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Notice Type
              </label>
              <Badge
                className={`${getTypeColor(
                  notice.noticeType
                )} border-0 font-normal text-xs md:text-sm`}
              >
                {notice.noticeType.join(",")}
              </Badge>
            </div>
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Status
              </label>
              <Badge
                className={
                  notice.status === "published"
                    ? "bg-green-100 text-green-800 border-0 text-xs md:text-sm"
                    : notice.status === "draft"
                    ? "bg-orange-100 text-orange-800 border-0 text-xs md:text-sm"
                    : "bg-gray-100 text-gray-800 border-0 text-xs md:text-sm"
                }
              >
                {notice.status.charAt(0).toUpperCase() + notice.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Department and Published Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Department/Individual
              </label>
              <p className="text-sm md:text-base text-blue-600">
                {notice.targetDepartment}
              </p>
            </div>
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Published Date
              </label>
              <p className="text-sm md:text-base text-gray-900">
                {formatDate(notice.publishDate)}
              </p>
            </div>
          </div>

          {/* Employee Info Row */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notice.selectedEmployee.employeeId && (
              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                  Employee ID
                </label>
                <p className="text-sm md:text-base text-gray-900">
                  {notice.selectedEmployee.employeeId}
                </p>
              </div>
            )}
            {notice.selectedEmployee.employeeName && (
              <div>
                <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                  Employee Name
                </label>
                <p className="text-sm md:text-base text-gray-900">
                  {notice.selectedEmployee.employeeName}
                </p>
              </div>
            )}
          </div>

          {/* Notice Body */}
          {notice.noticeBody && (
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Notice Body
              </label>
              <div className="bg-gray-50 p-3 md:p-4 rounded border border-gray-200">
                <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                  {notice.noticeBody}
                </p>
              </div>
            </div>
          )}
          {/* Attachments */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div>
              <label className="text-xs md:text-sm font-semibold text-gray-700 block mb-2">
                Attachments
              </label>
              <div className="space-y-2">
                {notice.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded border border-gray-200"
                  >
                    <span className="text-xs md:text-sm text-gray-700 truncate">
                      {attachment}
                    </span>
                    <a
                      href="#"
                      className="text-xs md:text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap ml-2"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t p-4 md:p-6 flex justify-end gap-2 md:gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-sm md:text-base bg-transparent rounded-full"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
