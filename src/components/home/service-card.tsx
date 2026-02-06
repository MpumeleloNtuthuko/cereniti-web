"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { ProtectedLink } from "@/components/ui/protected-link"; // Import the new component

interface ServiceCardProps {
  title: string;
  description: string;
  idealFor: string;
  price: string;
  index: number;
}

export function ServiceCard({ title, description, idealFor, price, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between border-l border-cereniti-900/10 bg-white p-8 transition-colors hover:bg-cereniti-50 lg:min-h-[400px]"
    >
      {/* Top Section */}
      <div>
        <span className="font-serif text-4xl text-cereniti-200 group-hover:text-cereniti-300 transition-colors">
          0{index + 1}
        </span>
        <h3 className="mt-6 font-serif text-2xl text-cereniti-900">
          {title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-cereniti-500 max-w-xs">
          {description}
        </p>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-cereniti-100 pt-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-cereniti-400">
              Best For
            </p>
            <p className="mt-1 text-xs font-medium text-cereniti-900">
              {idealFor}
            </p>
          </div>
          
          {/* THE BUTTON WRAPPED IN PROTECTED LINK */}
          <ProtectedLink href="/book">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-cereniti-100 text-cereniti-900 transition-all group-hover:bg-cereniti-900 group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </ProtectedLink>
        </div>
      </div>
    </motion.div>
  );
}