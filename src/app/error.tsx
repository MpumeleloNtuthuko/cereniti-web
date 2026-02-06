"use client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-cereniti-50 text-center p-6">
      <h2 className="font-serif text-3xl text-cereniti-900 mb-4">A temporary disturbance.</h2>
      <p className="text-cereniti-500 mb-8 max-w-md">
        Our digital concierge encountered an issue. We have been notified.
      </p>
      <Button onClick={() => reset()} className="bg-cereniti-900 text-white hover:bg-gold-600">
        Refresh Connection
      </Button>
    </div>
  );
}