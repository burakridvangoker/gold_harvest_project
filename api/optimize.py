from http.server import BaseHTTPRequestHandler
import json
import math

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        # Gelen Siparişler (Palet bazında)
        kaju_siparis = int(data.get('kaju', 50))
        cekirdek_siparis = int(data.get('cekirdek', 100))
        badem_siparis = int(data.get('badem', 30))
        toplam_isci = int(data.get('isci', 40))

        # Sabit Makine Hızları (Saatte basılan palet sayısı)
        hiz_kaju = 10
        hiz_cekirdek = 15
        hiz_badem = 5

        # Süre Hesaplamaları (Saat)
        sure_kaju = math.ceil(kaju_siparis / hiz_kaju)
        sure_cekirdek = math.ceil(cekirdek_siparis / hiz_cekirdek)
        sure_badem = math.ceil(badem_siparis / hiz_badem)

        toplam_is_yuku = sure_kaju + sure_cekirdek + sure_badem
        
        # Basit Dinamik Atama Simülasyonu
        # Mesai başlangıcı 08:00
        zaman_cizelgesi = []
        
        if kaju_siparis > 0:
            zaman_cizelgesi.append({
                "saat": f"08:00 - {08 + sure_kaju:02d}:00",
                "olay": f"Kaju Hattı Çalışıyor ({kaju_siparis} Palet)",
                "durum": "aktif"
            })
        
        if cekirdek_siparis > 0:
            bitis_cekirdek = 8 + sure_kaju + sure_cekirdek
            zaman_cizelgesi.append({
                "saat": f"{08 + sure_kaju:02d}:00 - {bitis_cekirdek:02d}:00",
                "olay": "Kaju ekibi Çekirdek Hattına kaydırıldı.",
                "durum": "transfer"
            })
            
        if badem_siparis > 0:
            bitis_badem = bitis_cekirdek + sure_badem
            zaman_cizelgesi.append({
                "saat": f"{bitis_cekirdek:02d}:00 - {bitis_badem:02d}:00",
                "olay": "Tüm ekipler Badem Paketlemeye geçti.",
                "durum": "kapanis"
            })

        # Toplam saat 8 saati (16:00'ı) geçiyorsa mesai uyarısı ver
        toplam_saat = bitis_badem - 8
        ekstra_mesai = max(0, toplam_saat - 8)

        res = {
            "toplam_saat": toplam_saat,
            "mesai_saati": ekstra_mesai,
            "cizelge": zaman_cizelgesi,
            "kaju_sure": sure_kaju,
            "cekirdek_sure": sure_cekirdek,
            "badem_sure": sure_badem
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(res).encode('utf-8'))