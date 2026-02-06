"use client";

import { LogOut } from "lucide-react";
import { signout } from "@/features/auth/actions"; // Reuse your existing action

export function AdminLogout() {
  return (
    <form action={signout} className="w-full">
      <button 
        type="submit" 
        className="group flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-cereniti-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all"
      >
        <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
        Sign out
      </button>
    </form>
  );
}