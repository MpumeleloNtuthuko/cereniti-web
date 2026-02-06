"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Users, Calendar, Settings, ShieldAlert, LayoutDashboard } from "lucide-react";
import { AdminLogout } from "./logout-button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function AdminMobileNav({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Applications", icon: Users, href: "/admin/applications" },
    { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
    { label: "User Registry", icon: Users, href: "/admin/users" },
    { label: "Incident Reports", icon: ShieldAlert, href: "/admin/incidents" },
    { label: "System Config", icon: Settings, href: "/admin/settings" },
  ];

  return (
    <div className="lg:hidden bg-cereniti-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      
      {/* Brand */}
      <div>
        <span className="font-serif text-lg tracking-tight">Cereniti <span className="text-olive-500">Ops.</span></span>
      </div>

      {/* Trigger */}
      <button onClick={() => setIsOpen(true)} className="p-2">
        <Menu className="h-6 w-6" />
      </button>

      {/* OVERLAY & DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar Drawer */}
          <div className="relative w-4/5 max-w-xs bg-cereniti-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <span className="font-serif text-xl">Command Center</span>
              <button onClick={() => setIsOpen(false)} className="text-cereniti-400 hover:text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all",
                    pathname === item.href 
                      ? "bg-olive-600 text-white shadow-lg" 
                      : "text-cereniti-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-white/10 space-y-4">
              <AdminLogout />
              <div className="text-xs text-cereniti-500 font-mono truncate px-2">
                {userEmail}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}