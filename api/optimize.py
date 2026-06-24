from http.server import BaseHTTPRequestHandler
import json
import pulp

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        toplam_isci = int(data.get('toplam_isci', 50))
        merkez_hedef = int(data.get('merkez_hedef', 20))
        sok_hedef = int(data.get('sok_hedef', 15))

        kapasite_merkez = 0.6
        kapasite_sok = 0.8

        model = pulp.LpProblem("Isgucu", pulp.LpMinimize)
        isci_merkez = pulp.LpVariable('Isci_Merkez', lowBound=0, cat='Integer')
        isci_sok = pulp.LpVariable('Isci_Sok', lowBound=0, cat='Integer')
        bosta_kalan = pulp.LpVariable('Bosta_Kalan', lowBound=0, cat='Integer')
        ekstra_mesai = pulp.LpVariable('Ekstra_Mesai', lowBound=0, cat='Integer')

        model += (100 * bosta_kalan) + (150 * ekstra_mesai)
        model += isci_merkez * kapasite_merkez >= merkez_hedef
        model += isci_sok * kapasite_sok >= sok_hedef
        model += isci_merkez + isci_sok + bosta_kalan - ekstra_mesai == toplam_isci

        model.solve()

        res = {
            "isci_merkez": int(isci_merkez.varValue),
            "isci_sok": int(isci_sok.varValue),
            "bosta_kalan": int(bosta_kalan.varValue),
            "ekstra_mesai": int(ekstra_mesai.varValue)
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(res).encode('utf-8'))