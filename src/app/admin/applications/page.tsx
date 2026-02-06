import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/button"; // Optional: if you have a badge component, else use span
import { Eye, FileText, CheckCircle, XCircle } from "lucide-react";

export default async function ApplicationsPage() {
  const supabase = await createClient();

  const { data: applications } = await supabase
    .from("contractor_applications")
    .select(`
      *,
      assessment:contractor_assessments(total_score, status)
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 lg:p-12">
      
      {/* HEADER: Stacked on Mobile */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-cereniti-900">Guild Applications</h1>
          <p className="text-cereniti-500 text-sm mt-1">Review, vetting, and onboarding pipeline.</p>
        </div>
        <div>
           <span className="px-3 py-1 bg-white border border-cereniti-200 rounded text-xs font-medium">
             Total: {applications?.length || 0}
           </span>
        </div>
      </div>

      <div className="bg-white border border-cereniti-200 rounded-xl overflow-hidden shadow-sm">
        
        {/* SCROLL WRAPPER */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-cereniti-50 border-b border-cereniti-200">
              <tr>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Candidate</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Experience</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Assessment</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold text-cereniti-900 uppercase tracking-wider text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cereniti-100">
              {applications?.map((app: any) => {
                const assessment = app.assessment?.[0];
                const score = assessment?.total_score || 0;
                
                return (
                  <tr key={app.id} className="hover:bg-cereniti-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-cereniti-900">{app.full_name}</div>
                      <div className="text-cereniti-400 text-xs">{app.email}</div>
                    </td>
                    <td className="px-6 py-4 text-cereniti-600">
                      {app.experience_years} Years
                    </td>
                    <td className="px-6 py-4">
                      {assessment ? (
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-12 rounded-full overflow-hidden bg-gray-200`}>
                            <div 
                              className={`h-full ${score >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} 
                              style={{ width: `${score}%` }}
                            />
                          </div>
                          <span className={`font-bold ${score >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {score}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-cereniti-300 italic">Pending</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/admin/applications/${app.id}`}>
                        <button className="text-cereniti-500 hover:text-cereniti-900 font-medium text-xs border border-cereniti-200 px-3 py-1.5 rounded hover:bg-white transition-all">
                          Review
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {(!applications || applications.length === 0) && (
          <div className="p-12 text-center text-cereniti-400">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    assessment_invited: "bg-blue-50 text-blue-700 border-blue-200",
    interview: "bg-purple-50 text-purple-700 border-purple-200",
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${styles[status] || styles.pending}`}>
      {status.replace("_", " ")}
    </span>
  );
}