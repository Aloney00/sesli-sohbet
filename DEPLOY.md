# Google Cloud'a Deploy Rehberi

## Ön Hazırlık

1. **Google Cloud hesabı oluşturun**: https://console.cloud.google.com
2. **Google Cloud SDK'yı yükleyin**: https://cloud.google.com/sdk/docs/install
3. **Billing (Fatura) hesabı aktif olmalı** (ücretsiz deneme kredisi alabilirsiniz)

## Seçenek 1: Google App Engine (Önerilen - Daha Kolay)

### 1. Google Cloud SDK'yı yükleyin ve giriş yapın:

```powershell
gcloud auth login
```

### 2. Yeni bir proje oluşturun veya mevcut projeyi seçin:

```powershell
# Yeni proje oluştur
gcloud projects create sesli-sohbet-app --name="Sesli Sohbet"

# Projeyi ayarla
gcloud config set project sesli-sohbet-app

# Billing hesabını bağlayın (Console'dan yapılabilir)
```

### 3. App Engine'i etkinleştirin:

```powershell
gcloud app create --region=europe-west3
```

### 4. Deploy edin:

```powershell
gcloud app deploy
```

### 5. Uygulamanızı açın:

```powershell
gcloud app browse
```

### App Engine Avantajları:

- ✅ Otomatik ölçeklendirme
- ✅ HTTPS otomatik
- ✅ Minimum yapılandırma
- ✅ WebSocket desteği

---

## Seçenek 2: Google Cloud Run (Daha Esnek)

### 1. Google Cloud SDK'yı yükleyin ve giriş yapın:

```powershell
gcloud auth login
```

### 2. Projeyi ayarlayın:

```powershell
gcloud config set project PROJE-ID
```

### 3. Container Registry API'yi etkinleştirin:

```powershell
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com
```

### 4. Docker image'ı build edin ve push edin:

```powershell
# Cloud Build kullanarak
gcloud builds submit --tag gcr.io/PROJE-ID/sesli-sohbet

# Veya local build
docker build -t gcr.io/PROJE-ID/sesli-sohbet .
docker push gcr.io/PROJE-ID/sesli-sohbet
```

### 5. Cloud Run'a deploy edin:

```powershell
gcloud run deploy sesli-sohbet `
  --image gcr.io/PROJE-ID/sesli-sohbet `
  --platform managed `
  --region europe-west1 `
  --allow-unauthenticated `
  --port 8080
```

### Cloud Run Avantajları:

- ✅ Docker container desteği
- ✅ Sadece kullanım başına ödeme
- ✅ Hızlı deploy
- ✅ WebSocket desteği

---

## Önemli Notlar

### Port Ayarları

Google Cloud, `PORT` environment variable'ını otomatik ayarlar.
Server.js dosyamız zaten bunu destekliyor:

```javascript
const PORT = process.env.PORT || 3000;
```

### WebSocket ve Socket.io

Her iki platform da WebSocket'leri destekler, ancak:

- App Engine: Session affinity otomatik
- Cloud Run: WebSocket timeout 60 dakika

### Ücretsiz Kotalar

- **App Engine**: 28 instance saat/gün ücretsiz
- **Cloud Run**: 2 milyon istek/ay ücretsiz, 360,000 GB-saniye bellek

### Domain Bağlama

Her iki platformda da custom domain ekleyebilirsiniz:

```powershell
gcloud app domain-mappings create www.domain.com
```

### Logları Görüntüleme

```powershell
# App Engine
gcloud app logs tail -s default

# Cloud Run
gcloud run services logs read sesli-sohbet --region=europe-west1
```

---

## Hızlı Başlangıç (En Kolay Yol)

```powershell
# 1. Giriş yapın
gcloud auth login

# 2. Proje oluşturun
gcloud projects create sesli-sohbet-$(Get-Random) --name="Sesli Sohbet"

# 3. Projeyi ayarlayın (yukarıdaki komutun çıktısındaki ID'yi kullanın)
gcloud config set project PROJE-ID

# 4. App Engine oluşturun
gcloud app create --region=europe-west3

# 5. Deploy edin
gcloud app deploy

# 6. Tarayıcıda açın
gcloud app browse
```

## Sorun Giderme

### "Billing account required" hatası

- Google Cloud Console'dan billing hesabı ekleyin

### WebSocket bağlantı sorunları

- App Engine'de session affinity ayarlarını kontrol edin
- HTTPS kullandığınızdan emin olun

### Yavaş başlatma

- App Engine'de min_instances değerini artırın (maliyeti artırır)
- Cloud Run'da minimum instances ayarlayın

## Daha Fazla Bilgi

- App Engine Docs: https://cloud.google.com/appengine/docs/nodejs
- Cloud Run Docs: https://cloud.google.com/run/docs
