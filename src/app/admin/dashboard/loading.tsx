export default function Loading() {
  return (
    <div className="p-4 lg:p-12 space-y-10">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-10 w-56 bg-cereniti-200 rounded animate-pulse" />
          <div className="h-4 w-32 bg-cereniti-100 rounded animate-pulse" />
        </div>
        <div className="h-8 w-24 bg-white rounded-full border border-cereniti-200 animate-pulse" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-cereniti-200 h-32 animate-pulse flex flex-col justify-between">
             <div className="flex justify-between">
                <div className="h-3 w-20 bg-cereniti-100 rounded" />
                <div className="h-8 w-8 bg-cereniti-100 rounded" />
             </div>
             <div className="h-8 w-32 bg-cereniti-200 rounded" />
          </div>
        ))}
      </div>

      {/* Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white border border-cereniti-200 rounded-xl h-96 animate-pulse">
            <div className="h-14 border-b border-cereniti-100 bg-cereniti-50/50" />
            <div className="p-4 space-y-4">
              <div className="h-16 bg-cereniti-50 rounded" />
              <div className="h-16 bg-cereniti-50 rounded" />
              <div className="h-16 bg-cereniti-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}