# 🚀 To-Do PRO Ultimate

Profesyonel görev yönetimi uygulaması - Modern, hızlı ve kullanıcı dostu todo list uygulaması.

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![CSS](https://img.shields.io/badge/CSS-Modern-orange.svg)

## ✨ Özellikler

### 🎯 Temel Özellikler
- ✅ **Görev Ekleme**: Hızlı görev ekleme ve düzenleme
- 🔄 **Tekrarlayan Görevler**: Günlük, haftalık, aylık görevler
- 🏷️ **Öncelik Sistemi**: Yüksek, orta, düşük öncelik seviyeleri
- 📂 **Kategori Yönetimi**: Sınırsız kategori oluşturma
- ⏰ **Tarih Yönetimi**: Bitiş tarihi belirleme ve hatırlatma
- 🗑️ **Gelişmiş Filtreleme**: Durum, öncelik, kategori bazlı filtreleme

### ⏱️ Zaman Takibi
- ⏱️ **Zaman Ölçümü**: Görev başına zaman takibi
- 📊 **İstatistikler**: Detaylı performans analizi
- 📈 **Verimlilik Takibi**: Tamamlama oranları ve süreler

### 🎨 Görünüm Özellikleri
- 🎨 **8 Tema**: Okyanus, Orman, Gün Batımı ve daha fazlası
- 📱 **Responsive Tasarım**: Mobil ve masaüstü optimizasyonu
- 🌙 **Koyu Mod Desteği**: Otomatik tema algılama
- ⚡ **Animasyonlar**: Modern ve akıcı geçişler

### 🏆 Başarım Sistemi
- 🏆 **12 Başarım**: Görev tamamlama, zaman takibi, kategori oluşturma
- 📊 **İlerleme Takibi**: Başarım ilerlemesi ve hedefler
- 🎯 **Motivasyon**: Oyunlaştırılmış deneyim

### 🤖 AI Asistanı
- 💬 **Akıllı Sohbet**: Görev yönetimi yardımı
- 🧠 **Öneriler**: Kullanıcı davranışına göre tavsiyeler
- 💾 **Konuşma Geçmişi**: Sohbet kayıtları

### 💾 Veri Yönetimi
- 💾 **LocalStorage**: Tarayıcıda yerel veri saklama
- 📤 **Dışa Aktarma**: JSON formatında veri dışa aktarma
- 🔄 **Otomatik Kaydetme**: Tüm değişiklikler otomatik kaydedilir

## 🚀 Kurulum ve Çalıştırma

### GitHub Pages'de Yayınlama

1. **Repository'yi oluşturun:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **GitHub'da yeni repository oluşturun**

3. **Dosyaları yükleyin:**
   ```bash
   git remote add origin https://github.com/username/repository-name.git
   git push -u origin main
   ```

4. **GitHub Pages'i etkinleştirin:**
   - Repository ayarlarına gidin
   - "Pages" bölümüne gidin
   - Source olarak "main" branch'ini seçin
   - "Save" butonuna tıklayın

5. **Uygulamanız hazır!** `https://username.github.io/repository-name/` adresinden erişebilirsiniz.

### Yerel Geliştirme

```bash
# Dosyaları indirin
git clone https://github.com/username/repository-name.git
cd repository-name

# Yerel sunucu başlatın (Python ile)
python -m http.server 8000

# Veya başka bir sunucu ile
# npm install -g http-server
# http-server

# Tarayıcıda açın
# http://localhost:8000
```

## 📁 Dosya Yapısı

```
todo-pro-ultimate/
├── index.html              # Ana HTML dosyası
├── assets/
│   ├── css/
│   │   └── styles.css      # Ana stil dosyası
│   └── js/
│       └── app.js          # Ana JavaScript dosyası
├── README.md               # Bu dosya
└── .gitignore             # Git ignore kuralları
```

## 🎮 Kullanım

### Görev Ekleme
1. Üst kısımdaki input alanına görev metnini yazın
2. Öncelik seviyesini seçin (🔴 Yüksek/🟡 Orta/🟢 Düşük)
3. İsteğe bağlı olarak kategori seçin
4. Bitiş tarihi belirleyin (opsiyonel)
5. "EKLE" butonuna tıklayın veya Enter'a basın

### Tekrarlayan Görevler
1. "Tekrarlayan görev" seçeneğini işaretleyin
2. Tekrarlama türünü seçin (Günlük/Haftalık/Aylık)
3. Kaç kez tekrarlayacağını belirleyin
4. Görevi ekleyin

### Zaman Takibi
1. Görevde ⏱️ butonuna tıklayarak zaman takibi başlatın
2. Yeşil animasyon aktif olduğunu gösterir
3. Tekrar ⏱️ butonuna tıklayarak zamanı kaydedin

### Filtreleme
- **Tümü**: Tüm görevleri gösterir
- **Bekleyen**: Tamamlanmamış görevler
- **Tamamlanan**: Tamamlanmış görevler
- **Öncelik**: Öncelik seviyesine göre filtreleme
- **Geciken**: Vadesi geçmiş görevler
- **Kategori**: Kategoriye göre filtreleme

## 🎨 Temalar

Uygulama 8 farklı tema içerir:

1. **Orijinal**: Mavi tonlarında modern görünüm
2. **Okyanus**: Deniz mavisi ve turkuaz tonları
3. **Orman**: Yeşil tonlarında doğal görünüm
4. **Gün Batımı**: Turuncu ve pembe tonları
5. **Gül**: Pembe ve mor tonları
6. **Mor**: Derin mor ve lavanta tonları
7. **Gece Yarısı**: Koyu mavi tonları
8. **Siber**: Neon mavisi ve yeşil tonları

## 📱 Mobil Uyumluluk

- **Touch-Friendly**: 48px minimum buton boyutları
- **Responsive**: Tüm ekran boyutlarında çalışır
- **iOS Safari**: Zoom önleme optimizasyonları
- **Android Chrome**: Dokunmatik optimizasyonlar

## 🏆 Başarımlar

### Temel Başarımlar
- 🎯 **İlk Görev**: İlk görevi tamamla
- 🏆 **Görev Ustası**: 25 görevi tamamla
- ⏱️ **Zaman Ustası**: 5 saat zaman takip et
- 👑 **Kategori Kralı**: 5 kategori oluştur

### Özel Başarımlar
- 💎 **Mükemmeliyetçi**: 10 görevi arka arkaya tamamla
- 🌅 **Erken Kuş**: Sabah 6-9 arası görev tamamla
- 🎯 **Çizgi Ustası**: Tüm temel başarımları aç

## 🤖 AI Asistanı

Akıllı asistan aşağıdaki konularda yardımcı olur:
- Görev yönetimi ipuçları
- Özellik kullanımı açıklamaları
- Verimlilik önerileri
- Soru-cevap desteği

## 💾 Teknik Detaylar

- **JavaScript**: ES6+ modern syntax
- **CSS**: CSS Grid, Flexbox, CSS Variables
- **Depolama**: LocalStorage API
- **Animasyonlar**: CSS Transitions ve Keyframes
- **Responsive**: Mobile-first yaklaşım
- **Erişilebilirlik**: Keyboard navigation, ARIA labels

## 🔧 Geliştirme

### Gereksinimler
- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- İnternet bağlantısı (ilk yükleme için)
- JavaScript etkin

### Katkıda Bulunma
1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Geliştirici**: Modern Web Apps
- **E-posta**: info@modernwebapps.com
- **GitHub**: [github.com/modernwebapps](https://github.com/modernwebapps)

## 🙏 Teşekkürler

- Font Awesome - İkonlar için
- Google Fonts - Tipografi için
- Unsplash - Görseller için (gelecek sürümlerde)

---

⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!
