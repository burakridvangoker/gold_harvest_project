// @ts-nocheck
"use client";
import { useState, useEffect, useRef } from "react";

export default function GoldHarvestFinalVercel() {
  const [activeFacility, setActiveFacility] = useState("MERKEZ");
  const [globalPool, setGlobalPool] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showHRModal, setShowHRModal] = useState(false);
  const [simState, setSimState] = useState("normal"); 

  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
  const totalHours = 168; 
  const hourWidth = 145; 

  const getClock = (index) => {
    const h = (index + 7) % 24;
    return `${h.toString().padStart(2, '0')}:00`;
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // --- ZENGİN VERİ ÜRETİCİSİ ---
  const generateShifts = (pattern) => {
    let tasks = [];
    for (let d = 0; d < 7; d++) {
      const dayOffset = d * 24;
      const isWeekend = d >= 5; 
      
      if (pattern === "merkez-paketleme-1") {
        tasks.push({ id: `mp1-1-${d}`, startHour: dayOffset, duration: 8, order: "Çekirdek - Batch A", workers: "Opt-1, Bes-1, Pak-2", type: "standard" });
        tasks.push({ id: `mp1-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "Çekirdek - Batch B", workers: "Opt-2, Bes-2, Pak-3", type: "standard" });
        if (!isWeekend) tasks.push({ id: `mp1-3-${d}`, startHour: dayOffset + 16, duration: 8, order: "Fıstık - İhracat", workers: "Opt-3, Bes-3, Pak-6", type: "export" });
      } 
      else if (pattern === "merkez-paketleme-2") {
        tasks.push({ id: `mp2-1-${d}`, startHour: dayOffset, duration: 8, order: "Granola Mix", workers: "Opt-4, Bes-4, Pak-7", type: "special" });
        tasks.push({ id: `mp2-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "Kaju Lüks", workers: "Opt-5, Bes-5, Pak-8", type: "special" });
      }
      else if (pattern === "merkez-kavurma") {
        tasks.push({ id: `mk-1-${d}`, startHour: dayOffset, duration: 8, order: "Fındık Kavurma", workers: "Opt-7, Bes-7", type: "heavy" });
        tasks.push({ id: `mk-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "Kaju Kavurma", workers: "Opt-8, Bes-8", type: "heavy" });
      }
      else if (pattern === "sok-cips") {
        tasks.push({ id: `sc-1-${d}`, startHour: dayOffset, duration: 8, order: "ŞOK Cips Fırın", workers: "Opt-10, Bes-10", type: "critical" });
        tasks.push({ id: `sc-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "ŞOK Cips Fırın", workers: "Opt-11, Bes-11", type: "critical" });
      }
      else if (pattern === "sok-aroma") {
         tasks.push({ id: `sa-1-${d}`, startHour: dayOffset, duration: 8, order: "Peynir & Soğan", workers: "Usta-1, Bes-13", type: "flavor" });
         tasks.push({ id: `sa-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "Peynir & Soğan", workers: "Usta-2, Bes-14", type: "flavor" });
      }
      else if (pattern === "sok-paketleme") {
        tasks.push({ id: `sp-1-${d}`, startHour: dayOffset, duration: 8, order: "Aktüel Paket A", workers: "Opt-9, Pak-15", type: "standard" });
        tasks.push({ id: `sp-2-${d}`, startHour: dayOffset + 8, duration: 8, order: "Aktüel Paket B", workers: "Opt-9, Pak-16", type: "standard" });
      }
    }
    return tasks;
  };

  const getTaskStyle = (type) => {
    switch(type) {
      case "standard": return "bg-white border-slate-200 border-l-4 border-l-indigo-500 text-slate-700 shadow-sm";
      case "export": return "bg-indigo-50 border-indigo-200 border-l-4 border-l-blue-600 text-indigo-800 shadow-sm";
      case "special": return "bg-teal-50 border-teal-200 border-l-4 border-l-teal-500 text-teal-800 shadow-sm";
      case "heavy": return "bg-amber-50 border-amber-200 border-l-4 border-l-amber-500 text-amber-800 shadow-sm";
      case "critical": return "bg-rose-50 border-rose-200 border-l-4 border-l-rose-500 text-rose-800 shadow-sm";
      case "flavor": return "bg-orange-50 border-orange-200 border-l-4 border-l-orange-500 text-orange-800 shadow-sm";
      case "error": return "bg-red-50 border-red-300 border-l-4 border-l-red-600 text-red-800 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]";
      case "warning": return "bg-yellow-50 border-yellow-300 border-l-4 border-l-yellow-500 text-yellow-800 animate-pulse border-dashed border-2";
      case "success": return "bg-emerald-50 border-emerald-300 border-l-4 border-l-emerald-500 text-emerald-800";
      case "starvation": return "bg-slate-100 border-slate-300 border-l-4 border-l-slate-400 text-slate-500 opacity-80 border-dashed border-2";
      case "resolved": return "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 border-l-4 border-l-emerald-500 text-emerald-900 shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400";
      default: return "bg-white border-slate-200";
    }
  };

  const [scheduleData, setScheduleData] = useState([
    { facility: "MERKEZ", id: "M-P-1", name: "Paketleme Hattı 1", tasks: generateShifts("merkez-paketleme-1") },
    { facility: "MERKEZ", id: "M-P-2", name: "Paketleme Hattı 2", tasks: generateShifts("merkez-paketleme-2") },
    { facility: "MERKEZ", id: "M-K-1", name: "Kavurma İstasyonu", tasks: generateShifts("merkez-kavurma") },
    
    { facility: "ŞOK", id: "S-C-1", name: "Cips Fırın Hattı", tasks: generateShifts("sok-cips") },
    { facility: "ŞOK", id: "S-A-1", name: "Aroma Bandı", tasks: generateShifts("sok-aroma") },
    { facility: "ŞOK", id: "S-P-1", name: "Aktüel Paketleme", tasks: generateShifts("sok-paketleme") },
  ]);

  // --- KOMPLEKS FABRİKA KRİZİ (3 FARKLI SENARYO AYNI ANDA) ---
  const triggerCrisis = () => {
    setSimState("crisis");
    
    // HAVUZA DÜŞENLER: ŞOK'tan 4 kişi (Fırın ve Aroma), Merkez'den 2 kişi (Erken biten iş) = Toplam 6 kişi
    setGlobalPool(["Opt-11 (Fırın)", "Bes-11", "Usta-2 (Aroma)", "Bes-14", "Opt-8 (Kavurma)", "Bes-8"]);
    
    setScheduleData(prev => prev.map(row => {
      // SENARYO 1: ŞOK Fırın Bozulur, Aroma Bandı Beklemeye (Starvation) Geçer
      if (row.id === "S-C-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "🔥 MOTOR YANDI", workers: "HAT DURDU", type: "error" } : t) };
      }
      if (row.id === "S-A-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "⚠️ MAL BEKLİYOR", workers: "PERSONEL HAVUZDA", type: "starvation" } : t) };
      }

      // SENARYO 2: Merkez Paketlemede Devamsızlık (İşe Gelmeyen Eleman)
      if (row.id === "M-P-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "⚠️ EKSİK PERSONEL", workers: "Bes-2, Pak-3 (Opt-2 YOK)", type: "warning" } : t) };
      }

      // SENARYO 3: Merkez Kavurma İşi Erken Biter
      if (row.id === "M-K-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "✅ SİPARİŞ ERKEN BİTTİ", workers: "PERSONEL HAVUZDA", type: "success" } : t) };
      }
      
      return row;
    }));

    showNotification("🚨 SİSTEM ALARMI: 3 Farklı Olay Tespit Edildi! (Arıza, Devamsızlık, Erken Tamamlanma). 6 Personel Havuzda.", "error");
  };

  // --- AI CROSS-ROUTING (AKILLI DAĞITIM) ---
  const triggerOptimization = () => {
    if (simState !== "crisis") return showNotification("Sistem şu an optimum. Atanacak kriz yok.", "info");

    setSimState("resolved");
    setGlobalPool([]); // Havuz tamamen boşaltıldı

    setScheduleData(prev => prev.map(row => {
      // ÇÖZÜM 1: Eksik elemanlı M-P-1 hattına, havuzdan 1 kavurmacı yollanır
      if (row.id === "M-P-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "⚡ EKSİK GİDERİLDİ", workers: "Bes-2, Pak-3 + [Opt-8]", type: "resolved" } : t) };
      }
      // ÇÖZÜM 2: Kalan 5 kişi toplanıp, geride kalan ŞOK Paketlemeye "Turbo" destek atılır
      if (row.id === "S-P-1") {
        return { ...row, tasks: row.tasks.map(t => t.startHour === 8 ? { ...t, order: "⚡ TURBO AKTÜEL", workers: "Opt-9, Pak-16 + [Kalan 5 Kişi]", type: "resolved" } : t) };
      }
      return row;
    }));

    showNotification("✅ AI OPTİMİZASYONU: Havuzdaki personeller tesisler arası (Cross-Routing) dağıtılarak tüm darboğazlar çözüldü!");
  };

  const filteredData = scheduleData.filter(d => d.facility === activeFacility);

  return (
    <div className="h-screen bg-[#f4f7fb] text-slate-800 font-sans flex flex-col overflow-hidden selection:bg-indigo-200 relative">
      
      {/* PREMIUM HEADER */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm z-40 flex-shrink-0">
        <div className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white px-3 py-1.5 rounded-lg text-sm shadow-md">GH</span>
              Master Production Schedule
            </h1>
            <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-widest opacity-80">Dinamik Kaynak & Kriz Optimizasyonu</p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={triggerCrisis} disabled={simState !== "normal"} className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-sm flex items-center gap-2 ${simState === "normal" ? "bg-white hover:bg-red-50 text-red-600 border border-red-200 ring-1 ring-transparent hover:ring-red-100" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"}`}>
              <span className="text-sm">🔥</span> Kompleks Senaryo Yarat
            </button>
            <button onClick={triggerOptimization} disabled={simState !== "crisis"} className={`px-5 py-2.5 rounded-lg text-xs font-black transition-all shadow-md flex items-center gap-2 ${simState === "crisis" ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white hover:shadow-lg hover:-translate-y-0.5" : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-70"}`}>
              <span className="text-sm">⚙️</span> AI Çöz ve Ata
            </button>
            <div className="w-px h-8 bg-slate-200 self-center mx-1"></div>
            <button onClick={() => setShowHRModal(true)} className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              <span className="text-sm">📊</span> İK Raporu
            </button>
          </div>

          <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            {["MERKEZ", "ŞOK"].map(fac => (
              <button 
                key={fac} onClick={() => setActiveFacility(fac)}
                className={`px-8 py-2 rounded-lg font-black text-xs transition-all duration-300 ${activeFacility === fac ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
              >
                {fac} FABRİKA
              </button>
            ))}
          </div>
        </div>

        {/* GLOBAL HAVUZ */}
        <div className="bg-indigo-50/50 px-8 py-2.5 border-t border-slate-200 flex items-center gap-4">
          <span className="text-[10px] font-black text-indigo-900/60 uppercase tracking-widest border-r border-indigo-200 pr-4">Bekleme Havuzu</span>
          <div className="flex gap-2">
            {globalPool.length === 0 ? (
              <span className="text-[11px] text-slate-500 font-bold italic">Sistem optimum kapasitede. Müdahale gerekmiyor.</span>
            ) : (
              globalPool.map((w, i) => (
                <span key={i} className="bg-white border border-amber-300 text-amber-800 px-3 py-1 rounded-md text-[11px] font-black flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> {w}
                </span>
              ))
            )}
          </div>
        </div>
      </header>

      {/* GANTT ÇİZELGESİ ANA GÖVDE */}
      <div className="flex-1 overflow-auto custom-scrollbar relative w-full z-10">
        <div className="min-w-max flex flex-col">
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200 flex shadow-sm">
            <div className="w-72 flex-shrink-0 bg-slate-50 border-r border-slate-200 p-5 sticky left-0 z-40 flex items-end shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
              <span className="font-black text-[10px] text-slate-400 tracking-widest uppercase">Tesis & İstasyon</span>
            </div>
            <div className="flex flex-col">
              <div className="flex border-b border-slate-100">
                {days.map(day => (
                  <div key={day} className="flex-shrink-0 bg-white font-black text-xs text-slate-800 tracking-widest uppercase py-3 text-center border-r border-slate-100" style={{ width: `${24 * hourWidth}px` }}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex relative" style={{ width: `${totalHours * hourWidth}px` }}>
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div key={i} className="w-[145px] flex-shrink-0 border-r border-slate-100 p-2 flex flex-col justify-center bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-400">{getClock(i)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 pb-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed opacity-95">
            {filteredData.map((row) => (
              <div key={row.id} className="flex border-b border-slate-200/60 hover:bg-white/50 transition-colors group">
                <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-white p-5 sticky left-0 z-20 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-center">
                  <span className="font-black text-slate-900 text-sm tracking-tight">{row.id}</span>
                  <span className="text-[11px] text-slate-500 font-bold mt-1 opacity-80">{row.name}</span>
                </div>
                <div className="relative flex-shrink-0" style={{ width: `${totalHours * hourWidth}px`, height: '88px' }}>
                  <div className="absolute inset-0 flex pointer-events-none">
                    {Array.from({ length: totalHours }).map((_, i) => (
                      <div key={i} className={`w-[145px] border-r h-full ${i % 24 === 23 ? 'border-slate-300/80 bg-slate-200/20' : 'border-slate-100/50'}`}></div>
                    ))}
                  </div>
                  {row.tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`absolute top-2.5 bottom-2.5 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden transition-all duration-500 cursor-default ${getTaskStyle(task.type)}`}
                      style={{ left: `${task.startHour * hourWidth}px`, width: `${(task.duration * hourWidth) - 6}px`, marginLeft: '3px' }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">İş Emri</span>
                        <span className="text-[10px] font-black bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border border-black/5 truncate max-w-[130px]">{task.order}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate mt-1">
                        <span className="text-xs opacity-70">👤</span>
                        <span className="text-[11px] font-bold truncate tracking-wide">{task.workers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* İK MODALI */}
      {showHRModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center animate-in fade-in zoom-in duration-300">
          <div className="bg-white/95 backdrop-blur-md w-[650px] rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col ring-1 ring-slate-900/5">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex justify-between items-center">
              <div>
                <h2 className="text-white font-black tracking-widest uppercase flex items-center gap-2 text-lg">
                  <span className="bg-indigo-500 text-white px-2 py-0.5 rounded text-xs">GH</span> Yönetim Paneli
                </h2>
                <p className="text-slate-400 text-[10px] font-mono mt-1">KAPASİTE & İNSAN KAYNAKLARI RAPORU</p>
              </div>
              <button onClick={() => setShowHRModal(false)} className="text-slate-400 hover:text-white font-black text-2xl transition-colors cursor-pointer">&times;</button>
            </div>
            
            <div className="p-8 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
                  <span className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">Sistem OEE</span>
                  <span className="text-4xl font-black text-slate-800">%94.2</span>
                  <span className="text-emerald-500 text-[10px] font-bold mt-1">Sistem İyileşmesi Sağlandı</span>
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-5 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-400"></div>
                  <span className="text-slate-400 text-xs font-black uppercase mb-1 tracking-widest">Darboğaz Hattı</span>
                  <span className="text-2xl font-black text-red-600 mt-1">S-P-1 (Paketleme)</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                <h3 className="font-black text-slate-800 text-sm mb-2 uppercase tracking-wide">Yapay Zeka Çoklu Vaka Analizi</h3>
                <ul className="text-xs text-slate-600 leading-relaxed font-medium space-y-2">
                  <li><strong>• Devamsızlık Yönetimi:</strong> Merkez M-P-1 hattındaki devamsızlık (Opt-2) AI tarafından Merkez havuzundan anında tolere edilmiştir.</li>
                  <li><strong>• Atıl Kapasite Değerlendirmesi:</strong> ŞOK Fabrikasındaki arıza kaynaklı atıl kapasite (Starvation) başarıyla diğer hatlara kaydırılarak (Cross-Routing) üretim kaybı önlenmiştir.</li>
                  <li><strong>• Uyarı:</strong> S-P-1 numaralı hatta kronik kapasite aşımı gözlenmektedir. Dış personel takviyesine bağımlılık artmıştır.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 shadow-sm">
                <h3 className="font-black text-indigo-900 text-sm mb-3 flex items-center gap-2 uppercase tracking-wide">
                  <span>⚡</span> Otomatik Norm Kadro Talebi
                </h3>
                <ul className="text-sm text-indigo-800 font-bold flex flex-col gap-2">
                  <li className="flex justify-between border-b border-indigo-100/50 pb-1"><span>Pozisyon:</span> <span className="text-indigo-900">Paketleme Operatörü</span></li>
                  <li className="flex justify-between border-b border-indigo-100/50 pb-1"><span>Lokasyon:</span> <span className="text-indigo-900">ŞOK Tesisi</span></li>
                  <li className="flex justify-between border-b border-indigo-100/50 pb-1"><span>Talep Edilen:</span> <span className="text-indigo-900">2 Personel</span></li>
                  <li className="flex justify-between pt-1"><span>Öngörülen Tasarruf:</span> <span className="text-emerald-600">45.000 TL / Ay</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-4">
              <button onClick={() => setShowHRModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Vazgeç</button>
              <button onClick={() => { showNotification("İlan ERP üzerinden kariyer portallarına açıldı.", "success"); setShowHRModal(false); }} className="px-8 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-black rounded-lg shadow-lg hover:shadow-xl transition-all">
                İlanı Yayımla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST BİLDİRİMİ */}
      {notification && (
        <div className="absolute bottom-8 right-8 z-[99999] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="px-6 py-4 rounded-xl shadow-2xl max-w-md bg-slate-900 border border-slate-700 text-white flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full animate-ping ${notification.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <p className="text-sm font-bold leading-relaxed">{notification.message}</p>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 6px; border: 3px solid #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}