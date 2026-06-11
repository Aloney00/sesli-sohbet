// Socket.io bağlantısı
const socket = io();

// Translations
const translations = {
    en: {
        online: 'Online',
        subtitle: 'Random Anonymous Voice Chat',
        title: '🎭 Anonymous Voice Chat',
        description: 'Talk with random strangers anonymously',
        selectCountry: '🌍 Select your country:',
        selectCountryOption: 'Select Country...',
        startTalking: 'Start Talking',
        anonymousUser: 'Anonymous User',
        waiting: 'Waiting...',
        findingSomeone: 'Finding someone...',
        endCall: 'End Call & Find Next',
        nextPerson: 'Next Person',
        mute: 'Mute',
        unmute: 'Unmute',
        volume: 'Volume:',
        // Dynamic messages
        pleaseSelectCountry: 'Please select your country!',
        findingMatch: 'Finding match...',
        matched: 'Matched with {country} Anonymous user!',
        connecting: 'Connecting...',
        noUsersWaiting: 'No users waiting',
        waitingForUser: 'Waiting for another user... Please wait.',
        microphoneError: 'Cannot access microphone. Please allow permission.',
        connectionFailed: 'Connection failed.',
        partnerLeft: 'Partner left. Finding new match...',
        callStarted: 'Call started! 🎉',
        connected: 'Connected',
        connectionLost: 'Connection lost. Finding new match...',
        disconnected: 'Disconnected'
    }
};

let currentLang = 'en';

// DOM elementleri
const loginSection = document.getElementById('loginSection');
const chatSection = document.getElementById('chatSection');
const countrySelect = document.getElementById('countrySelect');
const interestSelect = document.getElementById('interestSelect');
const joinBtn = document.getElementById('joinBtn');
const matchingMessage = document.getElementById('matchingMessage');
const endCallBtn = document.getElementById('endCallBtn');
const nextPersonBtn = document.getElementById('nextPersonBtn');
const callStatus = document.getElementById('callStatus');
const connectionStatus = document.getElementById('connectionStatus');
const audioControls = document.getElementById('audioControls');
const muteBtn = document.getElementById('muteBtn');
const remoteAudio = document.getElementById('remoteAudio');
const volumeLevel = document.getElementById('volumeLevel');
const onlineCount = document.getElementById('onlineCount');
const textChat = document.getElementById('textChat');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const testMicBtn = document.getElementById('testMicBtn');
const micTestResult = document.getElementById('micTestResult');
const micLevelFill = document.getElementById('micLevelFill');
const micTestStatus = document.getElementById('micTestStatus');
const reportBtn = document.getElementById('reportBtn');
const reportModal = document.getElementById('reportModal');
const modalClose = document.querySelector('.modal-close');
const submitReport = document.getElementById('submitReport');
const cancelReport = document.getElementById('cancelReport');
const reportDetails = document.getElementById('reportDetails');

// Değişkenler
let myId = '';
let myCountry = '';
let myInterest = '';
let peerConnection = null;
let localStream = null;
let remoteUserId = null;
let isMuted = false;
let isSearching = false;
let isTesting = false;
let testStream = null;
let audioContext = null;
let analyser = null;
let microphone = null;

// WebRTC yapılandırması
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        {
            urls: 'turn:openrelay.metered.ca:80',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        },
        {
            urls: 'turn:openrelay.metered.ca:443',
            username: 'openrelayproject',
            credential: 'openrelayproject'
        }
    ]
};

// Language functions
function t(key, params = {}) {
    let text = translations.en[key] || key;
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    return text;
}

// Initialize translations on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (translations.en[key]) {
            elem.textContent = translations.en[key];
        }
    });
});

// Microphone Test
testMicBtn.addEventListener('click', async () => {
    if (!isTesting) {
        await startMicTest();
    } else {
        stopMicTest();
    }
});
// Report Modal
reportBtn.addEventListener('click', () => {
    reportModal.style.display = 'block';
});

modalClose.addEventListener('click', () => {
    reportModal.style.display = 'none';
    clearReportForm();
});

cancelReport.addEventListener('click', () => {
    reportModal.style.display = 'none';
    clearReportForm();
});

window.addEventListener('click', (e) => {
    if (e.target === reportModal) {
        reportModal.style.display = 'none';
        clearReportForm();
    }
});

submitReport.addEventListener('click', () => {
    const selectedReason = document.querySelector('input[name="reportReason"]:checked');
    if (!selectedReason) {
        alert(translations[currentLang]['report-error']);
        return;
    }
    
    const reportData = {
        reason: selectedReason.value,
        details: reportDetails.value,
        timestamp: new Date().toISOString()
    };
    
    socket.emit('report-user', reportData);
    reportModal.style.display = 'none';
    clearReportForm();
    alert(translations[currentLang]['report-success']);
});

function clearReportForm() {
    const radios = document.querySelectorAll('input[name="reportReason"]');
    radios.forEach(radio => radio.checked = false);
    reportDetails.value = '';
}
async function startMicTest() {
    try {
        testStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        // Show test result
        micTestResult.classList.remove('hidden');
        testMicBtn.textContent = '❌ Stop Test';
        testMicBtn.classList.add('btn-danger');
        testMicBtn.classList.remove('btn-secondary');
        isTesting = true;
        
        // Setup audio analysis
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(testStream);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        // Connect microphone to analyser AND to speakers so you can hear yourself
        microphone.connect(analyser);
        microphone.connect(audioContext.destination); // This allows you to hear your voice!
        
        // Animate mic level
        function updateMicLevel() {
            if (!isTesting) return;
            
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / bufferLength;
            const percentage = Math.min(100, (average / 128) * 100);
            
            micLevelFill.style.width = percentage + '%';
            
            if (percentage > 50) {
                micTestStatus.textContent = '✅ Microphone working great!';
                micTestStatus.style.color = '#34d399';
            } else if (percentage > 20) {
                micTestStatus.textContent = '🔊 Speak louder...';
                micTestStatus.style.color = '#fbbf24';
            } else {
                micTestStatus.textContent = '🎤 Speak to test...';
                micTestStatus.style.color = '#a78bfa';
            }
            
            requestAnimationFrame(updateMicLevel);
        }
        
        updateMicLevel();
        
    } catch (error) {
        console.error('Microphone test error:', error);
        micTestStatus.textContent = '❌ Microphone access denied';
        micTestStatus.style.color = '#ef4444';
        micTestResult.classList.remove('hidden');
    }
}

function stopMicTest() {
    if (testStream) {
        testStream.getTracks().forEach(track => track.stop());
        testStream = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    isTesting = false;
    micTestResult.classList.add('hidden');
    testMicBtn.textContent = '🎤 Test Microphone';
    testMicBtn.classList.remove('btn-danger');
    testMicBtn.classList.add('btn-secondary');
    micLevelFill.style.width = '0%';
}

// Konuşmaya başla
joinBtn.addEventListener('click', () => {
    const country = countrySelect.value;
    const interest = interestSelect.value;
    if (country) {
        // Stop mic test if running
        if (isTesting) {
            stopMicTest();
        }
        
        myCountry = country;
        myInterest = interest;
        socket.emit('join', { country: country, interest: interest });
        loginSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        
        // Otomatik olarak eşleşme ara
        startSearching();
    } else {
        alert(t('pleaseSelectCountry'));
    }
});

// Eşleşme aramaya başla
function startSearching() {
    if (isSearching) return;
    
    isSearching = true;
    matchingMessage.classList.remove('hidden');
    callStatus.textContent = '';
    connectionStatus.innerHTML = `🔄 <span data-i18n="findingMatch">${t('findingMatch')}</span>`;
    
    socket.emit('find-match');
}

// Eşleşme bulundu
socket.on('match-found', async (data) => {
    isSearching = false;
    remoteUserId = data.partnerId;
    matchingMessage.classList.add('hidden');
    
    callStatus.textContent = t('matched', { country: data.partnerCountry });
    callStatus.className = 'call-status calling';
    connectionStatus.innerHTML = `🟡 <span data-i18n="connecting">${t('connecting')}</span>`;
    
    // Show text chat
    textChat.classList.remove('hidden');
    chatMessages.innerHTML = '';
    
    // Eğer initiator isek aramayı başlat
    if (data.initiator) {
        await startCall();
    }
});

// Eşleşme bulunamadı
socket.on('no-match', () => {
    isSearching = false;
    connectionStatus.innerHTML = `⏳ <span data-i18n="noUsersWaiting">${t('noUsersWaiting')}</span>`;
    callStatus.textContent = t('waitingForUser');
    
    // 3 saniye sonra tekrar dene
    setTimeout(() => {
        if (!remoteUserId) {
            startSearching();
        }
    }, 3000);
});

// Aramayı başlat
async function startCall() {
    try {
        // Mikrofon erişimi
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        // PeerConnection oluştur
        createPeerConnection();
        
        // Local stream'i ekle
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        // Offer oluştur
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Offer'ı gönder
        socket.emit('offer', {
            offer: offer,
            target: remoteUserId
        });
        
        endCallBtn.classList.remove('hidden');
        nextPersonBtn.classList.remove('hidden');
        reportBtn.classList.remove('hidden');
        audioControls.classList.remove('hidden');
        
    } catch (error) {
        console.error('Mikrofon erişim hatası:', error);
        callStatus.textContent = t('microphoneError');
        callStatus.className = 'call-status error';
        
        // Eşleşmeyi iptal et
        socket.emit('cancel-match');
        remoteUserId = null;
        startSearching();
    }
}

// Offer alındığında
socket.on('offer', async (data) => {
    try {
        remoteUserId = data.sender;
        
        // Mikrofon erişimi
        localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        
        // PeerConnection oluştur
        createPeerConnection();
        
        // Local stream'i ekle
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        // Remote description ayarla
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        
        // Answer oluştur
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        
        // Answer'ı gönder
        socket.emit('answer', {
            answer: answer,
            target: data.sender
        });
        
        endCallBtn.classList.remove('hidden');
        nextPersonBtn.classList.remove('hidden');
        audioControls.classList.remove('hidden');
        
    } catch (error) {
        console.error('Offer işleme hatası:', error);
        callStatus.textContent = t('connectionFailed');
        callStatus.className = 'call-status error';
        
        // Yeni eşleşme ara
        endCall();
        startSearching();
    }
});

// Answer alındığında
socket.on('answer', async (data) => {
    try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } catch (error) {
        console.error('Answer işleme hatası:', error);
    }
});

// ICE candidate alındığında
socket.on('ice-candidate', async (data) => {
    try {
        if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    } catch (error) {
        console.error('ICE candidate hatası:', error);
    }
});

// Partner ayrıldı
socket.on('partner-disconnected', () => {
    callStatus.textContent = t('partnerLeft');
    callStatus.className = 'call-status';
    endCall();
    startSearching();
});

// Online kullanıcı sayısı güncellendi
socket.on('online-count', (count) => {
    onlineCount.textContent = count;
});

// PeerConnection oluştur
function createPeerConnection() {
    peerConnection = new RTCPeerConnection(configuration);
    
    // ICE candidate event
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', {
                candidate: event.candidate,
                target: remoteUserId
            });
        }
    };
    
    // Remote stream alındığında
    peerConnection.ontrack = (event) => {
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.play().catch(e => console.warn('Audio play failed:', e));
        callStatus.textContent = t('callStarted');
        callStatus.className = 'call-status connected';
        connectionStatus.innerHTML = `🟢 <span data-i18n="connected">${t('connected')}</span>`;
    };
    
    // Connection state değişikliği
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'disconnected' || 
            peerConnection.connectionState === 'failed') {
            callStatus.textContent = t('connectionLost');
            endCall();
            startSearching();
        }
    };
}

// Aramayı sonlandır
function endCall() {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (remoteAudio.srcObject) {
        remoteAudio.srcObject.getTracks().forEach(track => track.stop());
        remoteAudio.srcObject = null;
    }
    
    endCallBtn.classList.add('hidden');
    nextPersonBtn.classList.add('hidden');
    reportBtn.classList.add('hidden');
    audioControls.classList.add('hidden');
    textChat.classList.add('hidden');
    
    connectionStatus.innerHTML = `🔴 <span data-i18n="disconnected">${t('disconnected')}</span>`;
    
    remoteUserId = null;
    isMuted = false;
    const muteText = muteBtn.querySelector('span');
    if (muteText) {
        muteText.textContent = t('mute');
        muteText.setAttribute('data-i18n', 'mute');
    }
    muteBtn.style.background = '';
}

// Görüşmeyi bitir ve yeni kişi bul
endCallBtn.addEventListener('click', () => {
    socket.emit('end-call', { partnerId: remoteUserId });
    endCall();
    startSearching();
});

// Sonraki kişi
nextPersonBtn.addEventListener('click', () => {
    socket.emit('end-call', { partnerId: remoteUserId });
    endCall();
    startSearching();
});

// Send chat message
sendBtn.addEventListener('click', () => {
    sendMessage();
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value.trim();
    if (message && remoteUserId) {
        // Add to own chat
        addChatMessage(message, true);
        
        // Send to partner
        socket.emit('chat-message', {
            message: message,
            to: remoteUserId
        });
        
        chatInput.value = '';
    }
}

function addChatMessage(message, isSent) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${isSent ? 'sent' : 'received'}`;
    
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        ${message}
        <span class="timestamp">${time}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Receive chat message
socket.on('chat-message', (data) => {
    addChatMessage(data.message, false);
});

// Mikrofonu aç/kapat
muteBtn.addEventListener('click', () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isMuted = !audioTrack.enabled;
            const muteText = muteBtn.querySelector('span');
            if (muteText) {
                muteText.textContent = isMuted ? t('unmute') : t('mute');
                muteText.setAttribute('data-i18n', isMuted ? 'unmute' : 'mute');
            }
            muteBtn.style.background = isMuted ? '#ef4444' : '#6b7280';
        }
    }
});

// Ses seviyesi göstergesi (basit simülasyon)
setInterval(() => {
    if (localStream && !isMuted) {
        const randomLevel = Math.random() * 100;
        volumeLevel.style.width = randomLevel + '%';
    } else {
        volumeLevel.style.width = '0%';
    }
}, 100);
// Report Modal
reportBtn.addEventListener('click', () => {
    reportModal.style.display = 'block';
});

modalClose.addEventListener('click', () => {
    reportModal.style.display = 'none';
    clearReportForm();
});

cancelReport.addEventListener('click', () => {
    reportModal.style.display = 'none';
    clearReportForm();
});

window.addEventListener('click', (e) => {
    if (e.target === reportModal) {
        reportModal.style.display = 'none';
        clearReportForm();
    }
});

submitReport.addEventListener('click', () => {
    const selectedReason = document.querySelector('input[name="reportReason"]:checked');
    if (!selectedReason) {
        alert(translations[currentLang]['report-error']);
        return;
    }
    
    const reportData = {
        reason: selectedReason.value,
        details: reportDetails.value,
        timestamp: new Date().toISOString()
    };
    
    socket.emit('report-user', reportData);
    reportModal.style.display = 'none';
    clearReportForm();
    alert(translations[currentLang]['report-success']);
});

function clearReportForm() {
    const radios = document.querySelectorAll('input[name="reportReason"]');
    radios.forEach(radio => radio.checked = false);
    reportDetails.value = '';
}