import { createClient } from "@/lib/supabase/server";
import { ServiceCard } from "./service-card";
import { Service } from "@/types/database";

// This is now an ASYNC component (Server Component)
export async function ServicesSection() {
  const supabase = await createClient();

  // Fetch data directly from DB, ordered by display_order
  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Supabase Error:", error);
    // In production, you might want to render a fallback UI here
    return null; 
  }

  return (
    <section className="relative z-20 bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-20 grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-serif text-5xl text-cereniti-900 md:text-6xl">
              The Curated <br />
              <span className="italic text-cereniti-500">Rituals.</span>
            </h2>
          </div>
          <div className="flex flex-col justify-end lg:col-span-7">
            <p className="max-w-md text-cereniti-600 font-sans text-lg">
              We do not sell hours; we sell outcomes. Each service is a standardized protocol designed to return your home to a state of neutral calm.
            </p>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 border-t border-r border-b border-cereniti-900/10 md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service: Service, index: number) => (
            <ServiceCard 
              key={service.id}
              // Map DB columns to Component props (snake_case to camelCase if needed)
              title={service.title}
              description={service.description}
              idealFor={service.ideal_for}
              price={service.price_label}
              index={index}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-xs uppercase tracking-widest text-cereniti-400">
                Inventory & Equipment Included in all rituals
            </p>
        </div>

      </div>
    </section>
  );
}