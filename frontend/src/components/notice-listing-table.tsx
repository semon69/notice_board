"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit2, Trash2, Plus, SlidersHorizontal } from "lucide-react";
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
    if (type.includes("General")) return "bg-blue-100 text-blue-800";
    if (type.includes("Holiday")) return "bg-green-100 text-green-800";
    if (type.includes("HR")) return "bg-purple-100 text-purple-800";
    if (type.includes("Finance")) return "bg-amber-100 text-amber-800";
    if (type.includes("IT")) return "bg-cyan-100 text-cyan-800";
    if (type.includes("Department")) return "bg-indigo-100 text-indigo-800";
    if (type.includes("Warning")) return "bg-orange-100 text-orange-800";
    if (type.includes("Emergency")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

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
          <div className="flex gap-3 items-center">
            <p className="text-[#00A46E]">Active Notices: {activeCount}</p>
            <p className="text-[#FFA307]">Draft Notice:{draftCount}</p>
          </div>
        </div>
        <div>
          <Button
            onClick={onCreateNotice}
            className="bg-orange-600 hover:bg-orange-700 text-white gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <Plus size={20} />
            Create Notice
          </Button>
          <Button
            onClick={onCreateNotice}
            className="bg-orange-600 hover:bg-orange-700 text-white gap-2 w-full sm:w-auto text-sm md:text-base"
          >
            <Plus size={20} />
            Create Notice
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
            <div className="text-xs md:text-sm font-medium text-gray-700">
              Filter by:
            </div>

            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-full sm:w-48 text-sm md:text-base">
                <SelectValue placeholder="Departments or Individuals" />
              </SelectTrigger>
              <SelectContent>
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
              className="w-full sm:w-48 text-sm md:text-base"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32 text-sm md:text-base">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="unpublished">Unpublished</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="gap-2 bg-transparent w-full sm:w-auto text-sm md:text-base"
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 hidden lg:table-cell">
                    Notice Type
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">
                    Departments/Individual
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700 hidden sm:table-cell">
                    Published On
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedNotices.map((notice) => (
                  <tr key={notice.id} className="border-b hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-900 max-w-xs truncate">
                      {notice.title}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 hidden lg:table-cell">
                      <Badge
                        className={`${getTypeColor(
                          notice.type
                        )} border-0 font-normal text-xs`}
                      >
                        {notice.type}
                      </Badge>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-blue-600 hidden md:table-cell text-xs md:text-sm">
                      {notice.department}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4 text-gray-700 hidden sm:table-cell text-xs md:text-sm">
                      {notice.publishedOn}
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={
                            notice.status === "published"
                              ? "bg-green-100 text-green-800 border-0 text-xs"
                              : notice.status === "draft"
                              ? "bg-orange-100 text-orange-800 border-0 text-xs"
                              : "bg-gray-100 text-gray-800 border-0 text-xs"
                          }
                        >
                          {notice.status.charAt(0).toUpperCase() +
                            notice.status.slice(1)}
                        </Badge>
                        <Switch
                          checked={notice.status === "published"}
                          onCheckedChange={() => toggleStatus(notice.id)}
                          className="scale-75 md:scale-100"
                        />
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center gap-1 md:gap-2">
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Eye size={16} className="text-gray-600" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-center gap-1 md:gap-2 p-3 md:p-4 border-t flex-wrap">
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
        </CardContent>
      </Card>
    </div>
  );
}
