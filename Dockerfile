# Cloud Run için Dockerfile
FROM node:20-slim

# Çalışma dizini
WORKDIR /usr/src/app

# Package.json ve package-lock.json'ı kopyala
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install --production

# Uygulama dosyalarını kopyala
COPY . .

# Port
EXPOSE 8080

# Uygulamayı başlat
CMD [ "node", "server.js" ]
