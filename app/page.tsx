"use client";
import { useState } from "react";

export default function Home() {
  const [isci, setIsci] = useState(50);
  const [merkez, setMerkez] = useState(20);
  const [sok, setSok] = useState(15);
  const [sonuc, setSonuc] = useState(null);
  const [loading, setLoading] = useState(false);

  const optimizeEt = async () => {
    setLoading(true);
    const res = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toplam_isci: isci, merkez_hedef: merkez, sok_hedef: sok })
    });
    const data = await res.json();
    setSonuc(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-amber-500 border-b border-gray-800 pb-4">Gold Harvest YZ Çizelgeleme Ekranı</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Saha Parametreleri</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Mevcut Dinamik İşçi Havuzu ({isci} Kişi)</label>
                <input type="range" min="20" max="80" value={isci} onChange={(e)=>setIsci(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Merkez Fabrika Hedefi ({merkez} Ton)</label>
                <input type="range" min="10" max="50" value={merkez} onChange={(e)=>setMerkez(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">ŞOK Fabrika Hedefi ({sok} Ton)</label>
                <input type="range" min="5" max="30" value={sok} onChange={(e)=>setSok(Number(e.target.value))} className="w-full accent-amber-500" />
              </div>
              <button onClick={optimizeEt} disabled={loading} className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(217,119,6,0.4)]">
                {loading ? "Hesaplanıyor..." : "🚀 Yapay Zeka Atamasını Ateşle"}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6">Sistem Önerisi</h2>
            {!sonuc ? (
              <div className="text-gray-500 flex items-center justify-center h-48 border-2 border-dashed border-gray-800 rounded-lg">Optimizasyon bekleniyor...</div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                  <span className="text-gray-300">🏢 Merkez Fabrika (Tahsis)</span>
                  <span className="text-2xl font-bold text-amber-500">{sonuc.isci_merkez} Kişi</span>
                </div>
                <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg">
                  <span className="text-gray-300">🏪 ŞOK Fabrika (Tahsis)</span>
                  <span className="text-2xl font-bold text-amber-500">{sonuc.isci_sok} Kişi</span>
                </div>
                
                {sonuc.bosta_kalan > 0 && (
                  <div className="bg-red-950/50 border border-red-500 p-4 rounded-lg mt-4">
                    <span className="text-red-400 font-bold block mb-1">⚠️ Atıl Kapasite (İsraf Riski)</span>
                    <span className="text-gray-300 text-sm">{sonuc.bosta_kalan} Kişi boşta. Parkinson Kanunu devreye girmemesi için bu kişileri ŞOK fabrikasına üzüm ezmeye göndermeyin!</span>
                  </div>
                )}
                {sonuc.ekstra_mesai > 0 && (
                  <div className="bg-orange-950/50 border border-orange-500 p-4 rounded-lg mt-4">
                    <span className="text-orange-400 font-bold block mb-1">🚨 Darboğaz Tespiti</span>
                    <span className="text-gray-300 text-sm">Üretim hedeflerini yakalamak için {sonuc.ekstra_mesai} kişilik fazla mesai veya ek işçi gerekmektedir.</span>
                  </div>
                )}
                {sonuc.bosta_kalan === 0 && sonuc.ekstra_mesai === 0 && (
                  <div className="bg-green-950/50 border border-green-500 p-4 rounded-lg mt-4">
                    <span className="text-green-400 font-bold block mb-1">🎯 Kusursuz Operasyonel Denge</span>
                    <span className="text-gray-300 text-sm">İşgücü siparişlere milimetrik olarak dağıtıldı. Maliyet artışı veya israf yok.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}