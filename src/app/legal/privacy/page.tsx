"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock, Eye, FileText, Server, ShieldAlert, Globe, UserCheck, Fingerprint, Scale as ScaleIcon, Sparkles } from "lucide-react";

const SECTIONS = [
  { id: "popia", title: "1. POPIA Compliance", icon: ScaleIcon },
  { id: "collection", title: "2. Data We Collect", icon: FileText },
  { id: "sensitive", title: "3. Special Personal Info", icon: Fingerprint },
  { id: "usage", title: "4. Usage & AI Training", icon: Eye },
  { id: "partners", title: "5. The Experience Ecosystem", icon: Sparkles }, // NEW
  { id: "sharing", title: "6. Operational Sharing", icon: Globe },
  { id: "security", title: "7. Security Architecture", icon: Lock },
  { id: "retention", title: "8. Data Retention", icon: Server },
  { id: "breach", title: "9. Breach Protocols", icon: ShieldAlert },
  { id: "rights", title: "10. User Rights", icon: UserCheck },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState("popia");

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-12">
      
      <div className="mb-16 border-b border-cereniti-200 pb-8">
        <h1 className="font-serif text-4xl md:text-6xl text-cereniti-900">
          Privacy <span className="italic text-olive-600">Protocol.</span>
        </h1>
        <p className="mt-4 text-cereniti-500 max-w-2xl leading-relaxed">
          How Cereniti safeguards the digital and physical privacy of our Members and Specialists. 
          Strict compliance with the Protection of Personal Information Act (POPIA).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- LEFT NAVIGATION --- */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-32 space-y-1">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all",
                  activeSection === section.id 
                    ? "bg-cereniti-900 text-white shadow-lg" 
                    : "text-cereniti-500 hover:bg-cereniti-100 hover:text-cereniti-900"
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="lg:col-span-9 space-y-20">
          
          {/* 1. POPIA */}
          <Section id="popia" title="1. Introduction & POPIA Compliance">
            <p>
              Cereniti (Pty) Ltd operates as a responsible party in terms of the <strong>Protection of Personal Information Act 4 of 2013 (POPIA)</strong>. 
              We recognize that in the luxury home care sector, privacy is the ultimate commodity.
            </p>
            <p className="mt-4">
              Our business model requires us to process highly sensitive data—from gate codes to home interiors. 
              We treat this &quot;Digital Twin&quot; of your home with the same reverence as the physical property.
            </p>
          </Section>

          {/* 2. DATA COLLECTION */}
          <Section id="collection" title="2. Information We Collect">
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 border border-cereniti-200 rounded-xl">
                <h4 className="font-serif text-cereniti-900 mb-2">From Members (Clients)</h4>
                <ul className="list-disc pl-4 text-sm space-y-2 text-cereniti-600">
                  <li><strong>Geo-Spatial Data:</strong> Exact GPS coordinates for our logistics shuttle.</li>
                  <li><strong>Access Tokens:</strong> Gate codes, alarm pins (Stored Encrypted).</li>
                  <li><strong>Visual Data:</strong> Photos of &quot;Before&quot; and &quot;After&quot; states.</li>
                </ul>
              </div>
              <div className="bg-white p-6 border border-cereniti-200 rounded-xl">
                <h4 className="font-serif text-cereniti-900 mb-2">From Specialists (Contractors)</h4>
                <ul className="list-disc pl-4 text-sm space-y-2 text-cereniti-600">
                  <li><strong>Identity Documents:</strong> Certified ID/Passport copies.</li>
                  <li><strong>Criminal Record:</strong> Vetting results.</li>
                  <li><strong>Biometrics:</strong> Facial recognition data.</li>
                </ul>
              </div>
            </div>
          </Section>

          {/* 3. SENSITIVE INFO */}
          <Section id="sensitive" title="3. Processing of Special Personal Information">
            <p>
              Under Section 26 of POPIA, we process &quot;Special Personal Information&quot; strictly for operational necessity, including criminal record checks for all Specialists to ensure the safety of Members&apos; homes.
            </p>
          </Section>

          {/* 4. USAGE & AI */}
          <Section id="usage" title="4. Data Usage & AI Training">
            <p>
              Your data powers the Cereniti Platform. We analyze room counts and condition reports to refine our dynamic pricing engine.
            </p>
            <p className="mt-2 text-sm text-cereniti-500">
              *We use <strong>anonymized</strong> imagery to train our Computer Vision models for quality control. No faces or identifiable documents are used.*
            </p>
          </Section>

          {/* 5. PARTNERS (NEW) */}
          <Section id="partners" title="5. The Experience Ecosystem (Third-Party Partners)">
            <p>
              To facilitate the &quot;Displacement Protocol&quot; (Vouchers/Experiences), limited personal data must be shared with our <strong>Signature Experience Partners</strong> (e.g., Spas, Vineyards, Restaurants).
            </p>
            <div className="bg-olive-50 border-l-4 border-olive-500 p-4 mt-4">
              <p className="text-olive-900 text-sm font-medium">
                <strong>Data Minimization Principle:</strong> We only share the minimum data required to secure your reservation (Name, Booking Reference). We do NOT share your address, financial data, or home security details with these partners.
              </p>
            </div>
            <p className="mt-4">
              By selecting a Perk in the Booking Wizard, you explicitly consent to this limited transfer of data to the chosen Partner for the purpose of service fulfillment.
            </p>
          </Section>

          {/* 6. SHARING */}
          <Section id="sharing" title="6. Operational Sharing">
            <p>We do not sell data. We share data only when operationally critical:</p>
            <ul className="list-disc pl-5 space-y-2 mt-4 text-cereniti-600">
              <li>
                <strong>Estate Security:</strong> We share Specialist identities with Estate Management (e.g., Val de Vie HOA) for access control.
              </li>
              <li>
                <strong>Law Enforcement:</strong> If a crime occurs on site, we cooperate fully with SAPS.
              </li>
            </ul>
          </Section>

          {/* 7. SECURITY */}
          <Section id="security" title="7. Security Architecture">
            <p>
              We utilize a &quot;Zero-Knowledge&quot; architecture for Access Codes. Alarm codes are decrypted and revealed to the Specialist app <strong>only</strong> when geo-fenced within 100m of the property.
            </p>
          </Section>

          {/* 8. RETENTION */}
          <Section id="retention" title="8. Data Retention & Destruction">
            <p>
              Member Profiles are retained for the lifetime of the account + 3 years. Access Codes are retained only for active bookings.
            </p>
          </Section>

          {/* 9. BREACH */}
          <Section id="breach" title="9. Data Breach Protocol">
            <p>
              In the unlikely event of a data compromise, we will notify the <strong>Information Regulator</strong> and affected Data Subjects as per POPIA requirements.
            </p>
          </Section>

          {/* 10. RIGHTS */}
          <Section id="rights" title="10. Your Rights">
            <p>
              You have the right to access, correct, or request deletion of your personal data. 
              Contact our Information Officer at <strong>privacy@cereniti.co.za</strong>.
            </p>
          </Section>

        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENT ---
function Section({ id, title, children }: { id: string, title: string, children: React.ReactNode }) {
  return (
    <motion.section 
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className="scroll-mt-40"
    >
      <h3 className="font-serif text-2xl text-cereniti-900 border-b border-cereniti-200 pb-4 mb-6 flex items-center gap-3">
        {title}
      </h3>
      <div className="text-cereniti-600 leading-7 space-y-4 text-justify">
        {children}
      </div>
    </motion.section>
  );
}