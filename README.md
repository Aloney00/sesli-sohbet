# 🎙️ Sesli Sohbet Uygulaması

WebRTC ve Socket.io kullanarak geliştirilmiş basit bir sesli sohbet uygulaması. İki kullanıcı arasında peer-to-peer sesli görüşme imkanı sağlar.

## 🚀 Özellikler

- ✅ İki kişilik sesli görüşme
- ✅ WebRTC ile P2P bağlantı (düşük gecikme)
- ✅ Gerçek zamanlı kullanıcı listesi
- ✅ Mikrofon aç/kapa kontrolü
- ✅ Ses seviyesi göstergesi
- ✅ Responsive tasarım
- ✅ Kolay kullanım

## 📋 Gereksinimler

- Node.js (v14 veya üzeri)
- npm veya yarn
- Modern web tarayıcı (Chrome, Firefox, Edge, Safari)
- Mikrofon erişimi

## 🔧 Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. Sunucuyu başlatın:

```bash
npm start
```

Veya geliştirme modu için:

```bash
npm run dev
```

3. Tarayıcınızda açın:

```
http://localhost:3000
```

## 💡 Kullanım

1. **İlk Kullanıcı:**

   - Tarayıcınızda `http://localhost:3000` adresine gidin
   - Kullanıcı adınızı girin ve "Katıl" butonuna tıklayın
   - Başka bir kullanıcının bağlanmasını bekleyin

2. **İkinci Kullanıcı:**

   - Başka bir tarayıcı sekmesi veya farklı bir cihazdan aynı adrese gidin
   - Farklı bir kullanıcı adı girin ve katılın

3. **Arama Başlatma:**

   - Kullanıcı listesinden aramak istediğiniz kişiye tıklayın
   - "Aramayı Başlat" butonuna tıklayın
   - Mikrofon izni verin

4. **Arama Sırasında:**
   - 🎤 Sesi Kapat/Aç butonu ile mikrofonunuzu kontrol edin
   - 📞 Aramayı Bitir butonu ile aramayı sonlandırın
   - Ses seviyesi göstergesini takip edin

## 🏗️ Proje Yapısı

```
sesli-sohbet/
├── server.js           # Node.js + Socket.io sunucusu
├── package.json        # Proje bağımlılıkları
├── public/
│   ├── index.html     # Ana HTML sayfası
│   ├── style.css      # CSS stilleri
│   └── app.js         # Client-side JavaScript (WebRTC)
└── README.md          # Bu dosya
```

## 🔌 Teknolojiler

- **Backend:** Node.js, Express.js, Socket.io
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **WebRTC:** Sesli iletişim için
- **Socket.io:** Signaling sunucusu

## 🌐 Deployment (İsteğe Bağlı)

### Heroku'ya deploy etmek için:

1. Heroku hesabı oluşturun
2. Heroku CLI kurun
3. Şu komutları çalıştırın:

```bash
heroku login
heroku create sesli-sohbet-app
git push heroku main
```

### Glitch'e deploy etmek için:

1. glitch.com'a gidin
2. "New Project" > "Import from GitHub" seçin
3. Projenizi import edin

## 🔒 Güvenlik Notları

- Bu basit bir prototiptir
- Üretim ortamı için HTTPS kullanılmalıdır
- TURN sunucusu eklenmelidir (NAT geçişi için)
- Kullanıcı kimlik doğrulaması eklenebilir

## 🛠️ İyileştirme Önerileri

- [ ] Grup görüşme desteği
- [ ] Görüntülü arama
- [ ] Metin mesajlaşma
- [ ] Kayıt özelliği
- [ ] Kullanıcı profilleri
- [ ] Oda sistemi

## 📝 Lisans

MIT License

## 🤝 Katkıda Bulunma

Pull request'ler kabul edilir. Büyük değişiklikler için önce bir issue açarak neyi değiştirmek istediğinizi belirtin.

## ⚠️ Sorun Giderme

**Mikrofon erişimi sorunu:**

- Tarayıcı izinlerini kontrol edin
- HTTPS kullanın (localhost hariç)

**Ses duyulmuyorsa:**

- Her iki kullanıcı da mikrofon izni vermiş olmalı
- Tarayıcı konsolunu kontrol edin
- Firewall ayarlarını kontrol edin

**Bağlantı kurulamazsa:**

- İnternet bağlantınızı kontrol edin
- Farklı ağlardaysanız TURN sunucusu gerekebilir

## 📧 İletişim

Sorularınız için issue açabilirsiniz.

---

**Not:** Bu uygulama eğitim amaçlıdır. Üretim ortamında kullanmadan önce güvenlik ve performans iyileştirmeleri yapılmalıdır.
