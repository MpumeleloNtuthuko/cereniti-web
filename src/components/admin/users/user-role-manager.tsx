"use client";

import { useState } from "react";
import { updateUserRole } from "@/features/admin/user-actions";
import { Loader2, Shield, User, Briefcase, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // Assuming you installed sonner previously

interface RoleManagerProps {
  userId: string;
  currentRole: string;
  userName: string;
}

export function UserRoleManager({ userId, currentRole, userName }: RoleManagerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // OPTIMISTIC STATE: We track the role locally for instant feedback
  const [optimisticRole, setOptimisticRole] = useState(currentRole);

  const handleRoleChange = async (newRole: 'client' | 'contractor' | 'admin') => {
    if (newRole === optimisticRole) return;
    
    // 1. Update UI Immediately (Optimistic)
    const previousRole = optimisticRole;
    setOptimisticRole(newRole);
    setIsOpen(false);
    setIsLoading(true);

    // 2. Call Server
    try {
      const res = await updateUserRole(userId, newRole);

      if (!res.success) {
        throw new Error(res.message);
      }
      
      toast.success(`Role updated to ${newRole}`);
      // No need to revert, revalidatePath from server will confirm it shortly
    } catch (e: any) {
      // 3. Revert on Failure
      setOptimisticRole(previousRole);
      toast.error("Failed to update role", { description: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'contractor': return <Briefcase className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  const getColor = (role: string) => {
    switch (role) {
      case 'admin': return "bg-purple-100 text-purple-700 border-purple-200";
      case 'contractor': return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all",
          getColor(optimisticRole) // Use optimistic state here
        )}
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : getIcon(optimisticRole)}
        {optimisticRole}
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white border border-cereniti-200 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 space-y-1">
              <button onClick={() => handleRoleChange('client')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg text-left">
                <User className="h-3 w-3" /> Make Client
              </button>
              <button onClick={() => handleRoleChange('contractor')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg text-left">
                <Briefcase className="h-3 w-3" /> Make Specialist
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button onClick={() => handleRoleChange('admin')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-lg text-left">
                <Shield className="h-3 w-3" /> Make Admin
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}