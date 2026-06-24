// @ts-nocheck
"use client";
import { useState } from "react";

export default function ControlTower() {
  // Fabrikadaki personel havuzu (Başlangıçta hepsi havuzda)
  const [workers, setWorkers] = useState([
    { id: 1, name: "Ahmet", station: "Havuz" },
    { id: 2, name: "Mehmet", station: "Havuz" },
    { id: 3, name: "Ayşe", station: "Havuz" },
    { id: 4, name: "Fatma", station: "Havuz" },
  ]);

  const stations = ["Kaju Hattı", "Çekirdek Hattı", "Badem Hattı", "Havuz"];

  const moveWorker = (workerId, newStation) => {
    setWorkers(workers.map(w => 
      w.id === workerId ? { ...w, station: newStation } : w
    ));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-8 border-b border-slate-800 pb-4">Kontrol Kulesi - Dinamik Görevlendirme</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stations.map(station => (
          <div key={station} className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[400px]">
            <h3 className="font-bold text-amber-500 mb-4 uppercase text-sm tracking-wider">{station}</h3>
            
            <div className="space-y-3">
              {workers.filter(w => w.station === station).map(worker => (
                <div key={worker.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700 shadow-sm flex flex-col gap-2">
                  <span className="font-semibold">{worker.name}</span>
                  
                  {/* Görevlendirme Butonları */}
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {stations.map(s => (
                      <button 
                        key={s}
                        onClick={() => moveWorker(worker.id, s)}
                        className={`text-[10px] py-1 px-1 rounded transition-colors ${
                          station === s ? 'bg-slate-600 cursor-default' : 'bg-amber-600 hover:bg-amber-500 text-white'
                        }`}
                        disabled={station === s}
                      >
                        {s.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}