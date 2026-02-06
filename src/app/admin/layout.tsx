import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Calendar, Settings, ShieldAlert, LayoutDashboard, CalendarClock } from "lucide-react";
import { AccessDenied } from "@/components/admin/access-denied";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminLogout } from "@/components/admin/logout-button";
import { AdminMobileNav } from "@/components/admin/mobile-nav"; // <--- Import

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== 'admin') return <AccessDenied />;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Applications", icon: Users, href: "/admin/applications" },
    { label: "Bookings", icon: Calendar, href: "/admin/bookings" },
    { label: "Availability", icon: CalendarClock, href: "/admin/availability" },
    { label: "User Registry", icon: Users, href: "/admin/users" },
    { label: "Incident Reports", icon: ShieldAlert, href: "/admin/incidents" },
    { label: "System Config", icon: Settings, href: "/admin/settings" },
  ];

  return (
    // FIX: Changed flex-row to flex-col for mobile, lg:flex-row for desktop
    <div className="min-h-screen bg-cereniti-50 flex flex-col lg:flex-row">
      
      <AdminAuthGuard />

      {/* MOBILE NAVIGATION (Hidden on Desktop) */}
      <AdminMobileNav userEmail={user.email || ""} />

      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <aside className="w-64 bg-cereniti-900 text-cereniti-100 flex-shrink-0 hidden lg:flex flex-col h-screen sticky top-0">
        <div className="p-8 border-b border-white/10">
          <h1 className="font-serif text-2xl text-white tracking-tight">Cereniti <span className="text-olive-500">Ops.</span></h1>
          <p className="text-[10px] uppercase tracking-widest text-cereniti-500 mt-1">Command Center</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-cereniti-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <AdminLogout />
          <div className="flex items-center gap-3 px-4 py-2 opacity-50">
            <div className="h-8 w-8 rounded-full bg-olive-900 flex items-center justify-center text-xs font-bold text-olive-400 border border-olive-800">
              {user.email?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-cereniti-400 truncate font-mono">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      {/* FIX: removed h-screen to allow natural scrolling on mobile */}
      <main className="flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}