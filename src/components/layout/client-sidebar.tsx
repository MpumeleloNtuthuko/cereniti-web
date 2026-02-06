"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Calendar, LifeBuoy, Settings, LogOut, Plus, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signout } from "@/features/auth/actions";
import { cn } from "@/lib/utils";

interface ClientSidebarProps {
  userEmail?: string;
}

export function ClientSidebar({ userEmail }: ClientSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/client" },
    { label: "My Bookings", icon: Calendar, href: "/client/bookings" },
    { label: "Concierge & Support", icon: LifeBuoy, href: "/client/support" },
    { label: "Settings", icon: Settings, href: "/client/settings" },
  ];

  // Helper to close menu when a link is clicked
  const handleLinkClick = () => setIsOpen(false);

  // SHARED CONTENT (The actual menu items)
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-cereniti-100">
        <h1 className="font-serif text-xl text-cereniti-900 tracking-tight">
          Cereniti <span className="text-gold-600">Member.</span>
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-cereniti-400 mt-1">Private Portal</p>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <Link href="/book" onClick={handleLinkClick}>
          <Button className="w-full bg-cereniti-900 text-white hover:bg-gold-600 flex items-center gap-2 mb-6">
            <Plus className="h-4 w-4" /> New Booking
          </Button>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all",
                pathname === item.href
                  ? "bg-cereniti-100 text-cereniti-900 font-bold"
                  : "text-cereniti-600 hover:bg-cereniti-50 hover:text-cereniti-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* FOOTER */}
      <div className="p-4 mt-auto border-t border-cereniti-100 bg-white">
        <div className="mb-4 px-4">
           <p className="text-[10px] uppercase tracking-widest text-cereniti-400 font-bold">Logged in as</p>
           <p className="text-xs text-cereniti-600 truncate font-mono">{userEmail}</p>
        </div>
        <form action={signout} className="w-full">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-2 w-full text-left opacity-60 hover:opacity-100 hover:text-red-600 transition-all cursor-pointer rounded-lg hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* --- MOBILE TOP BAR (Visible only on small screens) --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-cereniti-200 sticky top-0 z-40">
        <span className="font-serif text-lg text-cereniti-900">My Suite</span>
        <button onClick={() => setIsOpen(true)} className="p-2 text-cereniti-900">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* --- MOBILE DRAWER (Slide in from left) --- */}
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar Panel */}
      <div 
        className={cn(
          "fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl z-50 transition-transform duration-300 ease-out md:hidden border-r border-cereniti-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute top-4 right-4">
            <button onClick={() => setIsOpen(false)} className="p-2 text-cereniti-400 hover:text-cereniti-900">
                <X className="h-6 w-6" />
            </button>
        </div>
        <SidebarContent />
      </div>

      {/* --- DESKTOP SIDEBAR (Visible only on md+) --- */}
      <aside className="hidden md:flex w-64 bg-white border-r border-cereniti-200 flex-col h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}