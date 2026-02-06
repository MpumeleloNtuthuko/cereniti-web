"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client"; // We need a client-side supabase helper
import { User } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

// --- 1. CONTEXT SETUP ---
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  openAuthModal: (targetPath: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// --- 2. THE PROVIDER COMPONENT ---
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetPath, setTargetPath] = useState<string>("/login");
  
  const router = useRouter();
  const supabase = createClient();

  // Check Session on Mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const openAuthModal = (path: string) => {
    setTargetPath(path);
    setIsModalOpen(true);
  };

  const handleLogin = () => {
    setIsModalOpen(false);
    // Redirect to login, but tell it where to go AFTER login
    router.push(`/login?next=${encodeURIComponent(targetPath)}`);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, openAuthModal }}>
      {children}

      {/* --- 3. THE LUXURY MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-cereniti-900/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-cereniti-50 shadow-2xl border border-cereniti-200"
            >
              {/* Decorative Header */}
              <div className="bg-cereniti-900 px-8 py-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center gap-3">
                   <div className="h-12 w-12 rounded-full bg-cereniti-800 flex items-center justify-center border border-cereniti-700">
                      <Lock className="h-5 w-5 text-cereniti-100" />
                   </div>
                   <h3 className="font-serif text-xl text-white">Member Access Required</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 text-center space-y-4">
                <p className="text-cereniti-600 leading-relaxed text-sm">
                  To maintain the integrity of our booking system and protect client privacy, you must be a verified member to access this route.
                </p>
                <div className="bg-cereniti-100/50 p-3 rounded-lg border border-cereniti-200">
                   <p className="text-xs text-cereniti-500 uppercase tracking-widest font-bold">Destination</p>
                   <p className="text-cereniti-900 font-medium text-sm mt-1 font-mono">{targetPath}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-white border-t border-cereniti-200 flex flex-col gap-3">
                <Button 
                   onClick={handleLogin}
                   className="w-full bg-cereniti-900 text-white hover:bg-olive-900 h-12 text-base shadow-lg shadow-cereniti-900/20"
                >
                  Proceed to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-cereniti-400 hover:text-cereniti-600 transition-colors py-2 uppercase tracking-widest"
                >
                  Cancel Navigation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AuthContext.Provider>
  );
}