// app/page.tsx
"use client";
import CellLayout from "./components/CellLayout";

export default function Home() {
  // Bu veriyi yarın veritabanından çekebilirsin, şimdilik burada duruyor
  const cellData = {
    id: "Line_01",
    stations: {
      besleme: { worker: "Mehmet", status: "active" },
      makine: { status: "running", outputRate: 15 },
      paketleme: { workers: ["Ahmet", "Ayşe"], status: "active" },
      dizme: { worker: "Fatma", status: "idle" },
      operator: { name: "Rıdvan", role: "Supervisor" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Fabrika Üretim Hattı - Kontrol Paneli</h1>
      
      {/* Çizdiğin haritayı buraya çağırıyoruz */}
      <CellLayout cellData={cellData} />
    </div>
  );
}