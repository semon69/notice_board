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

interface Notice {
  id: string;
  title: string;
  type: string;
  department: string;
  publishedOn: string;
  status: "published" | "draft" | "unpublished";
}

interface NoticeListingTableProps {
  onCreateNotice: () => void;
}

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "Office closed on Friday for maintenance",
    type: "General / Company-A",
    department: "All Department",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "2",
    title: "Eid al-Fit holiday schedule",
    type: "Holiday & Event",
    department: "Finance",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "3",
    title: "Updated code of conduct policy",
    type: "HR & Policy Update",
    department: "Sales Team",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "4",
    title: "Payroll for October will be processed on 28th",
    type: "Finance & Payroll",
    department: "Web Team",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "5",
    title: "System update scheduled for Oct 10 02:00-11:00 PM",
    type: "IT / System Maintenance",
    department: "Database Team",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "6",
    title: "Design team sprint review moved to Tuesday",
    type: "Department / Team",
    department: "Admin",
    publishedOn: "15-Jun-2025",
    status: "published",
  },
  {
    id: "7",
    title: "Unauthorized absence recorded on 10 Oct 2025",
    type: "Warning / Disciplinary",
    department: "Individual",
    publishedOn: "15-Jun-2025",
    status: "unpublished",
  },
  {
    id: "8",
    title: "Office closed today due to servers weather",
    type: "Emergency / Urgent",
    department: "HR",
    publishedOn: "15-Jun-2025",
    status: "draft",
  },
];

export function NoticeListingTable({
  onCreateNotice,
}: NoticeListingTableProps) {
  const [notices, setNotices] = useState<Notice[]>(mockNotices);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNoticeId, setActiveNoticeId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const activeCount = notices.filter((n) => n.status === "published").length;
  const draftCount = notices.filter((n) => n.status === "draft").length;

  const filteredNotices = notices.filter((notice) => {
    const matchesDept =
      !filterDepartment ||
      filterDepartment === "all" ||
      notice.department === filterDepartment;
    const matchesStatus =
      !filterStatus || filterStatus === "all" || notice.status === filterStatus;
    const matchesSearch =
      !searchQuery ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotices = filteredNotices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const toggleStatus = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const newStatus =
            n.status === "published" ? "unpublished" : "published";
          return { ...n, status: newStatus as "published" | "unpublished" };
        }
        return n;
      })
    );
  };

  const handleDeleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
  };

  const getDepartments = () => {
    return [...new Set(notices.map((n) => n.department))].sort();
  };

  const getTypeColor = (type: string): string => {
    if (type.includes("General")) return " text-blue-700";
    if (type.includes("Holiday")) return "text-green-700";
    if (type.includes("HR")) return " text-purple-700";
    if (type.includes("Finance")) return " text-amber-700";
    if (type.includes("Database")) return " text-cyan-700";
    if (type.includes("Department")) return " text-indigo-700";
    if (type.includes("Sales")) return " text-orange-700";
    if (type.includes("Web")) return " text-red-700";
    return " text-gray-800";
  };

  console.log({ paginatedNotices });

  return (
    <div className="space-y-4 md:space-y-6">
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {activeCount}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Active Notices
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                {draftCount}
              </div>
              <div className="text-xs md:text-sm text-gray-600 mt-1">
                Draft Notices
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}

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
            onClick={onCreateNotice}
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
              {getDepartments().map((dept) => (
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
              {paginatedNotices.map((notice) => (
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
                    {notice.title}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell text-[#595F7A]">
                    {notice.type}
                  </td>
                  <td
                    className={`px-3 md:px-6 py-3 md:py-4 ${getTypeColor(
                      notice.department
                    )}  hidden md:table-cell text-xs md:text-sm`}
                  >
                    {notice.department}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-[#595F7A] hidden sm:table-cell text-xs md:text-sm">
                    {notice.publishedOn}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        className={
                          notice.status === "published"
                            ? "bg-[#DAFAEF] text-[#00A46E] border-0 text-xs"
                            : notice.status === "draft"
                            ? "bg-orange-100 text-orange-800 border-0 text-xs"
                            : "bg-gray-100 text-gray-800 border-0 text-xs"
                        }
                      >
                        {notice.status.charAt(0).toUpperCase() +
                          notice.status.slice(1)}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-1 md:gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer">
                        <SquarePen size={16} className="text-gray-600" />
                      </button>
                      {/* Ellipsis */}
                      <button
                        onClick={() =>
                          setActiveNoticeId(
                            activeNoticeId === notice.id ? null : notice.id
                          )
                        }
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                      >
                        <EllipsisVertical size={16} className="text-gray-600" />
                      </button>
                      {activeNoticeId === notice.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-8 mt-24 z-50 bg-gray-100 border border-gray-300 rounded-lg shadow-md p-3 w-40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">
                              {notice.status === "published"
                                ? "Published"
                                : "Draft"}
                            </span>

                            {/* <Switch
                              // className="bg-green-500"
                              className="
        h-5 w-9
        data-[state=checked]:bg-[#08b57c]
        data-[state=unchecked]:bg-gray-300
      "
                              checked={notice.status === "published"}
                              onCheckedChange={() => {
                                toggleStatus(notice.id);
                                setActiveNoticeId(null); // close after toggle
                              }}
                            /> */}
                            <Switch
                              checked={notice.status === "published"}
                              onCheckedChange={() => toggleStatus(notice.id)}
                              className="
      relative inline-flex h-4 w-8 items-center rounded-full
      data-[state=checked]:bg-[#00A46E]
      data-[state=unchecked]:bg-gray-300
      transition-colors
    "
                            >
                              <span
                                className="
        inline-block h-3 w-3 transform rounded-full bg-white shadow
        transition-transform
        data-[state=checked]:translate-x-3.5
        data-[state=unchecked]:translate-x-0.5
      "
                              />
                            </Switch>
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
    </div>
  );
}
