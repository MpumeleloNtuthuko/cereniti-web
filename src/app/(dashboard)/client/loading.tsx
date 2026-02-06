import { Skeleton } from "@/components/ui/skeleton"; // You'll need a simple skeleton component

export default function Loading() {
  return (
    <div className="max-w-5xl space-y-10 p-6">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
           <Skeleton className="h-8 w-48 bg-cereniti-100" />
           <Skeleton className="h-4 w-32 bg-cereniti-50" />
        </div>
        <Skeleton className="h-12 w-32 rounded-none" />
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
      <div className="space-y-4">
         <Skeleton className="h-20 w-full" />
         <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}