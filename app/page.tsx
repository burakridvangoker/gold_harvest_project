"use client";
import CellLayout from './components/CellLayout';

export default function Home() {
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
    <main className="min-h-screen bg-slate-950 p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">Fabrika Üretim Hattı</h1>
      <CellLayout cellData={cellData} />
    </main>
  );
}