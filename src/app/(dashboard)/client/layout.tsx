import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ClientSidebar } from "@/components/layout/client-sidebar"; // <--- Import new component

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Verify Role
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  
  // Security Redirect: Contractors shouldn't be here
  if (profile?.role === 'contractor') redirect("/dashboard/contractor");

  return (
    <div className="min-h-screen bg-cereniti-50 flex flex-col md:flex-row">
      
      {/* RESPONSIVE SIDEBAR */}
      <ClientSidebar userEmail={user.email} />

      {/* MAIN CONTENT */}
      {/* Added pt-4 to give space on mobile below the sticky header */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-12">
        {children}
      </main>
      
    </div>
  );
}