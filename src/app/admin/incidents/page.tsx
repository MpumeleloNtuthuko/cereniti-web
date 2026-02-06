import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle, FileText, CheckCircle2, Clock } from "lucide-react";

export default async function IncidentsPage() {
  const supabase = await createClient();

  // Fetch Tickets with Client Data
  const { data: tickets } = await supabase
    .from("support_tickets")
    .select(`
      *,
      profile:profiles(full_name, email)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="p-8 lg:p-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-serif text-3xl text-cereniti-900">Incident Logs</h1>
          <p className="text-cereniti-500 text-sm mt-1">Manage disputes, complaints, and inquiries.</p>
        </div>
      </div>

      <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-cereniti-50 border-b border-cereniti-200">
            <tr>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Priority/Type</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Subject</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Client</th>
              <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Status</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cereniti-100">
            {tickets?.map((ticket: any) => (
              <tr key={ticket.id} className="hover:bg-cereniti-50/50 transition-colors">
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                      {ticket.type === 'incident' || ticket.type === 'complaint' ? (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      ) : (
                        <FileText className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="capitalize">{ticket.type}</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className="font-medium text-cereniti-900">{ticket.subject}</span>
                   <p className="text-xs text-cereniti-400 mt-0.5 line-clamp-1">{ticket.description}</p>
                </td>
                <td className="px-6 py-4 text-cereniti-600">
                   {ticket.profile?.full_name} <br/>
                   <span className="text-xs text-cereniti-400">{ticket.profile?.email}</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/incidents/${ticket.id}`}>
                    <button className="text-olive-600 hover:text-olive-800 font-bold text-xs uppercase tracking-wider">
                      Review
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!tickets || tickets.length === 0) && (
          <div className="p-12 text-center text-cereniti-400">All quiet. No open incidents.</div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'resolved') {
    return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><CheckCircle2 className="h-3 w-3"/> Resolved</span>;
  }
  if (status === 'investigating') {
    return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><Clock className="h-3 w-3"/> Investigating</span>;
  }
  return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit"><AlertCircle className="h-3 w-3"/> Open</span>;
}