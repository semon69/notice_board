"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit2,
  Plus,
  SlidersHorizontal,
  Pencil,
  EllipsisVertical,
  SquarePen,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useNotices } from "@/lib/api-hooks";
import { Notice } from "@/lib/api-client";
import Toggle from "./Toggle";
import { NoticeDetailModal } from "./NoticeDetailsModal";

interface NoticeListingTableProps {
  onCreateNotice: () => void;
}
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate(); // 1-31
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()]; // 0-11
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function NoticeListingTable({
  onCreateNotice,
}: NoticeListingTableProps) {
  const { notices, fetchNotices, updateNoticeStatus } = useNotices();
  console.log({ notices });
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoticeId, setActiveNoticeId] = useState<string | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const itemsPerPage = 8;

  const activeCount = notices?.data?.filter(
    (n) => n.status === "published"
  ).length;
  const draftCount = notices?.data?.filter((n) => n.status === "draft").length;

  const filteredNotices = notices?.data?.filter((notice) => {
    const matchesDept =
      !filterDepartment ||
      filterDepartment === "all" ||
      notice.targetDepartment === filterDepartment;
    const matchesStatus =
      !filterStatus || filterStatus === "all" || notice.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNotices?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices?.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const getDepartments = () => {
    return [...new Set(notices?.data?.map((n) => n.targetDepartment))].sort();
  };

  const getTypeColor = (type: string): string => {
    if (type?.includes("Holiday")) return "text-green-700";
    if (type?.includes("HR")) return " text-purple-700";
    if (type?.includes("General")) return " text-blue-700";
    if (type?.includes("Finance")) return " text-amber-700";
    if (type?.includes("Database")) return " text-cyan-700";
    if (type?.includes("Department")) return " text-indigo-700";
    if (type?.includes("Sales")) return " text-orange-700";
    if (type?.includes("Web")) return " text-red-700";
    return " text-gray-800";
  };

  const toggleStatus = async (id: string, currentStatus: Notice["status"]) => {
    const nextStatus = currentStatus === "published" ? "unpublished" : "published";

    try {
      setActiveNoticeId(null);
      await updateNoticeStatus(id, nextStatus);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };
  const handleViewNotice = (notice: Notice) => {
    setSelectedNotice(notice);
    setShowDetailModal(true);
  };

  const allDraftNotice = () => {
    setFilterStatus('draft')
  }

  console.log({ paginatedNotices });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-[#232948]">
            Notice Management
          </h2>
          <div className="flex gap-3 items-center text-sm">
            <p className="text-[#00A46E]">Active Notices: {activeCount}</p>
            <p>|</p>
            <p className="text-[#FFA307]">Draft Notice:{draftCount}</p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            onClick={onCreateNotice}
            className="bg-[#F95524] text-white gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <Plus size={20} />
            Create Notice
          </Button>
          <Button
            variant="outline"
            onClick={allDraftNotice}
            className="text-[#F59E0B]  gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <Pencil size={20} />
            All Draft Notice
          </Button>
        </div>
      </div>

      <div className="py-4 pl-4 md:py-6 md:pl-6 md:flex md:flex-row md:justify-end">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
          <div className="text-xs md:text-sm font-medium text-[#232948]">
            Filter by :
          </div>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-full sm:w-48 text-sm md:text-base border-gray-300 text-[#595F7A]">
              <SelectValue placeholder="Departments or Individuals" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Departments</SelectItem>
              {getDepartments().map((dept: any) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Employee Id or Name"
            className="w-full sm:w-48 text-sm md:text-base border-gray-300 outline-0"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-32 text-sm md:text-base border-gray-300 text-[#595F7A]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="gap-2 bg-transparent w-full sm:w-auto text-sm md:text-base border-gray-300 text-[#3B82F6]"
            onClick={() => {
              setFilterDepartment("");
              setFilterStatus("");
              setSearchQuery("");
              setCurrentPage(1);
            }}
          >
            <SlidersHorizontal size={18} />
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="p-0">
        <div className="overflow-x-auto border-2 border-gray-300 rounded-lg">
          <table className="w-full text-xs md:text-sm ">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 text-[#232948]">
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold">
                  Title
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold hidden lg:table-cell">
                  Notice Type
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold hidden md:table-cell">
                  Departments/Individual
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold hidden sm:table-cell">
                  Published On
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold">
                  Status
                </th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-[16px] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotices?.map((notice) => (
                <tr
                  key={notice.id}
                  className="border-b border-gray-300 hover:bg-gray-50 text-[#232948]"
                >
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-sm max-w-xs truncate">
                    {notice.noticeTitle}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell text-[#595F7A]">
                    {notice.noticeType.join(", ")}
                  </td>
                  <td
                    className={`px-3 md:px-6 py-3 md:py-4 ${getTypeColor(
                      notice.department
                    )}  hidden md:table-cell text-xs md:text-sm`}
                  >
                    {notice.targetDepartment}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-[#595F7A] hidden sm:table-cell text-xs md:text-sm">
                    {formatDate(notice.publishDate)}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={
                          notice.status === "published"
                            ? "bg-[#DAFAEF] text-[#00A46E] border-0 text-xs"
                            : notice.status === "unpublished"
                            ? "bg-gray-200 text-gray-700 border-0 text-xs"
                            : "bg-orange-100 text-orange-800 border-0 text-xs"
                        }
                      >
                        {notice.status.charAt(0).toUpperCase() +
                          notice.status.slice(1)}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <button
                        onClick={() => handleViewNotice(notice)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                      >
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                        <SquarePen size={16} className="text-gray-600" />
                      </button>
                      {/* Ellipsis */}
                      <button
                        onClick={() =>
                          setActiveNoticeId(
                            activeNoticeId === notice._id ? null : notice._id
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                      >
                        <EllipsisVertical size={16} className="text-gray-600" />
                      </button>
                      {activeNoticeId === notice._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-8 mt-24 z-50 bg-gray-100 border border-gray-300 rounded-lg shadow-md p-3 w-40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              {notice.status === "published"
                                ? "Published"
                                : "Unpublished"}
                            </span>
                            <Toggle
                              checked={notice.status === "published"}
                              onCheckedChange={() =>
                                toggleStatus(notice._id, notice.status)
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-1 md:gap-2 p-3 md:p-4 flex-wrap">
          <button
            className="p-2 hover:bg-gray-100 rounded text-sm md:text-base"
            disabled={currentPage === 1}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 md:w-8 md:h-8 rounded flex items-center justify-center text-xs md:text-sm ${
                currentPage === page
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            className="p-2 hover:bg-gray-100 rounded text-sm md:text-base"
            onClick={() =>
              setCurrentPage(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
      {selectedNotice && (
        <NoticeDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          notice={selectedNotice}
        />
      )}
    </div>
  );
}
