"use client";

import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  greeting?: string;
  date?: string;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({
  greeting = "Good Afternoon Asif",
  date = "13 June, 2026",
  userName = "Asif Riaz",
  onMenuClick,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu size={20} className="text-gray-600" />
          </Button>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">
              {greeting}
            </h2>
            <p className="text-xs md:text-sm text-gray-600 truncate">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell size={20} className="text-gray-600" />
          </Button>

          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings size={20} className="text-gray-600" />
          </Button>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-600">Admin</p>
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              AR
            </div>
          </div>

          <Button variant="ghost" size="icon">
            <LogOut size={20} className="text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
}
