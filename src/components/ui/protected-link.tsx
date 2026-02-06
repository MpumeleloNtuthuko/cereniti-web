"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

interface ProtectedLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "button"; // Add styles if needed
}

export function ProtectedLink({ href, children, className }: ProtectedLinkProps) {
  const { user, openAuthModal, isLoading } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    // If loading, do nothing yet
    if (isLoading) {
      e.preventDefault();
      return;
    }

    // If NO user, stop navigation and open modal
    if (!user) {
      e.preventDefault();
      openAuthModal(href);
    }
    
    // If user exists, default Link behavior takes over (navigation)
  };

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}