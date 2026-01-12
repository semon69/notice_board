"use client";

import type React from "react";
import { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, UploadCloud } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Upload, X, ChevronLeft } from "lucide-react";
import { useNotices } from "@/lib/api-hooks";
import { Button } from "./ui/button";

interface FormData {
  targetDepartment: string;
  noticeTitle: string;
  employeeId: string;
  employeeName: string;
  position: string;
  noticeType: string[];
  publishDate: string;
  noticeBody: string;
  categories: string[];
  attachments: File[];
}

interface CreateNoticeFormProps {
  onSuccess: (data: FormData) => void;
  onCancel: () => void;
}

const DEPARTMENTS = [
  "Individual",
  "IT",
  "HR",
  "Finance",
  "Operations",
  "Marketing",
  "Sales",
];
// "Individual", "IT", "HR", "Finance", "Operations", "Marketing", "Sales"

const FALLBACK_EMPLOYEES = [
  { id: "EMP001", name: "David Raya", position: "Sales Manager" },
  { id: "EMP002", name: "Declan Rice", position: "HR Manager" },
  { id: "EMP003", name: "Md Emon Sheikh", position: "Developer" },
  { id: "EMP004", name: "Lweis Skelly", position: "Finance Manager" },
  { id: "EMP006", name: "Martin Odegard", position: "Operations Manager" },
  { id: "EMP007", name: "Bukayo Saka", position: "Individual" },
  { id: "EMP008", name: "Ben White", position: "IT Manager" },
  { id: "EMP009", name: "Jurian Timber", position: "Finance Manager" },
  { id: "EMP010", name: "Matrin Zubimendi", position: "Controll Manager" },
];

const NOTICE_TYPES = [
  "General / Company-A",
  "Holiday & Event",
  "HR & Policy Update",
  "Warning / Disciplinary",
  "Performance Improvement",
  "Appreciation / Recognito",
  "Attendance / Leave Issue",
  "Payroll / Compensation",
  "Contract / Role Update",
  "Advisory / Personal Reminder",
];

export function CreateNoticeForm({
  onSuccess,
  onCancel,
}: CreateNoticeFormProps) {
  // const { employees: apiEmployees, fetchEmployees } = useEmployees();
  const [employees, setEmployees] = useState(FALLBACK_EMPLOYEES);
  const { createNotice } = useNotices();

  const [formData, setFormData] = useState<FormData>({
    targetDepartment: "",
    noticeTitle: "",
    employeeId: "",
    employeeName: "",
    position: "",
    noticeType: [],
    publishDate: "",
    noticeBody: "",
    categories: [],
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.targetDepartment)
      newErrors.targetDepartment = "Target Department is required";
    if (!formData.noticeTitle)
      newErrors.noticeTitle = "Notice Title is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.employeeName)
      newErrors.employeeName = "Employee Name is required";
    if (!formData.position) newErrors.position = "Position is required";
    if (!formData.noticeType) newErrors.noticeType = "Notice Type is required";
    if (!formData.publishDate)
      newErrors.publishDate = "Publish Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleEmployeeSelect = (employeeId: string) => {
    const employee = employees.find((e) => e.id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeId,
        employeeName: employee.name,
        position: employee.position,
      }));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(files)],
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...Array.from(e.target.files!)],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    const selectedEmployee = {
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      employeePosition: formData.position,
    };
    try {
      const res: any = await createNotice({
        ...formData,
        selectedEmployee,
        status: "published",
      });
      onSuccess(res.data);
    } catch (err) {
      console.error("Failed to publish notice:", err);
    }
  };

  const handleSaveDraft = async () => {
    // try {
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/notices`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       ...formData,
    //       status: "draft",
    //       createdAt: new Date().toISOString(),
    //     }),
    //   }
    // );

    // if (response.ok) {
    //   onCancel();
    // }
    // } catch (error) {
    //   console.error("Failed to save draft:", error);
    // }
    if (!validateForm()) return;
    const selectedEmployee = {
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      employeePosition: formData.position,
    };
    try {
      const res: any = await createNotice({
        ...formData,
        selectedEmployee,
        status: "draft",
      });

      onSuccess(res.data);
    } catch (err) {
      console.error("Failed to publish notice:", err);
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-0">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 border cursor-pointer rounded "
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
          Create a Notice
        </h1>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-1 text-[#232948]">
        <div className="p-4 border-b border-gray-300 bg-[#FAFAFD]">
          <p className="text-[16px]">Please fill in the details below</p>
        </div>

        <div className="p-4 md:p-6 space-y-6 rounded-lg">
          <div className="space-y-2 p-6 bg-[#F5F6FA]">
            <p className="text-sm md:text-base font-semibold  mb-2">
              <span className="text-red-500">*</span> Target Department(s) or
              Individual
            </p>
            <Select
              value={formData.targetDepartment}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, targetDepartment: value }))
              }
            >
              <SelectTrigger className="h-10 border-gray-300">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {DEPARTMENTS.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.targetDepartment && (
              <p className="text-xs md:text-sm text-red-600">
                {errors.targetDepartment}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-semibold mb-2">
              <span className="text-red-500">*</span> Notice Title
            </p>
            <Input
              id="title"
              placeholder="Write the Title of Notice"
              value={formData.noticeTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noticeTitle: e.target.value,
                }))
              }
              className="h-10 text-sm md:text-base border-gray-300"
            />
            {errors.noticeTitle && (
              <p className="text-xs md:text-sm text-red-600">
                {errors.noticeTitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm md:text-base font-semibold mb-2">
                <span className="text-red-500">*</span> Select Employee ID
              </p>
              <Select
                value={formData.employeeId}
                onValueChange={handleEmployeeSelect}
              >
                <SelectTrigger className="h-10 text-sm md:text-base border-gray-300">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className="text-xs md:text-sm text-red-600">
                  {errors.employeeId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm md:text-base font-semibold mb-2">
                <span className="text-red-500">*</span> Employee Name
              </p>
              <Input
                id="employeeName"
                placeholder="Enter employee full name"
                value={formData.employeeName}
                className="h-10 text-sm md:text-base border-gray-300"
                disabled
              />
            </div>

            <div className="space-y-2">
              <p className="text-sm md:text-base font-semibold mb-2">
                <span className="text-red-500">*</span> Position
              </p>
              <Input
                id="position"
                placeholder="Select employee department"
                value={formData.position}
                className="h-10 text-sm md:text-base border-gray-300"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm md:text-base font-semibold mb-2">
                <span className="text-red-500">*</span> Notice Type
              </p>

              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 px-3 text-sm md:text-base"
                  >
                    <span className="truncate text-left">
                      {formData.noticeType.length
                        ? formData.noticeType.join(", ")
                        : "Select Notice Type"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>
                </PopoverTrigger>

                <PopoverContent
                  align="start"
                  className="w-[--radix-popover-trigger-width] p-2 bg-white"
                >
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {NOTICE_TYPES.map((type) => {
                      const checked = formData.noticeType.includes(type);

                      return (
                        <label
                          key={type}
                          className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={checked}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                noticeType: e.target.checked
                                  ? [...prev.noticeType, type]
                                  : prev.noticeType.filter((t) => t !== type),
                              }));
                            }}
                          />
                          <span>{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>

              {errors.noticeType && (
                <p className="text-xs md:text-sm text-red-600">
                  {errors.noticeType}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm md:text-base font-semibold mb-2">
                <span className="text-red-500">*</span> Publish Date
              </p>
              <Input
                id="publishDate"
                type="date"
                value={formData.publishDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    publishDate: e.target.value,
                  }))
                }
                className="h-10 text-sm md:text-base border-gray-300"
              />
              {errors.publishDate && (
                <p className="text-xs md:text-sm text-red-600">
                  {errors.publishDate}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm md:text-base font-semibold mb-2">
              Notice Body
            </p>
            <Textarea
              id="body"
              placeholder="Write the details about notice"
              value={formData.noticeBody}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, noticeBody: e.target.value }))
              }
              className="min-h-24 resize-none text-sm md:text-base border-gray-300"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm md:text-base font-semibold">
              Upload Attachments (optional)
            </Label>
            <div
              className={`border border-dashed border-[#10B981] rounded-lg p-6 md:p-8 text-center transition-colors mt-2 cursor-pointer`}
              onClick={() => document.getElementById("file-input")?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <UploadCloud size={32} className="text-[#10B981]" />
                <p className="text-xs md:text-sm font-medium text-gray-700">
                  <span className="text-[#10B981]">Upload</span> notice profile
                  image or drag and drop.
                </p>
                <p className="text-xs text-gray-600">
                  Accepted File Type: jpg, png
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  id="file-input"
                />
                {/* <label
                  htmlFor="file-input"
                  className="mt-2 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 text-xs md:text-sm"
                >
                  Browse Files
                </label> */}
              </div>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg text-sm md:text-base max-w-72"
                  >
                    <span className="text-xs md:text-sm text-gray-700 flex-1 truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 hover:bg-gray-200 rounded shrink-0"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-4 md:px-6 bg-transparent text-sm md:text-base w-full sm:w-auto rounded-full text-gray-600"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="px-4 md:px-6 cursor-pointer bg-transparent text-sm md:text-base w-full sm:w-auto rounded-full text-[#3B82F6]"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handlePublish}
              className="px-4 md:px-6 cursor-pointer bg-orange-600 hover:bg-orange-700 text-white text-sm md:text-base w-full sm:w-auto rounded-full"
            >
              Publish Notice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
