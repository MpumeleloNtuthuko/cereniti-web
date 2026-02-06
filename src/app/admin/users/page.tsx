import { createClient } from "@/lib/supabase/server";
import { UserRoleManager } from "@/components/admin/users/user-role-manager";
import { Search, ShieldCheck } from "lucide-react";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";
  const supabase = await createClient();

  let dbQuery = supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (query) dbQuery = dbQuery.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`);
  const { data: users, error } = await dbQuery;

  if (error) return <div className="p-12 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-4 lg:p-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="font-serif text-3xl text-cereniti-900">User Registry</h1>
          <p className="text-cereniti-500 text-sm mt-1">Directory of Clients & Staff.</p>
        </div>
        
        {/* Search Bar - Full width on mobile */}
        <form className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cereniti-400" />
          <input 
            name="q" defaultValue={query} placeholder="Search..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-cereniti-200 rounded-lg text-sm focus:outline-none focus:border-cereniti-900 transition-colors"
          />
        </form>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="block md:hidden space-y-4">
        {users?.map((u) => (
          <div key={u.id} className="bg-white p-4 rounded-xl border border-cereniti-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-cereniti-100 flex items-center justify-center text-sm font-bold text-cereniti-600 uppercase">
                {u.email[0]}
              </div>
              <div className="overflow-hidden">
                <div className="font-medium text-cereniti-900 truncate">{u.full_name || "Guest"}</div>
                <div className="text-xs text-cereniti-400 truncate">{u.email}</div>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-cereniti-50 pt-3">
              <span className="text-[10px] text-cereniti-400 font-mono">
                Joined {new Date(u.created_at).toLocaleDateString()}
              </span>
              <UserRoleManager userId={u.id} currentRole={u.role} userName={u.full_name || u.email} />
            </div>
          </div>
        ))}
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-cereniti-50 border-b border-cereniti-200">
            <tr>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Identity</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Contact</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Joined</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs text-right">Role / Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cereniti-100">
            {users?.map((u) => (
              <tr key={u.id} className="hover:bg-cereniti-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-cereniti-100 flex items-center justify-center text-xs font-bold text-cereniti-600 uppercase">{u.email[0]}</div>
                    <div><div className="font-medium text-cereniti-900">{u.full_name || "Guest"}</div><div className="text-[10px] text-cereniti-400 font-mono">{u.id.slice(0, 6)}...</div></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-cereniti-600"><div><span>{u.email}</span><br/><span className="text-xs text-cereniti-400">{u.phone || "-"}</span></div></td>
                <td className="px-6 py-4 text-cereniti-600">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right"><div className="flex justify-end"><UserRoleManager userId={u.id} currentRole={u.role} userName={u.full_name || u.email} /></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-xs text-cereniti-400 text-center flex items-center justify-center gap-1">
        <ShieldCheck className="h-3 w-3" /> Secure Admin Log Active
      </div>
    </div>
  );
}