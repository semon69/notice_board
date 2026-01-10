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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Upload, X, ChevronLeft } from "lucide-react";
import { useEmployees } from "@/lib/api-hooks";

interface FormData {
  targetDepartment: string;
  noticeTitle: string;
  employeeId: string;
  employeeName: string;
  position: string;
  noticeType: string;
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
  { value: "individual", label: "Individual" },
  { value: "sales", label: "Sales Department" },
  { value: "hr", label: "HR Department" },
  { value: "finance", label: "Finance Department" },
  { value: "it", label: "IT Department" },
];

const FALLBACK_EMPLOYEES = [
  { id: "EMP001", name: "John Doe", position: "Sales Manager" },
  { id: "EMP002", name: "Jane Smith", position: "HR Manager" },
  { id: "EMP003", name: "Mike Johnson", position: "Developer" },
  { id: "EMP004", name: "Sarah Williams", position: "Finance Manager" },
];

const NOTICE_TYPES = [
  "Warning / Disciplinary",
  "Performance Improvement",
  "Appreciation / Recognito",
  "Attendance / Leave Issue",
  "Payroll / Compensation",
  "Contract / Role Update",
  "Advisory / Personal Reminder",
];

const CATEGORIES = [
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
  const { employees: apiEmployees, fetchEmployees } = useEmployees();
  const [employees, setEmployees] = useState(FALLBACK_EMPLOYEES);

  const [formData, setFormData] = useState<FormData>({
    targetDepartment: "",
    noticeTitle: "",
    employeeId: "",
    employeeName: "",
    position: "",
    noticeType: "",
    publishDate: "",
    noticeBody: "",
    categories: [],
    attachments: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (apiEmployees && apiEmployees.length > 0) {
      setEmployees(apiEmployees as any);
    }
  }, [apiEmployees]);

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
    if (formData.categories.length === 0)
      newErrors.categories = "At least one category is required";

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
    if (validateForm()) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/notices`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formData,
              status: "published",
              createdAt: new Date().toISOString(),
            }),
          }
        );

        if (response.ok) {
          onSuccess(formData);
        }
      } catch (error) {
        console.error("Failed to publish notice:", error);
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notices`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            status: "draft",
            createdAt: new Date().toISOString(),
          }),
        }
      );

      if (response.ok) {
        onCancel();
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded">
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create a Notice
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardDescription>Please fill in the details below</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="department" className="text-base font-semibold">
              * Target Department(s) or Individual
            </Label>
            <Select
              value={formData.targetDepartment}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, targetDepartment: value }))
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.targetDepartment && (
              <p className="text-sm text-red-600">{errors.targetDepartment}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-semibold">
              * Notice Title
            </Label>
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
              className="h-10"
            />
            {errors.noticeTitle && (
              <p className="text-sm text-red-600">{errors.noticeTitle}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId" className="text-base font-semibold">
                * Select Employee ID
              </Label>
              <Select
                value={formData.employeeId}
                onValueChange={handleEmployeeSelect}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className="text-sm text-red-600">{errors.employeeId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeName" className="text-base font-semibold">
                * Employee Name
              </Label>
              <Input
                id="employeeName"
                placeholder="Enter employee full name"
                value={formData.employeeName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employeeName: e.target.value,
                  }))
                }
                className="h-10"
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-base font-semibold">
                * Position
              </Label>
              <Input
                id="position"
                placeholder="Select employee department"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                className="h-10"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-base font-semibold">
                * Notice Type
              </Label>
              <Select
                value={formData.noticeType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, noticeType: value }))
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select Notice Type" />
                </SelectTrigger>
                <SelectContent>
                  {NOTICE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.noticeType && (
                <p className="text-sm text-red-600">{errors.noticeType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="publishDate" className="text-base font-semibold">
                * Publish Date
              </Label>
              <div className="relative">
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
                  className="h-10"
                />
              </div>
              {errors.publishDate && (
                <p className="text-sm text-red-600">{errors.publishDate}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body" className="text-base font-semibold">
              Notice Body
            </Label>
            <Textarea
              id="body"
              placeholder="Write the details about notice"
              value={formData.noticeBody}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, noticeBody: e.target.value }))
              }
              className="min-h-24 resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Notice Categories</Label>
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.categories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
            {errors.categories && (
              <p className="text-sm text-red-600">{errors.categories}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              Upload Attachments (optional)
            </Label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload size={32} className="text-blue-500" />
                <p className="text-sm font-medium text-gray-700">
                  Upload notice profile image or drag and drop.
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
                <label
                  htmlFor="file-input"
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 text-sm"
                >
                  Browse Files
                </label>
              </div>
            </div>

            {formData.attachments.length > 0 && (
              <div className="space-y-2 mt-4">
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-sm text-gray-700 flex-1">
                      {file.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X size={16} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              className="px-6 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              className="px-6 bg-transparent"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handlePublish}
              className="px-6 bg-orange-600 hover:bg-orange-700 text-white"
            >
              Publish Notice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
