// @ts-nocheck
"use client";
import { useState } from "react";

export default function FactoryMap() {
  const [activeTab, setActiveTab] = useState("Merkez");
  const [factories, setFactories] = useState({
    Merkez: [
      { id: "M1", name: "Kaju Hattı", status: "online", operator: "Ahmet" },
      { id: "M2", name: "Çekirdek Fırını", status: "fault", operator: "Yok" },
      { id: "M3", name: "Paketleme A", status: "online", operator: "Ayşe" },
    ],
    Sok: [
      { id: "S1", name: "Badem Hattı", status: "online", operator: "Fatma" },
      { id: "S2", name: "Otomatik Tartım", status: "online", operator: "Mehmet" },
    ]
  });

  const handleIntervention = (factory, machineId) => {
    // Burada basit bir "Müdahale" mantığı kurgulayacağız.
    alert(`Müdahale: ${machineId} numaralı makineye yönlendiriliyorsunuz.`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
           Fabrika Haritası <span className="text-slate-500 text-sm font-normal">| Kontrol Kulesi</span>
        </h1>

        {/* Tab Sistemi */}
        <div className="flex gap-4 mb-6">
          {["Merkez", "Sok"].map((f) => (
            <button key={f} onClick={() => setActiveTab(f)} className={`px-6 py-2 rounded-lg font-bold ${activeTab === f ? 'bg-amber-600' : 'bg-slate-800'}`}>
              {f} Fabrika
            </button>
          ))}
        </div>

        {/* Harita / Grid Görünümü */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {factories[activeTab].map((m) => (
            <div key={m.id} className={`p-4 rounded-xl border-2 ${m.status === 'fault' ? 'border-red-500 bg-red-950/20' : 'border-slate-800 bg-slate-900'}`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{m.name}</h3>
                <span className={`text-xs px-2 py-1 rounded ${m.status === 'fault' ? 'bg-red-500' : 'bg-green-500'}`}>{m.status}</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">Operatör: <span className="text-white font-mono">{m.operator}</span></p>
              
              <button 
                onClick={() => handleIntervention(activeTab, m.id)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition"
              >
                Müdahale Et
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}