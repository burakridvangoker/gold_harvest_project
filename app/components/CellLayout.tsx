// app/components/CellLayout.tsx
export default function CellLayout({ cellData }) {
  return (
    <div className="border-4 border-dashed border-slate-700 p-8 rounded-xl bg-slate-900 w-full max-w-2xl mx-auto shadow-2xl">
      <div className="flex flex-col gap-6 text-center">
        {/* En Üst: Palet ve Dizme */}
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
           <div className="text-amber-500 font-bold">Palet Bölgesi</div>
           <div className="bg-emerald-900 px-4 py-2 rounded text-sm text-white">Dizme: {cellData.stations.dizme.worker}</div>
        </div>

        {/* Orta: Paketleme ve Makine */}
        <div className="flex flex-col items-center gap-4 py-4 border-y border-slate-700">
           <div className="flex gap-4">
             {cellData.stations.paketleme.workers.map((w, index) => (
               <div key={index} className="bg-blue-900 px-4 py-2 rounded text-sm text-white">Paketleme: {w}</div>
             ))}
           </div>
           <div className="bg-slate-700 p-8 w-64 rounded-full font-bold animate-pulse text-white border-2 border-slate-500">
             {cellData.stations.makine.status === 'running' ? "MAKİNE (ÇALIŞIYOR)" : "MAKİNE (DURDU)"}
           </div>
        </div>

        {/* En Alt: Havuz ve Besleme */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
           <div className="text-sm text-slate-400 mb-1">Havuz & Besleme</div>
           <div className="font-bold text-xl text-white">{cellData.stations.besleme.worker}</div>
        </div>
      </div>
    </div>
  );
}