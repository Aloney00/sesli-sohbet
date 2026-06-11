const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const PORT = process.env.PORT || 8080;

// Static dosyaları serve et
app.use(express.static('public'));

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Bağlı kullanıcıları ve bekleme kuyruğunu takip et
let connectedUsers = new Map();
let waitingQueue = [];

// Online kullanıcı sayısını tüm clientlara gönder
function broadcastOnlineCount() {
  io.emit('online-count', connectedUsers.size);
}

io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı:', socket.id);

  // Kullanıcı katıldı
  socket.on('join', (data) => {
    const country = data.country || '';
    const interest = data.interest || '';
    connectedUsers.set(socket.id, { 
      id: socket.id, 
      country: country,
      interest: interest,
      partnerId: null,
      searching: false
    });
    
    console.log(`${country} Anonim kullanıcı katıldı (Interest: ${interest || 'Any'}): ${socket.id}`);
    broadcastOnlineCount();
  });

  // Eşleşme ara
  socket.on('find-match', () => {
    const user = connectedUsers.get(socket.id);
    if (!user) return;

    // Zaten eşleşme aramıyorsa ve partner'ı yoksa
    if (user.partnerId || user.searching) return;

    user.searching = true;

    // Bekleme kuyruğunda uygun bir kullanıcı ara
    // Kendi kendisiyle eşleşmesin ve tercihen aynı ilgi alanından olsun
    let availableUserIndex = -1;
    
    // Önce aynı ilgi alanından ara (eğer ilgi alanı seçilmişse)
    if (user.interest) {
      availableUserIndex = waitingQueue.findIndex(userId => {
        if (userId === socket.id) return false;
        const waitingUser = connectedUsers.get(userId);
        return waitingUser && waitingUser.interest === user.interest;
      });
    }
    
    // Bulunamazsa herhangi birini al
    if (availableUserIndex === -1) {
      availableUserIndex = waitingQueue.findIndex(userId => userId !== socket.id);
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
          initiator: true  // Bu kullanıcı aramayı başlatacak
        });

        io.to(partnerId).emit('match-found', {
          partnerId: socket.id,
          partnerCountry: user.country,
          partnerInterest: user.interest,
          initiator: false  // Bu kullanıcı aramayı bekleyecek
        });

        console.log(`Eşleşme yapıldı: ${socket.id} <-> ${partnerId}`);
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
    socket.to(data.target).emit('offer', {
      offer: data.offer,
      sender: socket.id
    });
  });

  // WebRTC signaling - answer
  socket.on('answer', (data) => {
    socket.to(data.target).emit('answer', {
      answer: data.answer,
      sender: socket.id
    });
  });

  // WebRTC signaling - ice candidate
  socket.on('ice-candidate', (data) => {
    socket.to(data.target).emit('ice-candidate', {
      candidate: data.candidate,
      sender: socket.id
    });
  });

  // Chat message
  socket.on('chat-message', (data) => {
    socket.to(data.to).emit('chat-message', {
      message: data.message,
      from: socket.id
    });
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
