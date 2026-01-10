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
  { icon: LayoutDashboard, label: "Dashboard", href: "" },
  { icon: Users, label: "Employee", href: "" },
  { icon: DollarSign, label: "Payroll", href: "" },
  { icon: Navigation, label: "Pay Slip", href: "" },
  { icon: BarChart3, label: "Attendance", href: "" },
  { icon: MessageSquare, label: "Request Center", href: "" },
  { icon: BookOpen, label: "Career Database", href: "" },
  { icon: MessageSquare, label: "Notice Board", href: "/notice-board" },
  { icon: BarChart3, label: "Activity Log", href: "" },
  { icon: LogOut, label: "Exit Interview", href: "" },
  { icon: User, label: "Profile", href: "" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#FFFFFF] text-[#232948] h-screen overflow-y-auto sticky top-0">
      <div className="p-4 md:p-6 border-slate-700 flex items-center gap-2">
        {/* SVG from public folder */}
        <img src="/Logo.png" alt="Logo"  />

        {/* Text */}
        {/* <h1 className="text-lg md:text-xl font-bold">Nebs-IT</h1> */}
      </div>

      <nav className="p-3 md:p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-2 transition-colors text-sm md:text-base ${
                item.href == '/notice-board'
                  ? "bg-[#F5F6FA] border-r-2 border-orange-400"
                  : " hover:bg-[#F5F6FA]"
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
