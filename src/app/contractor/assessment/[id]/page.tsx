import { AssessmentWizard } from "@/components/contractor/assessment-wizard";
import { createClient } from "@/lib/supabase/server";

// Next.js 15: params is a Promise
export default async function AssessmentPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. Await the params to get the ID
  const { id } = await params;
  
  const supabase = await createClient();
  
  // 2. Validate Application ID in Database
  // We check if this UUID actually exists in the applications table
  const { data: app, error } = await supabase
    .from("contractor_applications")
    .select("id, status, full_name")
    .eq("id", id)
    .single();

  if (error || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cereniti-50">
        <div className="text-center p-8 bg-white rounded-xl border border-red-200">
          <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Access Link</h1>
          <p className="text-cereniti-600">The assessment link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  // 3. Check if already taken
  const { data: existing } = await supabase
    .from("contractor_assessments")
    .select("status")
    .eq("application_id", id)
    .single();

  if (existing) {
    return (
      <div className="min-h-screen bg-cereniti-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md bg-white p-12 rounded-xl shadow-sm border border-cereniti-200">
          <h1 className="font-serif text-2xl mb-4 text-cereniti-900">Assessment Submitted</h1>
          <p className="text-cereniti-600">
            You have already completed this evaluation. Our team is currently reviewing your results.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cereniti-50">
      <div className="container mx-auto px-6 py-24 lg:py-32">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-cereniti-500">
            Specialist Vetting
          </span>
          <h1 className="mt-4 font-serif text-3xl md:text-4xl text-cereniti-900">
            Welcome, {app.full_name}.
          </h1>
          <p className="mt-2 text-cereniti-500 text-sm">
            Phase 1: Protocol & Ethics Evaluation
          </p>
        </div>

        <AssessmentWizard applicationId={id} />
      </div>
    </main>
  );
}