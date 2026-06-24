import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Gelen veriler
    const kaju = parseInt(data.kaju) || 50;
    const cekirdek = parseInt(data.cekirdek) || 100;
    const badem = parseInt(data.badem) || 30;

    // Sabit Hızlar
    const hiz_kaju = 10;
    const hiz_cekirdek = 15;
    const hiz_badem = 5;

    // Süre Hesaplamaları
    const sure_kaju = Math.ceil(kaju / hiz_kaju);
    const sure_cekirdek = Math.ceil(cekirdek / hiz_cekirdek);
    const sure_badem = Math.ceil(badem / hiz_badem);

    const zaman_cizelgesi = [];
    
    // Zaman Çizelgesi mantığı
    zaman_cizelgesi.push({
      saat: `08:00 - ${8 + sure_kaju}:00`,
      olay: `Kaju Hattı Çalışıyor (${kaju} Palet)`,
      durum: "aktif"
    });

    const bitis_cekirdek = 8 + sure_kaju + sure_cekirdek;
    zaman_cizelgesi.push({
      saat: `${8 + sure_kaju}:00 - ${bitis_cekirdek}:00`,
      olay: "Kaju ekibi Çekirdek Hattına kaydırıldı.",
      durum: "transfer"
    });

    const bitis_badem = bitis_cekirdek + sure_badem;
    zaman_cizelgesi.push({
      saat: `${bitis_cekirdek}:00 - ${bitis_badem}:00`,
      olay: "Tüm ekipler Badem Paketlemeye geçti.",
      durum: "kapanis"
    });

    const toplam_saat = bitis_badem - 8;
    const ekstra_mesai = Math.max(0, toplam_saat - 8);

    return NextResponse.json({
      toplam_saat,
      mesai_saati: ekstra_mesai,
      cizelge: zaman_cizelgesi
    });

  } catch (error) {
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}