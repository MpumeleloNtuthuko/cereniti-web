"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { User } from "@supabase/supabase-js";
import { User as UserIcon, LayoutDashboard, Briefcase, LogOut, Menu, X, ArrowRight } from "lucide-react";
import { signout } from "@/features/auth/actions";
import { usePathname } from "next/navigation";
import { ProtectedLink } from "@/components/ui/protected-link";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface NavbarProps {
  user?: User | null;
}

// --- ANIMATION VARIANTS (Luxury Ease) ---
const sidebarVariants: Variants = { // Added explicit type here
  closed: { 
    x: "100%",
    transition: { 
      duration: 0.4, 
      ease: [0.32, 0.72, 0, 1] as const // Added 'as const'
    }
  },
  open: { 
    x: "0%", // Changed 0 to "0%" to match the string type of "100%"
    transition: { 
      duration: 0.5, 
      ease: [0.32, 0.72, 0, 1] as const // Added 'as const'
    }
  }
};

const overlayVariants: Variants = {
  closed: { 
    opacity: 0,
    transition: { duration: 0.3 }
  },
  open: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

const contentVariants: Variants = {
  closed: { 
    opacity: 0,
    transition: { duration: 0.2 }
  },
  open: { 
    opacity: 1,
    transition: { 
      duration: 0.4,
      delay: 0.2,
      staggerChildren: 0.08
    }
  }
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 20 },
  open: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] as const }
  }
};

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const supabase = createClient();

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  // Fetch User Role
  useEffect(() => {
    async function fetchRole() {
      if (!user) return;
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (data) setRole(data.role);
    }
    fetchRole();
  }, [user, supabase]);

  const getPortalLink = () => {
    if (role === 'admin') return "/admin/dashboard";
    if (role === 'contractor') return "/contractor";
    return "/client";
  };
  const portalRoute = getPortalLink();

  const closeSidebar = () => setIsSidebarOpen(false);

  const publicLinks = [
    { label: "Philosophy", href: "/philosophy" },
    { label: "Rituals", href: "/#services" },
    { label: "Partner", href: "/contractor/join" },
  ];

  return (
    <>
      {/* --- MAIN HEADER BAR (Fixed Top) --- */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 py-4 md:px-12 bg-white/95 backdrop-blur-sm border-b border-gray-100"
      >
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 group z-[101]" onClick={closeSidebar}>
          <div className="relative h-10 w-10 md:h-12 md:w-12">
             <Image src="/logo.png" alt="Cereniti" fill className="object-contain" priority />
          </div>
          <span className="font-serif text-xl md:text-2xl font-light tracking-[0.3em] text-gray-900 transition-colors duration-300">
            CERENITI
          </span>
        </Link>

        {/* --- DESKTOP NAV (Hidden on Mobile) --- */}
        <nav className="hidden md:flex items-center gap-10">
          {publicLinks.map((link) => (
             <Link 
               key={link.href} 
               href={link.href} 
               className="text-[11px] uppercase tracking-[0.15em] font-normal text-gray-600 hover:text-gray-900 transition-colors duration-300"
             >
               {link.label}
             </Link>
          ))}
        </nav>

        {/* --- DESKTOP ACTIONS (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href={portalRoute}>
                 <Button variant="ghost" size="sm" className="gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                   {role === 'admin' ? <LayoutDashboard className="h-4 w-4" /> : role === 'contractor' ? <Briefcase className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                   {role === 'admin' ? 'Command' : role === 'contractor' ? 'Portal' : 'My Suite'}
                 </Button>
              </Link>
              <form action={signout}>
                  <button type="submit" className="text-[11px] font-normal text-gray-500 hover:text-red-600 transition-colors uppercase tracking-[0.15em]">Exit</button>
              </form>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-700 hover:text-gray-900 hover:bg-gray-50">Member Login</Button>
            </Link>
          )}

          {pathname !== "/book" && (
            <ProtectedLink href="/book">
              <Button className="bg-gray-900 text-white hover:bg-gray-800 rounded-none px-8 transition-all duration-300 text-[11px] tracking-[0.1em]">
                Book Service
              </Button>
            </ProtectedLink>
          )}
        </div>

        {/* --- MOBILE/TABLET MENU TRIGGER --- */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 z-[101] relative focus:outline-none transition-colors duration-300 text-gray-900 hover:text-gray-600"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

      </motion.header>

      {/* --- LUXURY SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* 1. Backdrop Overlay */}
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={closeSidebar}
              className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[2px] md:hidden"
            />

            {/* 2. Sidebar Panel (Right Aligned) */}
            <motion.div 
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 right-0 bottom-0 z-[9999] w-[320px] bg-white shadow-2xl md:hidden overflow-hidden border-l border-gray-100"
            >
              {/* Close Button (Inside Drawer) */}
              <button 
                onClick={closeSidebar}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors duration-300 z-10"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Sidebar Content Container */}
              <motion.div 
                initial="closed"
                animate="open"
                exit="closed"
                variants={contentVariants}
                className="h-full flex flex-col pt-24 pb-8 px-8"
              >
                {/* A. Navigation Links */}
                <nav className="flex flex-col space-y-1 mb-12">
                  {publicLinks.map((link) => (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link 
                        href={link.href} 
                        onClick={closeSidebar} 
                        className="group block py-4 border-b border-gray-100 transition-colors duration-300"
                      >
                        <span className="text-sm font-normal text-gray-900 tracking-wide group-hover:text-gray-600 transition-colors duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* B. User / Auth Section (Pushed to bottom) */}
                <motion.div variants={itemVariants} className="mt-auto space-y-4">
                  {user ? (
                    <div className="space-y-4">
                      {/* User Profile Snippet */}
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium text-sm">
                          {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">Member</p>
                           <p className="text-sm text-gray-900 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Dashboard Link */}
                      <Link href={portalRoute} onClick={closeSidebar}>
                        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 h-11 text-[11px] uppercase tracking-[0.15em] font-normal rounded-none">
                          {role === 'contractor' ? 'Portal' : 'My Suite'}
                        </Button>
                      </Link>
                      
                      {/* Sign Out */}
                      <form action={signout}>
                         <button 
                           type="submit" 
                           className="w-full text-center text-[11px] text-gray-400 hover:text-red-600 transition-colors py-2 uppercase tracking-[0.15em]"
                         >
                           Sign Out
                         </button>
                      </form>
                    </div>
                  ) : (
                    <Link href="/login" onClick={closeSidebar}>
                      <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 h-12 text-[11px] uppercase tracking-[0.15em] font-normal rounded-none">
                        Member Login
                      </Button>
                    </Link>
                  )}
                </motion.div>

                {/* C. Primary CTA (Book Service) */}
                {pathname !== "/book" && (
                  <motion.div variants={itemVariants} className="mt-6">
                    <ProtectedLink href="/book">
                      <Button 
                        onClick={closeSidebar} 
                        className="w-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 h-12 text-[11px] uppercase tracking-[0.15em] font-normal rounded-none"
                      >
                        Book Service
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </ProtectedLink>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}