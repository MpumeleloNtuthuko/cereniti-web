"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { DayManager } from "./day-manager"; 
import { Lock } from "lucide-react";

interface AvailabilityManagerProps {
  allBlocks: any[];
}

export function AvailabilityManager({ allBlocks }: AvailabilityManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Helper: Get YYYY-MM-DD in local time
  const getLocalISODate = (d: Date) => {
    return d.toLocaleDateString('en-CA'); 
  };

  // Filter blocks for the selected day to pass to the modal
  const activeBlocks = selectedDate 
    ? allBlocks.filter(b => b.date === getLocalISODate(selectedDate)) 
    : [];

  // Create array of Dates for the calendar modifiers (visual red blocks)
  // We map the string dates back to Date objects for DayPicker
  const blockedDatesForCalendar = allBlocks.map(b => new Date(b.date));

  return (
    <div className="bg-white p-8 rounded-xl border border-cereniti-200 shadow-sm flex flex-col md:flex-row gap-12 items-start">
      
      {/* 1. CALENDAR UI */}
      <div className="p-4 border border-cereniti-100 rounded-xl bg-cereniti-50/50">
        <DayPicker
          mode="default"
          selected={selectedDate || undefined}
          onDayClick={setSelectedDate}
          disabled={{ before: new Date() }} // Can't edit past
          modifiers={{
            blocked: blockedDatesForCalendar
          }}
          modifiersStyles={{
            blocked: { 
              backgroundColor: "#7f1d1d", // Red-900
              color: "white", 
              fontWeight: "bold"
            }
          }}
          styles={{
            head_cell: { width: "50px", color: "#8C8680" },
            cell: { width: "50px", height: "50px" },
            day: { fontSize: "1rem", borderRadius: "10px" },
          }}
        />
      </div>

      {/* 2. INSTRUCTIONS */}
      <div className="flex-1 space-y-6">
        <div>
          <h2 className="font-serif text-2xl text-cereniti-900">Availability Protocol</h2>
          <p className="text-cereniti-500 text-sm mt-2 leading-relaxed">
            Select a date on the calendar to manage specific time blocks.
            <br/><br/>
            <span className="flex items-center gap-2 font-bold text-red-900">
               <span className="w-3 h-3 bg-red-900 rounded-full" /> Blocked / Partial Block
            </span>
            <span className="flex items-center gap-2 text-cereniti-600 mt-1">
               <span className="w-3 h-3 border border-cereniti-300 rounded-full" /> Available
            </span>
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
            Live Synchronization
          </p>
          <p className="text-xs text-amber-700">
            Adding a block here immediately removes those time slots from the Client Booking Engine.
          </p>
        </div>
      </div>

      {/* 3. MODAL (Day Manager) */}
      {selectedDate && (
        <DayManager 
           date={selectedDate} 
           blocks={activeBlocks} 
           onClose={() => setSelectedDate(null)} 
        />
      )}

    </div>
  );
}