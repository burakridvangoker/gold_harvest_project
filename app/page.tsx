// @ts-nocheck
"use client";
import { useState } from "react";

export default function Home() {
  const [kaju, setKaju] = useState(50);
  const [cekirdek, setCekirdek] = useState(100);
  const [badem, setBadem] = useState(30);
  const [isci, setIsci] = useState(40);
  
  const [sonuc, setSonuc] = useState(null);
  const [loading, setLoading] = useState(false);

  const hesapla = async () => {
    setLoading(true);
    // Yolu güncelledik (api/optimize -> /api/optimize)
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kaju, cekirdek, badem, isci })
    });
    const data = await res.json();
    setSonuc(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 p-4 md:p-8 font-sans selection:bg-amber-500/30">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Üst Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Üretim Kontrol Merkezi</h1>
            <p className="text-slate-500 mt-1">Dinamik Kaynak ve İş Emri Yönlendirme Sistemi (v2.0)</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-slate-400">Sistem Aktif</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sol Panel: Sipariş Girişleri */}
          <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              İş Emirleri (Günlük)
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-400">Kaju Siparişi</label>
                  <span className="text-sm font-bold text-amber-500">{kaju} Palet</span>
                </div>
                <input type="range" min="0" max="200" value={kaju} onChange={(e)=>setKaju(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-400">Çekirdek Siparişi</label>
                  <span className="text-sm font-bold text-amber-500">{cekirdek} Palet</span>
                </div>
                <input type="range" min="0" max="300" value={cekirdek} onChange={(e)=>setCekirdek(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-400">Badem Siparişi</label>
                  <span className="text-sm font-bold text-amber-500">{badem} Palet</span>
                </div>
                <input type="range" min="0" max="150" value={badem} onChange={(e)=>setBadem(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-slate-400">Sahadaki Mevcut Operatör</label>
                  <span className="text-sm font-bold text-white">{isci} Kişi</span>
                </div>
                <input type="range" min="10" max="100" value={isci} onChange={(e)=>setIsci(Number(e.target.value))} className="w-full accent-slate-500" />
              </div>

              <button 
                onClick={hesapla} 
                disabled={loading} 
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-50"
              >
                {loading ? "Sistem Çözümleniyor..." : "Üretim Planını Oluştur"}
              </button>
            </div>
          </div>

          {/* Sağ Panel: Operasyonel Sonuçlar ve Gantt/Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* KPI Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Toplam Operasyon Süresi</p>
                <p className="text-3xl font-light text-white">{sonuc ? sonuc.toplam_saat : "--"} <span className="text-base text-slate-500">Saat</span></p>
              </div>
              <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Tahmini Bitiş</p>
                <p className="text-3xl font-light text-white">{sonuc ? `${(8 + sonuc.toplam_saat).toString().padStart(2, '0')}:00` : "--:--"}</p>
              </div>
              <div className={`p-5 rounded-xl border ${sonuc && sonuc.mesai_saati > 0 ? 'bg-red-950/20 border-red-900/50' : 'bg-slate-900 border-slate-800'}`}>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Ekstra Mesai İhtiyacı</p>
                <p className={`text-3xl font-light ${sonuc && sonuc.mesai_saati > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                  {sonuc ? sonuc.mesai_saati : "--"} <span className="text-base">Saat</span>
                </p>
              </div>
            </div>

            {/* Dinamik Zaman Çizelgesi (Timeline) */}
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 shadow-xl min-h-[300px]">
              <h2 className="text-lg font-semibold text-white mb-6">Operatör Yönlendirme Çizelgesi</h2>
              
              {!sonuc ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3 pt-10">
                  <svg className="w-12 h-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <p>Siparişleri girin ve üretim planını oluşturun.</p>
                </div>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                  {sonuc.cizelge.map((adim, index) => (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 bg-amber-500 text-black shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-800/50 shadow-md">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-sm text-amber-500 font-medium">{adim.saat}</span>
                        </div>
                        <div className="text-slate-300">{adim.olay}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {sonuc && sonuc.mesai_saati > 0 && (
                <div className="mt-8 p-4 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start space-x-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div>
                    <h4 className="text-red-400 font-semibold">Kritik Uyarı: Kapasite Aşımı</h4>
                    <p className="text-sm text-slate-400 mt-1">Siparişleri mevcut kadro ile tamamlamak için {sonuc.mesai_saati} saatlik fazla mesai veya ekstra {Math.ceil(sonuc.mesai_saati * 2)} yevmiyeli işçi desteği gerekmektedir.</p>
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}