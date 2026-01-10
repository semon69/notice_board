"use client";

import { Bell, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeaderProps {
  greeting?: string;
  date?: string;
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({
  greeting = "Good Afternoon Asif",
  date = "13 June, 2026",
  userName = "Md Emon Sheikh",
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
            <h2 className="text-[16px] font-semibold text-[#232948] truncate">
              {greeting}
            </h2>
            <p className="text-xs text-gray-600 truncate">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell size={20} className="text-gray-600" />
          </Button>
{/* 
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Settings size={20} className="text-gray-600" />
          </Button> */}

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{userName}</p>
              <p className="text-xs text-gray-600">MERN Dev</p>
            </div>
            <div className="  rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              <Image
                src={
                  "/emon.png"
                }
                alt="Emon"
                width={44}
                height={48}
                className="rounded-full"
              />
            </div>
          </div>
{/* 
          <Button variant="ghost" size="icon">
            <LogOut size={20} className="text-gray-600" />
          </Button> */}
        </div>
      </div>
    </header>
  );
}
