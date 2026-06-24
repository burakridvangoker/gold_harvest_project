import streamlit as st
import pulp

# Sayfa Ayarları
st.set_page_config(page_title="Gold Harvest AI Optimizasyon", layout="wide")

st.title("🏭 Gold Harvest - Dinamik İşgücü Optimizasyon Paneli")
st.markdown("Bu panel, **Parkinson Kanunu (Gizli Boş Zaman İsrafı)** ve **Atıl Kapasiteyi** önlemek için matematiksel optimizasyon kullanır.")
st.divider()

# 1. KULLANICI GİRDİLERİ (Sol Menü)
st.sidebar.header("Günlük Parametreler")
toplam_isci = st.sidebar.slider("Mevcut Dinamik İşçi Sayısı", min_value=20, max_value=80, value=50, step=1)
merkez_hedef = st.sidebar.slider("Merkez Fabrika Hedefi (Ton)", min_value=10, max_value=50, value=20, step=1)
sok_hedef = st.sidebar.slider("ŞOK Fabrika Hedefi (Ton)", min_value=5, max_value=30, value=15, step=1)

# Performans Katsayıları (Sabit)
kapasite_merkez = 0.6  
kapasite_sok = 0.8     

# 2. OPTİMİZASYON MOTORUNU ÇALIŞTIRMA BUTONU
if st.button("🚀 Yapay Zeka Atamasını Çalıştır", type="primary"):
    
    # Model Kurulumu
    model = pulp.LpProblem("Isgucu_Optimizasyonu", pulp.LpMinimize)
    
    # Karar Değişkenleri
    isci_merkez = pulp.LpVariable('Isci_Merkez', lowBound=0, cat='Integer')
    isci_sok = pulp.LpVariable('Isci_Sok', lowBound=0, cat='Integer')
    bosta_kalan = pulp.LpVariable('Bosta_Kalan', lowBound=0, cat='Integer')
    ekstra_mesai = pulp.LpVariable('Ekstra_Mesai', lowBound=0, cat='Integer')
    
    # Amaç Fonksiyonu (Maliyet Minimizasyonu)
    model += (100 * bosta_kalan) + (150 * ekstra_mesai)
    
    # Kısıtlar
    model += isci_merkez * kapasite_merkez >= merkez_hedef
    model += isci_sok * kapasite_sok >= sok_hedef
    model += isci_merkez + isci_sok + bosta_kalan - ekstra_mesai == toplam_isci
    
    # Çöz
    model.solve()
    
    # 3. SONUÇLARI EKRANA BASTIRMA
    st.subheader("📊 Optimizasyon Sonuçları")
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.metric(label="✅ Merkez Fabrika (Gerekli İşçi)", value=f"{int(isci_merkez.varValue)} Kişi")
    with col2:
        st.metric(label="✅ ŞOK Fabrika (Gerekli İşçi)", value=f"{int(isci_sok.varValue)} Kişi")
    with col3:
        if bosta_kalan.varValue > 0:
            st.metric(label="⚠️ Atıl Kapasite (Boşta)", value=f"{int(bosta_kalan.varValue)} Kişi", delta="-İsraf Riski", delta_color="inverse")
        elif ekstra_mesai.varValue > 0:
            st.metric(label="🚨 Ekstra Mesai / Adam İhtiyacı", value=f"{int(ekstra_mesai.varValue)} Kişi", delta="-Maliyet Riski", delta_color="inverse")
        else:
            st.metric(label="🎯 Sistem Durumu", value="Kusursuz Denge")

    # Uyarı ve Aksiyon Mesajları
    st.divider()
    if bosta_kalan.varValue > 0:
        st.warning(f"**Yapay Zeka Önerisi:** Sistemde {int(bosta_kalan.varValue)} kişi atıl durumdadır. Bu kişileri ŞOK fabrikasına üzüm ezmeye gönderip süreci yavaşlatmayın (Parkinson Kanunu). Depo sayımında veya temizlikte değerlendirin. Yeni işçi alımını durdurun.")
    elif ekstra_mesai.varValue > 0:
        st.error(f"**Yapay Zeka Önerisi:** Hedefleri tutturmak için {int(ekstra_mesai.varValue)} kişilik kapasite açığı var. Bu açığı fazla mesai ile kapatmak maliyetli olacaktır, dinamik havuzu genişletmeyi düşünün.")
    else:
        st.success("**Yapay Zeka Önerisi:** Eldeki işgücü siparişlere milimetrik olarak yetti. İsraf veya ekstra maliyet bulunmuyor.")
