"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, DollarSign } from "lucide-react";

interface JobProps {
  id: string;
  zone: string;
  date: string;
  basePay: number;
  bonusPay: number;
  onAccept: (id: string) => void;
}

export function JobCard({ id, zone, date, basePay, bonusPay, onAccept }: JobProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border border-cereniti-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-flex items-center rounded-full bg-cereniti-100 px-2.5 py-0.5 text-xs font-medium text-cereniti-800">
            Broadcasting Now
          </span>
          <h3 className="mt-2 text-xl font-serif text-cereniti-900">{zone}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm text-cereniti-500">Potential Earnings</p>
          <p className="text-lg font-bold text-cereniti-900">R{basePay + bonusPay}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-cereniti-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {date}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Transport from Taxi Rank included
        </div>
      </div>

      <div className="mt-6">
        <Button 
          variant="luxury" 
          className="w-full"
          onClick={() => onAccept(id)}
        >
          Accept Job
        </Button>
      </div>
    </motion.div>
  );
}