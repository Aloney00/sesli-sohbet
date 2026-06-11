const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 8080;

// ══════════════════════════════════════════
// MESAJ FİLTRESİ
// ══════════════════════════════════════════
const BANNED_WORDS = [
  // Hakaret / küfür
  'orospu', 'orospu\u00e7ocu\u011fu', 'orospu\u00e7u', 'piç', 'pi\u00e7', 'pi\u00e7lik',
  'amk', 'amq', 'amına', 'am\u0131na', 'bok', 'sik', 'siken', 'sikik',
  'oç', 'oc', 'göt', 'g\u00f6t', 'g0t', 'yarak', 'yarrak', 'siktir',
  'bok\u00e7u', 'bok\u00e7a', 'ibne', 'gavat', 'pezevenk', 'salak',
  'aptal', 'gerizekal\u0131', 'mal', 'mal\u0131n', 'k\u00f6pek', 'e\u015fek',
  'it', 'serseri', 'k\u0131çı', 'k\u0131\u00e7', 'taşak', 'ta\u015fak',
  // Irk\u00e7\u0131l\u0131k / nefret
  'zenci', 'z-enci', 'ngg', 'z\u0131k\u0131m',
  // Telefon / link spam
  'whatsapp.com', 'telegram.me', 't.me/', 'discord.gg',
  'bit.ly', 'tinyurl', '.php?', 'onclick', 'javascript:',
];

// Kelime var m\u0131 kontrol et (k\u0131smi e\u015fle\u015fme - sim* gibi)
function containsBannedWord(text) {
  const lower = text.toLowerCase()
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/\$/g, 's');
  return BANNED_WORDS.some(w => lower.includes(w));
}

// İstatistik API
app.get('/api/stats', (req, res) => {
  const uptimeMs = Date.now() - stats.startTime;
  const uptimeH = Math.floor(uptimeMs / 3600000);
  const uptimeM = Math.floor((uptimeMs % 3600000) / 60000);
  res.json({
    online: connectedUsers.size,
    waiting: waitingQueue.length,
    totalMatches: stats.totalMatches,
    totalMessages: stats.totalMessages,
    uptime: `${uptimeH}s ${uptimeM}d`
  });
});

// TURN sunucusu yapılandırması (env'den al ya da varsayılan)
app.get('/api/turn-config', (req, res) => {
  const servers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ];
  if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    servers.push({
      urls: process.env.TURN_URL,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_CREDENTIAL
    });
    if (process.env.TURN_URL_TCP) {
      servers.push({
        urls: process.env.TURN_URL_TCP,
        username: process.env.TURN_USERNAME,
        credential: process.env.TURN_CREDENTIAL
      });
    }
  } else {
    // Yedek: openrelay
    servers.push(
      { urls: 'turn:openrelay.metered.ca:80', username: 'openrelayproject', credential: 'openrelayproject' },
      { urls: 'turn:openrelay.metered.ca:443', username: 'openrelayproject', credential: 'openrelayproject' }
    );
  }
  res.json({ iceServers: servers });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bağlı kullanıcıları ve bekleme kuyruğunu takip et
let connectedUsers = new Map();
let waitingQueue = [];

// İstatistik sayıçları
const stats = {
  totalMatches: 0,
  totalMessages: 0,
  startTime: Date.now()
};

// Online kullanıcı sayısını tüm clientlara gönder
function broadcastOnlineCount() {
  io.emit('online-count', connectedUsers.size);
  io.emit('waiting-count', waitingQueue.length);
}

// Socket event flood koruması
function createRateLimiter(maxEvents, windowMs) {
  const timestamps = [];
  return function() {
    const now = Date.now();
    while (timestamps.length && timestamps[0] < now - windowMs) timestamps.shift();
    if (timestamps.length >= maxEvents) return false;
    timestamps.push(now);
    return true;
  };
}

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);
  const limitOffer = createRateLimiter(5, 5000);
  const limitIce = createRateLimiter(50, 5000);
  const limitFind = createRateLimiter(10, 10000);

  // Kullanıcı katıldı
  socket.on('join', (data) => {
    const country = data.country || '';
    const interest = data.interest || '';
    const gender = data.gender || '';
    const genderPref = data.genderPref || '';
    const color = /^#[0-9A-Fa-f]{6}$/.test(data.color) ? data.color : '#a78bfa';
    connectedUsers.set(socket.id, { 
      id: socket.id, 
      country: country,
      interest: interest,
      gender: gender,
      genderPref: genderPref,
      color: color,
      partnerId: null,
      searching: false
    });
    
    console.log(`${country} Anonim kullanıcı katıldı (Interest: ${interest || 'Any'}, Gender: ${gender || 'N/A'}): ${socket.id}`);
    broadcastOnlineCount();
  });

  // Eşleşme ara
  socket.on('find-match', (data) => {
    if (!limitFind()) return;
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    // Zaten eşleşme aramıyorsa ve partner'ı yoksa
    if (user.partnerId || user.searching) return;

    // Engelli kullanıcı listesini kaydet
    user.blocked = Array.isArray(data && data.blocked) ? data.blocked.slice(0, 100) : [];
    user.searching = true;

    // Bekleme kuyruğunda uygun bir kullanıcı ara
    let availableUserIndex = -1;

    // Cinsiyet uyumluluğu kontrolü
    const isCompatible = (u1, u2) => {
      if (!u2) return false;
      if (u1.genderPref && u2.gender && u1.genderPref !== u2.gender) return false;
      if (u2.genderPref && u1.gender && u2.genderPref !== u1.gender) return false;
      // Engelli kullanıcı kontrolü (her iki taraf)
      if (u1.blocked && u1.blocked.includes(u2.id)) return false;
      if (u2.blocked && u2.blocked.includes(u1.id)) return false;
      return true;
    };

    // Önce aynı ilgi alanı + uyumlu cinsiyet
    if (user.interest) {
      availableUserIndex = waitingQueue.findIndex(userId => {
        if (userId === socket.id) return false;
        const waitingUser = connectedUsers.get(userId);
        return waitingUser && waitingUser.interest === user.interest && isCompatible(user, waitingUser);
      });
    }

    // Sonra sadece uyumlu cinsiyet
    if (availableUserIndex === -1) {
      availableUserIndex = waitingQueue.findIndex(userId => {
        if (userId === socket.id) return false;
        const waitingUser = connectedUsers.get(userId);
        return waitingUser && isCompatible(user, waitingUser);
      });
    }

    if (availableUserIndex !== -1) {
      // Eşleşme bulundu!
      const partnerId = waitingQueue[availableUserIndex];
      const partner = connectedUsers.get(partnerId);

      if (partner) {
        // Kuyruğundan çıkar
        waitingQueue.splice(availableUserIndex, 1);

        // Partner bilgilerini güncelle
        user.partnerId = partnerId;
        user.searching = false;
        partner.partnerId = socket.id;
        partner.searching = false;

        // Her iki kullanıcıya da eşleşme bilgisini gönder
        socket.emit('match-found', {
          partnerId: partnerId,
          partnerCountry: partner.country,
          partnerInterest: partner.interest,
          partnerGender: partner.gender,
          partnerColor: partner.color,
          initiator: true
        });

        io.to(partnerId).emit('match-found', {
          partnerId: socket.id,
          partnerCountry: user.country,
          partnerInterest: user.interest,
          partnerGender: user.gender,
          partnerColor: user.color,
          initiator: false
        });

        console.log(`Eşleşme yapıldı: ${socket.id} <-> ${partnerId}`);
        stats.totalMatches++;
        io.emit('waiting-count', waitingQueue.length);
      }
    } else {
      // Kimse yok, kuyruğa ekle
      if (!waitingQueue.includes(socket.id)) {
        waitingQueue.push(socket.id);
        socket.emit('no-match');
        console.log(`Kullanıcı beklemeye alındı: ${socket.id}`);
      }
    }
  });

  // Eşleşmeyi iptal et
  socket.on('cancel-match', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      user.searching = false;
      user.partnerId = null;
    }
    
    // Kuyruktan çıkar
    const index = waitingQueue.indexOf(socket.id);
    if (index !== -1) {
      waitingQueue.splice(index, 1);
    }
  });

  // Aramayı bitir
  socket.on('end-call', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user && user.partnerId) {
      const partnerId = user.partnerId;
      
      // Partner'a bildir
      io.to(partnerId).emit('partner-disconnected');
      
      // Partner bilgilerini temizle
      const partner = connectedUsers.get(partnerId);
      if (partner) {
        partner.partnerId = null;
        partner.searching = false;
      }
      
      user.partnerId = null;
      user.searching = false;
      
      console.log(`Arama sonlandırıldı: ${socket.id} - ${partnerId}`);
    }
  });

  // WebRTC signaling - offer
  socket.on('offer', (data) => {
    if (!limitOffer()) return;
    const user = connectedUsers.get(socket.id);
    if (!user || !data.target) return;
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id
    });
  });

  // WebRTC signaling - answer
  socket.on('answer', (data) => {
    if (!limitOffer()) return;
    const user = connectedUsers.get(socket.id);
    if (!user || !data.target) return;
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  // WebRTC signaling - ice candidate
  socket.on('ice-candidate', (data) => {
    if (!limitIce()) return;
    const user = connectedUsers.get(socket.id);
    if (!user || !data.target) return;
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // Chat message (validated + rate limited)
  const chatTimestamps = [];
  socket.on('chat-message', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.partnerId) return;
    if (user.partnerId !== data.to) return;
    const message = String(data.message || '').trim().slice(0, 500);
    if (!message) return;
    // İçerik filtresi
    if (containsBannedWord(message)) {
      socket.emit('message-blocked', { reason: 'inappropriate' });
      return;
    }
    // Rate limit: max 5 per 2 seconds
    const now = Date.now();
    chatTimestamps.push(now);
    while (chatTimestamps.length > 0 && chatTimestamps[0] < now - 2000) chatTimestamps.shift();
    if (chatTimestamps.length > 5) return;
    stats.totalMessages++;
    socket.to(data.to).emit('chat-message', { message, from: socket.id });
  });

  // Emoji tepki (sadece partner'a ilet)
  socket.on('emoji-reaction', (data) => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.partnerId) return;
    const emoji = String(data.emoji || '').slice(0, 8);
    if (!emoji) return;
    socket.to(user.partnerId).emit('emoji-reaction', { emoji });
  });

  // Typing göstergesi
  socket.on('typing', () => {
    const user = connectedUsers.get(socket.id);
    if (!user || !user.partnerId) return;
    socket.to(user.partnerId).emit('typing');
  });

  // Report user
  socket.on('report-user', (reportData) => {
    const reporter = connectedUsers.get(socket.id);
    if (reporter && reporter.partnerId) {
      const reported = connectedUsers.get(reporter.partnerId);
      const logEntry = {
        timestamp: reportData.timestamp,
        reporter: {
          id: socket.id,
          country: reporter.country,
          interest: reporter.interest
        },
        reported: {
          id: reporter.partnerId,
          country: reported?.country,
          interest: reported?.interest
        },
        reason: reportData.reason,
        details: reportData.details
      };
      
      console.log('🚨 USER REPORT:', JSON.stringify(logEntry, null, 2));
      // Here you could save to database or file
    }
  });

  // Kullanıcı bağlantısı kesildiğinde
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      console.log(`Kullanıcı ayrıldı: ${socket.id}`);
      
      // Eğer partner varsa ona bildir
      if (user.partnerId) {
        io.to(user.partnerId).emit('partner-disconnected');
        
        const partner = connectedUsers.get(user.partnerId);
        if (partner) {
          partner.partnerId = null;
          partner.searching = false;
        }
      }
      
      // Kuyruktan çıkar
      const index = waitingQueue.indexOf(socket.id);
      if (index !== -1) {
        waitingQueue.splice(index, 1);
      }
      
      connectedUsers.delete(socket.id);
      broadcastOnlineCount();
    }
  });
});

http.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});
