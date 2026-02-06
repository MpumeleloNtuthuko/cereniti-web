import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="bg-cereniti-50 min-h-screen">
      <Navbar user={user} />
      <div className="pt-32 pb-24">
        {children}
      </div>
      <Footer />
    </div>
  );
}