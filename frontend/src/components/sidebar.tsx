"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Navigation,
  BarChart3,
  MessageSquare,
  BookOpen,
  LogOut,
  User,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Employee", href: "/employee" },
  { icon: DollarSign, label: "Payroll", href: "/payroll" },
  { icon: Navigation, label: "Pay Slip", href: "/payslip" },
  { icon: BarChart3, label: "Attendance", href: "/attendance" },
  { icon: MessageSquare, label: "Request Center", href: "/request-center" },
  { icon: BookOpen, label: "Career Database", href: "/career-database" },
  { icon: MessageSquare, label: "Notice Board", href: "/notice-board" },
  { icon: BarChart3, label: "Activity Log", href: "/activity-log" },
  { icon: LogOut, label: "Exit Interview", href: "/exit-interview" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen overflow-y-auto sticky top-0">
      <div className="p-4 md:p-6 border-b border-slate-700">
        <h1 className="text-lg md:text-xl font-bold">Nebs-IT</h1>
      </div>

      <nav className="p-3 md:p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-2 transition-colors text-sm md:text-base ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
