// Socket.io bağlantısı
const socket = io();

// Translations
const translations = {
    tr: {
        findingMatch: 'Eşleşme aranıyor...',
        matched: '{country} Anonim kullanıcıyla eşleştin!',
        connecting: 'Bağlanıyor...',
        noUsersWaiting: 'Bekleyen kullanıcı yok',
        waitingForUser: 'Başka bir kullanıcı bekleniyor...',
        microphoneError: 'Mikrofona erişilemiyor. Lütfen izin verin.',
        connectionFailed: 'Bağlantı başarısız.',
        partnerLeft: 'Karşı taraf ayrıldı. Yeni eşleşme aranıyor...',
        callStarted: 'Görüşme başladı! 🎉',
        connected: 'Bağlı',
        connectionLost: 'Bağlantı kesildi. Yeni eşleşme aranıyor...',
        disconnected: 'Bağlantı Kesildi',
        subtitle: 'Rastgele Anonim Sesli Sohbet',
        joinBtn: 'Konuşmaya Başla',
        testMic: 'Mikrofonu Test Et',
        stopTest: '❌ Testi Durdur',
        muteOn: 'Sesi Kes',
        muteOff: 'Sesi Aç',
        endCall: 'Bitir & Yeni Bul',
        nextPerson: 'Sonraki Kişi',
        report: 'Kullanıcıyı Şikayet Et',
        msgPlaceholder: 'Mesaj yaz...',
        waiting: 'Bekle...',
        searching: 'Biri aranıyor...',
        countryLabel: '🌍 Ülkeni seç:',
        interestLabel: '🎯 İlgi alanını seç:',
        genderLabel: '👤 Ben:',
        prefLabel: '🔍 Arıyorum:',
        colorLabel: '🎨 Rengin:',
        everyone: 'Herkesle',
        notSpecified: 'Belirtmek istemiyorum',
    },
    en: {
        findingMatch: 'Finding a match...',
        matched: 'Matched with {country} anonymous user!',
        connecting: 'Connecting...',
        noUsersWaiting: 'No users waiting',
        waitingForUser: 'Waiting for another user...',
        microphoneError: 'Cannot access microphone. Please allow permission.',
        connectionFailed: 'Connection failed.',
        partnerLeft: 'Partner left. Finding new match...',
        callStarted: 'Call started! 🎉',
        connected: 'Connected',
        connectionLost: 'Connection lost. Finding new match...',
        disconnected: 'Disconnected',
        subtitle: 'Random Anonymous Voice Chat',
        joinBtn: 'Start Chatting',
        testMic: 'Test Microphone',
        stopTest: '❌ Stop Test',
        muteOn: 'Mute',
        muteOff: 'Unmute',
        endCall: 'End & Find New',
        nextPerson: 'Next Person',
        report: 'Report User',
        msgPlaceholder: 'Type a message...',
        waiting: 'Please wait...',
        searching: 'Looking for someone...',
        countryLabel: '🌍 Select country:',
        interestLabel: '🎯 Select interest:',
        genderLabel: '👤 I am:',
        prefLabel: '🔍 Looking for:',
        colorLabel: '🎨 Your color:',
        everyone: 'Everyone',
        notSpecified: 'Prefer not to say',
    },
    ar: {
        findingMatch: 'جارٍ البحث عن مطابقة...',
        matched: 'تم التطابق مع مستخدم مجهول من {country}!',
        connecting: 'جارٍ الاتصال...',
        noUsersWaiting: 'لا يوجد مستخدمون في الانتظار',
        waitingForUser: 'في انتظار مستخدم آخر...',
        microphoneError: 'لا يمكن الوصول إلى الميكروفون.',
        connectionFailed: 'فشل الاتصال.',
        partnerLeft: 'غادر الشريك. جارٍ البحث...',
        callStarted: 'بدأت المحادثة! 🎉',
        connected: 'متصل',
        connectionLost: 'انقطع الاتصال. جارٍ البحث...',
        disconnected: 'انقطع الاتصال',
        subtitle: 'دردشة صوتية عشوائية ومجهولة',
        joinBtn: 'ابدأ المحادثة',
        testMic: 'اختبار الميكروفون',
        stopTest: '❌ إيقاف الاختبار',
        muteOn: 'كتم الصوت',
        muteOff: 'تشغيل الصوت',
        endCall: 'إنهاء وإيجاد جديد',
        nextPerson: 'الشخص التالي',
        report: 'الإبلاغ عن المستخدم',
        msgPlaceholder: 'اكتب رسالة...',
        waiting: 'انتظر...',
        searching: 'جارٍ البحث...',
        countryLabel: '🌍 اختر الدولة:',
        interestLabel: '🎯 اختر الاهتمام:',
        genderLabel: '👤 أنا:',
        prefLabel: '🔍 أبحث عن:',
        colorLabel: '🎨 لونك:',
        everyone: 'الجميع',
        notSpecified: 'أفضل عدم الإفصاح',
    }
};

let currentLang = localStorage.getItem('lang') || 'tr';

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
const genderSelect = document.getElementById('genderSelect');
const genderPrefSelect = document.getElementById('genderPrefSelect');
const callTimer = document.getElementById('callTimer');
const timerDisplay = document.getElementById('timerDisplay');
const ageModal = document.getElementById('ageModal');
const waitingCounter = document.getElementById('waitingCounter');
const waitingCount = document.getElementById('waitingCount');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const shareBtn = document.getElementById('shareBtn');
const qualityBadge = document.getElementById('qualityBadge');
const emojiBar = document.getElementById('emojiBar');
const keyboardHint = document.getElementById('keyboardHint');
const videoSection = document.getElementById('videoSection');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const cameraBtn = document.getElementById('cameraBtn');
const typingIndicator = document.getElementById('typingIndicator');

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
let callTimerInterval = null;
let callSeconds = 0;
let remoteAudioContext = null;
let remoteAnalyser = null;
let blockedUsers = new Set();
let nextCooldown = false;
let qualityInterval = null;
let myColor = localStorage.getItem('my_color') || '#a78bfa';
let partnerColor = '#6b7280';
let typingTimeout = null;

// WebRTC yapılandırması (sunucudan TURN bilgisi alınır)
let configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};
// TURN config'i sunucudan al
fetch('/api/turn-config')
    .then(r => r.json())
    .then(data => { configuration = data; })
    .catch(() => {});


// ═══════════════════════════════════════
// 1. ZİL SESİ (Web Audio API)
// ═══════════════════════════════════════
function playMatchSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.12);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.24);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
}

// ═══════════════════════════════════════
// 2. TEMA GEÇİŞİ
// ═══════════════════════════════════════
let isDarkTheme = localStorage.getItem('theme') !== 'light';
function applyTheme() {
    if (isDarkTheme) {
        document.body.classList.remove('light-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀️';
    } else {
        document.body.classList.add('light-theme');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    }
}
applyTheme();
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        isDarkTheme = !isDarkTheme;
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        applyTheme();
    });
}

// ═══════════════════════════════════════
// 3. SİTEYİ PAYLAŞ
// ═══════════════════════════════════════
if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: 'Talkio - Sesli Sohbet',
            text: 'Talkio ile yabancılarla anonim sesli sohbet et! Ücretsiz & kayıtsız.',
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                const orig = shareBtn.textContent;
                shareBtn.textContent = '✅';
                setTimeout(() => { shareBtn.textContent = orig; }, 2000);
            }
        } catch(e) {}
    });
}

// ═══════════════════════════════════════
// 4. KLAVYE KISAYOLLARI
// ═══════════════════════════════════════
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (!remoteUserId) return;
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            muteBtn.click();
            break;
        case 'KeyN':
            if (!nextPersonBtn.classList.contains('hidden')) nextPersonBtn.click();
            break;
        case 'Escape':
            if (!endCallBtn.classList.contains('hidden')) endCallBtn.click();
            break;
    }
});

// ═══════════════════════════════════════
// 5. EMOJİ TEPKİLERİ
// ═══════════════════════════════════════
function showFloatingEmoji(emoji, fromMe) {
    const el = document.createElement('div');
    el.className = 'floating-emoji';
    el.textContent = emoji;
    const side = fromMe ? 0.05 : 0.55;
    el.style.left = (side * window.innerWidth + Math.random() * window.innerWidth * 0.35) + 'px';
    el.style.bottom = (80 + Math.random() * 60) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2000);
}

document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        if (!remoteUserId) return;
        const emoji = btn.textContent;
        showFloatingEmoji(emoji, true);
        socket.emit('emoji-reaction', { emoji });
    });
});

socket.on('emoji-reaction', (data) => {
    showFloatingEmoji(data.emoji, false);
});

// ═══════════════════════════════════════
// 6. BAĞLANTI KALİTESİ GÖSTERGESİ
// ═══════════════════════════════════════
function startQualityMonitor() {
    stopQualityMonitor();
    qualityInterval = setInterval(async () => {
        if (!peerConnection || !qualityBadge) return;
        try {
            const stats = await peerConnection.getStats();
            let rtt = null;
            stats.forEach(report => {
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                    if (report.currentRoundTripTime !== undefined) {
                        rtt = report.currentRoundTripTime * 1000;
                    }
                }
            });
            if (rtt === null) {
                qualityBadge.textContent = '';
            } else if (rtt < 120) {
                qualityBadge.style.color = '#34d399';
                qualityBadge.textContent = '📶 İyi';
            } else if (rtt < 350) {
                qualityBadge.style.color = '#fbbf24';
                qualityBadge.textContent = '📶 Orta';
            } else {
                qualityBadge.style.color = '#ef4444';
                qualityBadge.textContent = '📶 Zayıf';
            }
        } catch(e) {}
    }, 3000);
}
function stopQualityMonitor() {
    clearInterval(qualityInterval);
    qualityInterval = null;
    if (qualityBadge) qualityBadge.textContent = '';
}

// ═══════════════════════════════════════
// 7. KLAVYE İPUCU
// ═══════════════════════════════════════
function showKeyboardHint() {
    if (!keyboardHint) return;
    keyboardHint.classList.remove('hidden', 'fade-out');
    setTimeout(() => {
        keyboardHint.classList.add('fade-out');
        setTimeout(() => keyboardHint.classList.add('hidden'), 700);
    }, 4000);
}

// ═══════════════════════════════════════
// 0. DİL SİSTEMİ
// ═══════════════════════════════════════
function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    const isRtl = lang === 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    const T = translations[lang];
    // Subtitle
    const subtitle = document.querySelector('.subtitle');
    if (subtitle) subtitle.textContent = T.subtitle;
    // Butonlar
    const jBtn = document.querySelector('#joinBtn span');
    if (jBtn) jBtn.textContent = T.joinBtn;
    if (testMicBtn && !isTesting) testMicBtn.textContent = '🎙️ ' + T.testMic;
    const muteSpan = muteBtn ? muteBtn.querySelector('span') : null;
    if (muteSpan) muteSpan.textContent = isMuted ? T.muteOff : T.muteOn;
    const endSpan = endCallBtn ? endCallBtn.querySelector('span') : null;
    if (endSpan) endSpan.textContent = T.endCall;
    const nextSpan = nextPersonBtn ? nextPersonBtn.querySelector('span') : null;
    if (nextSpan && !nextCooldown) nextSpan.textContent = T.nextPerson;
    const repSpan = reportBtn ? reportBtn.querySelector('span') : null;
    if (repSpan) repSpan.textContent = T.report;
    if (chatInput) chatInput.placeholder = T.msgPlaceholder;
    // Etiketler
    const labels = document.querySelectorAll('.country-selector label');
    if (labels[0]) labels[0].textContent = T.countryLabel;
    const iLabels = document.querySelectorAll('.interest-selector label');
    if (iLabels[0]) iLabels[0].textContent = T.interestLabel;
    if (iLabels[1]) iLabels[1].textContent = T.genderLabel;
    if (iLabels[2]) iLabels[2].textContent = T.prefLabel;
    const cLabel = document.querySelector('.color-picker-row label');
    if (cLabel) cLabel.textContent = T.colorLabel;
    // Lang butonları
    document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
    });
}
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});
applyLang(currentLang);

// ═══════════════════════════════════════
// 8. RENK SEÇİCİ
// ═══════════════════════════════════════
function initColorPicker() {
    document.querySelectorAll('.swatch').forEach(swatch => {
        if (swatch.dataset.color === myColor) swatch.classList.add('active');
        swatch.addEventListener('click', () => {
            document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            myColor = swatch.dataset.color;
            localStorage.setItem('my_color', myColor);
        });
    });
}
initColorPicker();

// ═══════════════════════════════════════
// 9. TARAYICI BİLDİRİMİ
// ═══════════════════════════════════════
async function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission().catch(() => {});
    }
}
function showMatchNotification() {
    if (!document.hidden) return;
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Talkio 🎉 Eşleşme Bulundu!', {
            body: 'Yeni bir sohbet partnerin hazır, gel konuş!',
            icon: '/favicon.svg',
            tag: 'match'
        });
    }
}

// ═══════════════════════════════════════
// 10. AYRILIŞ SESİ
// ═══════════════════════════════════════
function playDisconnectSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
}

// ═══════════════════════════════════════
// 11. HTML ESCAPE (XSS koruması)
// ═══════════════════════════════════════
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Language functions
function t(key, params = {}) {
    let text = (translations.tr[key]) || key;
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
    // 18+ yaş doğrulama
    if (ageModal && !localStorage.getItem('age_verified')) {
        ageModal.style.display = 'block';
    }
    const ageConfirmBtn = document.getElementById('ageConfirmBtn');
    const ageDenyBtn = document.getElementById('ageDenyBtn');
    if (ageConfirmBtn) {
        ageConfirmBtn.addEventListener('click', () => {
            localStorage.setItem('age_verified', '1');
            if (ageModal) ageModal.style.display = 'none';
        });
    }
    if (ageDenyBtn) {
        ageDenyBtn.addEventListener('click', () => {
            window.location.href = 'https://www.google.com.tr';
        });
    }
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
        testMicBtn.textContent = '❌ Testi Durdur';
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
            micTestStatus.textContent = '✅ Mikrofon çalışıyor!';
                micTestStatus.style.color = '#34d399';
            } else if (percentage > 20) {
                micTestStatus.textContent = '🔊 Daha yüksek sesle konuş...';
                micTestStatus.style.color = '#fbbf24';
            } else {
                micTestStatus.textContent = '🎙️ Konuşarak test et...';
                micTestStatus.style.color = '#a78bfa';
            }
            
            requestAnimationFrame(updateMicLevel);
        }
        
        updateMicLevel();
        
    } catch (error) {
        console.error('Microphone test error:', error);
        micTestStatus.textContent = '❌ Mikrofon erişimi reddedildi';
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
    testMicBtn.textContent = '🎙️ Mikrofonu Test Et';
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
        requestNotificationPermission();
        socket.emit('join', { country: country, interest: interest, gender: genderSelect ? genderSelect.value : '', genderPref: genderPrefSelect ? genderPrefSelect.value : '', color: myColor });
        loginSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        
        // Otomatik olarak eşleşme ara
        startSearching();
    } else {
        alert('Lütfen ülkenizi seçin!');
    }
});

// Eşleşme aramaya başla
function startSearching() {
    if (isSearching) return;
    
    isSearching = true;
    matchingMessage.classList.remove('hidden');
    callStatus.textContent = '';
    connectionStatus.innerHTML = `🔄 <span>Eşleşme aranıyor...</span>`;
    
    socket.emit('find-match', { blocked: [...blockedUsers] });
}

// Eşleşme bulundu
socket.on('match-found', async (data) => {
    isSearching = false;
    remoteUserId = data.partnerId;
    matchingMessage.classList.add('hidden');
    playMatchSound();
    showMatchNotification();
    partnerColor = data.partnerColor || '#6b7280';
    
    // Partner detaylarını göster
    const partnerInfo = [];
    if (data.partnerCountry) partnerInfo.push(data.partnerCountry);
    if (data.partnerGender === 'male') partnerInfo.push('♂️ Male');
    else if (data.partnerGender === 'female') partnerInfo.push('♀️ Female');
    if (data.partnerInterest) partnerInfo.push(data.partnerInterest);
    const infoStr = partnerInfo.length ? partnerInfo.join(' · ') : 'Anonymous';
    callStatus.textContent = `✅ Matched! ${infoStr}`;
    callStatus.className = 'call-status calling';
    connectionStatus.innerHTML = `🟡 <span>${t('connecting')}</span>`;
    
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
    connectionStatus.innerHTML = `⏳ <span>Bekleyen kullanıcı yok</span>`;
    callStatus.textContent = 'Başka bir kullanıcı bekleniyor...';
    
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
        // Ses kalitesi optimizasyonu
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 48000
            },
            video: false
        });
        
        // PeerConnection oluştur
        createPeerConnection();
        
        // Local stream'i ekle
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        startLocalVolumeIndicator();
        
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
        if (emojiBar) emojiBar.classList.remove('hidden');
        startQualityMonitor();
        showKeyboardHint();
        
    } catch (error) {
        console.error('Mikrofon erişim hatası:', error);
        callStatus.textContent = 'Mikrofona erişilemiyor. Lütfen izin verin.';
        callStatus.className = 'call-status error';
        socket.emit('cancel-match');
        remoteUserId = null;
        setTimeout(() => startSearching(), 2000);
    }
}

// Offer alındığında
socket.on('offer', async (data) => {
    try {
        remoteUserId = data.sender;
        
        // Ses kalitesi optimizasyonu
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                sampleRate: 48000
            },
            video: false
        });
        
        // PeerConnection oluştur
        createPeerConnection();
        
        // Local stream'i ekle
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });

        startLocalVolumeIndicator();
        
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
        reportBtn.classList.remove('hidden');
        if (emojiBar) emojiBar.classList.remove('hidden');
        startQualityMonitor();
        showKeyboardHint();
        
    } catch (error) {
        console.error('Offer işleme hatası:', error);
        callStatus.textContent = 'Bağlantı başarısız.';
        callStatus.className = 'call-status error';
        endCall();
        setTimeout(() => startSearching(), 2000);
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
    playDisconnectSound();
    callStatus.textContent = 'Karşı taraf ayrıldı. Yeni eşleşme aranıyor...';
    callStatus.className = 'call-status error';
    endCall();
    setTimeout(() => startSearching(), 1500);
});

// Online kullanıcı sayısı güncellendi
socket.on('online-count', (count) => {
    onlineCount.textContent = count;
});

// Bekleme kuyruğu sayısı
socket.on('waiting-count', (count) => {
    if (waitingCount) waitingCount.textContent = count;
    if (waitingCounter) waitingCounter.style.display = count > 0 ? 'flex' : 'none';
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
        if (event.track.kind === 'audio') {
            remoteAudio.srcObject = event.streams[0];
            remoteAudio.play().catch(e => console.warn('Audio play failed:', e));
            callStatus.textContent = t('callStarted');
            callStatus.className = 'call-status connected';
            connectionStatus.innerHTML = `🟢 <span>Bağlı</span>`;
            startCallTimer();
        }
    };
    
    // Connection state değişikliği
    peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'disconnected' || 
            peerConnection.connectionState === 'failed') {
            callStatus.textContent = 'Bağlantı kesildi. Yeni eşleşme aranıyor...';
            endCall();
            startSearching();
        }
    };
}

// Aramayı sonlandır
function endCall() {
    stopCallTimer();
    stopLocalVolumeIndicator();
    if (remoteAudioContext) {
        remoteAudioContext.close().catch(() => {});
        remoteAudioContext = null;
        remoteAnalyser = null;
    }
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
    if (emojiBar) emojiBar.classList.add('hidden');
    if (typingIndicator) typingIndicator.classList.add('hidden');
    stopQualityMonitor();
    
    connectionStatus.innerHTML = `🔴 <span>Bağlantı Kesildi</span>`;
    
    remoteUserId = null;
    isMuted = false;
    muteBtn.innerHTML = '🎙️ <span>Sesi Kes</span>';
    muteBtn.style.background = '';
}

// Görüşmeyi bitir ve yeni kişi bul
endCallBtn.addEventListener('click', () => {
    socket.emit('end-call', { partnerId: remoteUserId });
    endCall();
    startSearching();
});

// Sonraki kişi (3 saniye cooldown)
nextPersonBtn.addEventListener('click', () => {
    if (nextCooldown) return;
    nextCooldown = true;
    nextPersonBtn.disabled = true;
    nextPersonBtn.textContent = '⏳ Bekle...';
    socket.emit('end-call', { partnerId: remoteUserId });
    endCall();
    startSearching();
    setTimeout(() => {
        nextCooldown = false;
        nextPersonBtn.disabled = false;
        nextPersonBtn.innerHTML = '⏭️ <span>Sonraki Kişi</span>';
    }, 3000);
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
    
    const color = isSent ? myColor : partnerColor;
    const time = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    messageDiv.innerHTML = `
        <span class="chat-avatar" style="background:${color}"></span>
        ${escapeHtml(message)}
        <span class="timestamp">${time}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Receive chat message
socket.on('chat-message', (data) => {
    addChatMessage(data.message, false);
});

// Mesaj engellendi (uygunsuz içerik)
socket.on('message-blocked', () => {
    const warn = document.createElement('div');
    warn.className = 'chat-message system-msg';
    warn.textContent = '⚠️ Mesajın uygunsuz içerik nedeniyle gönderilemedi.';
    warn.style.cssText = 'color:#ef4444;font-size:0.82em;padding:4px 12px;font-style:italic;';
    chatMessages.appendChild(warn);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => warn.remove(), 4000);
});

// Typing göstergesi
chatInput.addEventListener('input', () => {
    if (!remoteUserId || chatInput.value.trim() === '') return;
    socket.emit('typing');
});
socket.on('typing', () => {
    if (!typingIndicator) return;
    typingIndicator.classList.remove('hidden');
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => typingIndicator.classList.add('hidden'), 2200);
});

// Mikrofonu aç/kapat
muteBtn.addEventListener('click', () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            isMuted = !audioTrack.enabled;
        if (isMuted) {
            muteBtn.innerHTML = '🔇 <span>Sesi Aç</span>';
        } else {
            muteBtn.innerHTML = '🎙️ <span>Sesi Kes</span>';
        }
        }
    }
});

// Konuşma süresi
function startCallTimer() {
    callSeconds = 0;
    if (callTimer) callTimer.classList.remove('hidden');
    clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
        callSeconds++;
        const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
        const secs = String(callSeconds % 60).padStart(2, '0');
        if (timerDisplay) timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
}

function stopCallTimer() {
    clearInterval(callTimerInterval);
    callTimerInterval = null;
    if (callTimer) callTimer.classList.add('hidden');
    if (timerDisplay) timerDisplay.textContent = '00:00';
    callSeconds = 0;
}

// Kendi mikrofon ses seviyesi (gerçek)
let localVolumeRAF = null;
let localVolumeContext = null;
let localVolumeAnalyser = null;

function startLocalVolumeIndicator() {
    if (!localStream) return;
    try {
        if (localVolumeContext) { localVolumeContext.close().catch(() => {}); }
        localVolumeContext = new (window.AudioContext || window.webkitAudioContext)();
        localVolumeAnalyser = localVolumeContext.createAnalyser();
        const src = localVolumeContext.createMediaStreamSource(localStream);
        localVolumeAnalyser.fftSize = 256;
        src.connect(localVolumeAnalyser);
        const buf = new Uint8Array(localVolumeAnalyser.frequencyBinCount);
        function tick() {
            if (!localVolumeAnalyser) return;
            localVolumeAnalyser.getByteFrequencyData(buf);
            const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
            if (volumeLevel) volumeLevel.style.width = Math.min(100, (avg / 128) * 200) + '%';
            localVolumeRAF = requestAnimationFrame(tick);
        }
        tick();
    } catch (e) { console.warn('Local volume analyser error:', e); }
}

function stopLocalVolumeIndicator() {
    if (localVolumeRAF) cancelAnimationFrame(localVolumeRAF);
    localVolumeRAF = null;
    if (localVolumeContext) { localVolumeContext.close().catch(() => {}); localVolumeContext = null; }
    localVolumeAnalyser = null;
    if (volumeLevel) volumeLevel.style.width = '0%';
}
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