import { createClient } from "@/lib/supabase/server";
import { ApplicationActions } from "@/components/admin/applications/application-actions";
import { ArrowLeft, FileText, Mail, Download, ShieldCheck, ExternalLink, Calendar, Smartphone, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// --- HELPER COMPONENTS ---

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    assessment_invited: "bg-blue-100 text-blue-800 border-blue-200",
    interview: "bg-purple-100 text-purple-800 border-purple-200",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || "bg-gray-100"}`}>
      {status.replace("_", " ")}
    </span>
  );
}

function ScoreRow({ label, score, max, isCritical }: { label: string, score: number, max: number, isCritical?: boolean }) {
  const pct = (score / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className={`font-medium ${isCritical ? "text-red-600" : "text-cereniti-600"}`}>
          {label} {isCritical && "(Critical)"}
        </span>
        <span className="text-cereniti-900 font-bold">{score}/{max}</span>
      </div>
      <div className="h-2 w-full bg-cereniti-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isCritical && score < max ? 'bg-red-500' : 'bg-olive-600'}`} 
          style={{ width: `${pct}%` }} 
        />
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Await params for Next.js 15
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Application + Assessment
  const { data: app, error } = await supabase
    .from("contractor_applications")
    .select(`
      *,
      assessment:contractor_assessments(*)
    `)
    .eq("id", id)
    .single();

  if (error || !app) {
    notFound();
  }

  // 2. Generate Signed URLs securely
  let cvLink = null;
  let idLink = null;

  if (app.cv_path) {
    const { data } = await supabase.storage.from('secure-applications').createSignedUrl(app.cv_path, 3600);
    if (data) cvLink = data.signedUrl;
  }

  if (app.id_doc_path) {
    const { data } = await supabase.storage.from('secure-applications').createSignedUrl(app.id_doc_path, 3600);
    if (data) idLink = data.signedUrl;
  }

  const assessment = app.assessment?.[0];

  return (
    <div className="p-4 lg:p-12 max-w-6xl mx-auto space-y-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-cereniti-200 pb-8">
        <div>
          <Link href="/admin/applications" className="text-cereniti-500 hover:text-cereniti-900 text-sm flex items-center gap-2 mb-3 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to List
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <h1 className="font-serif text-3xl md:text-4xl text-cereniti-900">{app.full_name}</h1>
            <StatusBadge status={app.status} />
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-cereniti-500">
             <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Applied {new Date(app.created_at).toLocaleDateString()}</span>
             <span className="w-1 h-1 rounded-full bg-cereniti-300" />
             <span className="font-mono text-xs">{app.id.slice(0,8)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="w-full md:w-auto bg-white p-2 rounded-xl border border-cereniti-100 shadow-sm">
          <ApplicationActions 
            id={app.id} 
            status={app.status} 
            email={app.email} 
            name={app.full_name} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COL: DETAILS */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Assessment Results */}
          <div className="bg-white p-8 rounded-xl border border-cereniti-200 shadow-sm relative overflow-hidden">
            <h3 className="font-serif text-xl text-cereniti-900 mb-6 border-b border-cereniti-100 pb-4">Guild Assessment Protocol</h3>
            {assessment ? (
              <div className="space-y-6">
                <div className="flex items-end gap-4">
                  <div className="text-5xl font-serif text-cereniti-900">{assessment.total_score}%</div>
                  <div className={`text-sm font-bold uppercase tracking-wider px-3 py-1.5 rounded mb-1.5 ${assessment.status === 'passed' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {assessment.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  <ScoreRow label="Visual Precision" score={assessment.score_visual} max={2} />
                  <ScoreRow label="Situational Intel" score={assessment.score_situational} max={2} />
                  <ScoreRow label="Integrity & Ethics" score={assessment.score_integrity} max={3} isCritical />
                  <ScoreRow label="Technical Knowledge" score={assessment.score_technical} max={3} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-cereniti-50 rounded-lg border border-dashed border-cereniti-200">
                <p className="text-cereniti-500 mb-2">Assessment pending.</p>
                {app.status === 'pending' && <p className="text-xs text-gold-600 font-bold uppercase tracking-widest">Action Required: Send Invite</p>}
              </div>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-white p-8 rounded-xl border border-cereniti-200 shadow-sm">
            <h3 className="font-serif text-xl text-cereniti-900 mb-6 border-b border-cereniti-100 pb-4 flex items-center gap-2">
               <ShieldCheck className="h-5 w-5 text-gold-600" /> Vetting Profile
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 text-sm">
              <div>
                <dt className="text-cereniti-400 text-xs uppercase tracking-wider mb-1">Email</dt>
                <dd className="font-medium text-cereniti-900">{app.email}</dd>
              </div>
              <div>
                <dt className="text-cereniti-400 text-xs uppercase tracking-wider mb-1">Phone</dt>
                <dd className="font-medium text-cereniti-900">{app.phone}</dd>
              </div>
              <div>
                <dt className="text-cereniti-400 text-xs uppercase tracking-wider mb-1">ID Number</dt>
                <dd className="font-medium text-cereniti-900 font-mono tracking-wide">{app.id_number}</dd>
              </div>
              <div>
                <dt className="text-cereniti-400 text-xs uppercase tracking-wider mb-1">Experience</dt>
                <dd className="font-medium text-cereniti-900">{app.experience_years} Years</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* RIGHT COL: DOCUMENTS */}
        <div className="space-y-6">
          <div className="bg-cereniti-900 text-cereniti-50 p-6 rounded-xl shadow-lg">
            <h3 className="font-serif text-lg mb-2">Digital Dossier</h3>
            <p className="text-xs text-cereniti-400 mb-6 leading-relaxed">
              Secure vault access. Files open in a temporary signed tab.
            </p>
            
            <div className="space-y-4">
              {/* CV BUTTON */}
              {cvLink ? (
                <a href={cvLink} target="_blank" rel="noopener noreferrer" className="group block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all">
                  <div className="flex justify-between items-start mb-2">
                     <FileText className="h-5 w-5 text-cereniti-300 group-hover:text-white transition-colors" />
                     <ExternalLink className="h-4 w-4 text-cereniti-500 group-hover:text-cereniti-300" />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Curriculum Vitae</div>
                  <div className="text-[10px] text-cereniti-400 font-mono">PDF / Image Document</div>
                </a>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Missing File</div>
                  <div className="text-[10px] text-red-300">CV was not uploaded correctly.</div>
                </div>
              )}

              {/* ID BUTTON */}
              {idLink ? (
                <a href={idLink} target="_blank" rel="noopener noreferrer" className="group block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all">
                  <div className="flex justify-between items-start mb-2">
                     <ShieldCheck className="h-5 w-5 text-cereniti-300 group-hover:text-white transition-colors" />
                     <ExternalLink className="h-4 w-4 text-cereniti-500 group-hover:text-cereniti-300" />
                  </div>
                  <div className="text-sm font-medium text-white mb-1">Certified ID</div>
                  <div className="text-[10px] text-cereniti-400 font-mono">Official Identification</div>
                </a>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-1">Missing File</div>
                  <div className="text-[10px] text-red-300">ID was not uploaded correctly.</div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}