import { subscribeToAuthChanges, logout } from '../../src/firebase/auth';
import { db } from '../../src/firebase/config';
import { collection, query, where, getDocs, doc, getDoc, setDoc, onSnapshot, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';

let currentUser = null;
let activeChatId = null;
let chatUnsubscribe = null;
let msgUnsubscribe = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication & Access Control
    initAuth();

    // 2. UI Navigation Logic
    initNavigation();

    // 3. Setup Panels
    initKnowledgeBase();
    initWAHAIntegration();
});

function initAuth() {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const avatarEl = document.getElementById('sidebar-avatar');
        const emailEl = document.getElementById('sidebar-email');
        if(user.email) {
            if(emailEl) emailEl.textContent = user.email;
            if(avatarEl) avatarEl.src = `https://ui-avatars.com/api/?name=${user.email.charAt(0)}&background=9333EA&color=fff`;
        }

        // Verify product access (HaloFlow)
        try {
            const q = query(collection(db, "user_products"), where("user_id", "==", user.uid), where("product_id", "==", "haloflow"));
            const snapshot = await getDocs(q);
            if (snapshot.empty) {
                // User doesn't own HaloFlow
                alert("Anda belum memiliki akses ke HaloFlow. Silakan lakukan pembelian terlebih dahulu.");
                window.location.href = '/dashboard.html';
                return;
            }
            
            // If passed, set global user and init data
            currentUser = user;
            initSettings();
            initInbox();
            initMessageInput();
        } catch (error) {
            console.error("Access check failed:", error);
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Keluar dari sistem?')) {
                await logout();
                window.location.href = '/login.html';
            }
        });
    }
}

function initNavigation() {
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const panels = document.querySelectorAll('.panel-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target');
            if (!targetId) return; // Ignore if no target (like logout)

            e.preventDefault();

            // Update Active State on Sidebar
            sidebarItems.forEach(i => i.classList.remove('active', 'bg-purple-50', 'text-brand-purple', 'font-semibold'));
            item.classList.add('active', 'bg-purple-50', 'text-brand-purple', 'font-semibold');

            // Show corresponding panel
            panels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.remove('hidden');
                    // Add slight fade in animation
                    panel.classList.add('animate-fade-in');
                } else {
                    panel.classList.add('hidden');
                    panel.classList.remove('animate-fade-in');
                }
            });

            // Update Header Title based on the clicked item's text
            const textSpan = item.querySelector('.menu-text');
            if (textSpan) {
                document.getElementById('header-title').textContent = textSpan.textContent;
            }
        });
    });
}

function initKnowledgeBase() {
    const gdriveBtn = document.getElementById('btn-connect-gdrive');
    if (gdriveBtn) {
        gdriveBtn.addEventListener('click', () => {
            // Simulated OAuth flow
            gdriveBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span> Connecting...';
            setTimeout(() => {
                gdriveBtn.innerHTML = '<span class="material-symbols-outlined text-green-500">check_circle</span> Connected to Google Drive';
                gdriveBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
                gdriveBtn.classList.add('bg-white', 'text-slate-800', 'border', 'border-slate-200');
                gdriveBtn.disabled = true;

                document.getElementById('gdrive-status').classList.remove('hidden');
            }, 2000);
        });
    }
}

function initWAHAIntegration() {
    const wahaConnectBtn = document.getElementById('btn-connect-waha');
    const qrContainer = document.getElementById('waha-qr-container');
    
    // We assume backend runs on localhost:3000 for local dev
    // In production, this would be the actual SumoPod backend domain
    const BACKEND_URL = 'http://localhost:3000/api/waha';

    async function getAuthHeaders() {
        if (!currentUser) return {};
        // Get Firebase ID token
        const token = await currentUser.getIdToken();
        // Fallback x-mock-uid for local testing without Firebase Admin
        return { 
            'Authorization': `Bearer ${token}`,
            'x-mock-uid': currentUser.uid 
        };
    }

    if (wahaConnectBtn) {
        wahaConnectBtn.addEventListener('click', async () => {
            if (!currentUser) return;
            
            qrContainer.classList.remove('hidden');
            qrContainer.innerHTML = '<div class="text-sm text-slate-500 animate-pulse">Requesting WAHA Server...</div>';
            
            try {
                const headers = await getAuthHeaders();
                const res = await fetch(`${BACKEND_URL}/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...headers }
                });
                const data = await res.json();
                
                if (data.status === 'CONNECTED') {
                    qrContainer.innerHTML = `
                        <div class="flex flex-col items-center justify-center p-6 text-green-600 bg-green-50 rounded-xl border border-green-100 w-full h-full">
                            <span class="material-symbols-outlined text-5xl mb-2">check_circle</span>
                            <h4 class="font-bold text-lg text-center">WhatsApp Terhubung!</h4>
                        </div>
                    `;
                    wahaConnectBtn.classList.add('hidden');
                } else if (data.status === 'AWAITING_QR' && data.qr) {
                    // QR Code is a base64 string
                    qrContainer.innerHTML = `<img src="${data.qr}" alt="Scan Me" class="w-full h-full object-contain">`;
                    
                    // Poll for status every 3 seconds
                    const pollInterval = setInterval(async () => {
                        try {
                            const statusRes = await fetch(`${BACKEND_URL}/status`, { headers });
                            const statusData = await statusRes.json();
                            if (statusData.status === 'CONNECTED') {
                                clearInterval(pollInterval);
                                qrContainer.innerHTML = `
                                    <div class="flex flex-col items-center justify-center p-6 text-green-600 bg-green-50 rounded-xl border border-green-100 w-full h-full">
                                        <span class="material-symbols-outlined text-5xl mb-2">check_circle</span>
                                        <h4 class="font-bold text-lg text-center">WhatsApp Terhubung!</h4>
                                    </div>
                                `;
                                wahaConnectBtn.classList.add('hidden');
                            }
                        } catch(e) {}
                    }, 3000);
                } else {
                    qrContainer.innerHTML = `<div class="text-sm text-red-500 text-center">${data.message || 'Waiting for QR...'}</div>`;
                }
            } catch (error) {
                console.error("WAHA Proxy Error:", error);
                qrContainer.innerHTML = '<div class="text-sm text-red-500 text-center font-bold">Gagal terhubung ke Backend Proxy. Pastikan Backend berjalan.</div>';
            }
        });
    }
}

async function initSettings() {
    if (!currentUser) return;
    
    const form = document.getElementById('personality-form');
    if (!form) return;

    const botNameInput = form.querySelector('input[type="text"]');
    const systemPromptInput = form.querySelector('textarea');
    const submitBtn = form.querySelector('button[type="submit"]');

    // 1. Load existing settings
    try {
        const docRef = doc(db, 'haloflow_settings', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.botName) botNameInput.value = data.botName;
            if (data.systemPrompt) systemPromptInput.value = data.systemPrompt;
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }

    // 2. Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
        
        try {
            await setDoc(doc(db, 'haloflow_settings', currentUser.uid), {
                botName: botNameInput.value,
                systemPrompt: systemPromptInput.value,
                updatedAt: new Date()
            }, { merge: true });
            
            submitBtn.textContent = 'Saved!';
            submitBtn.classList.remove('bg-brand-purple', 'hover:bg-purple-700');
            submitBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                submitBtn.classList.add('bg-brand-purple', 'hover:bg-purple-700');
                submitBtn.disabled = false;
            }, 2000);
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("Gagal menyimpan pengaturan.");
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// --- LIVE INBOX LOGIC ---

function initInbox() {
    if (!currentUser) return;

    const chatListContainer = document.getElementById('chat-list-container');
    if (!chatListContainer) return;

    const q = query(
        collection(db, 'haloflow_chats'),
        where('user_id', '==', currentUser.uid),
        orderBy('updatedAt', 'desc')
    );

    if (chatUnsubscribe) chatUnsubscribe();

    chatUnsubscribe = onSnapshot(q, (snapshot) => {
        const chats = [];
        snapshot.forEach(doc => chats.push({ id: doc.id, ...doc.data() }));
        renderChatList(chats);
    });
}

function renderChatList(chats) {
    const container = document.getElementById('chat-list-container');
    if (!container) return;

    if (chats.length === 0) {
        container.innerHTML = '<div class="p-6 text-center text-slate-400 text-sm">Belum ada percakapan.</div>';
        return;
    }

    container.innerHTML = chats.map(chat => {
        const isActive = activeChatId === chat.id;
        const time = chat.updatedAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
        
        // Determine status tag color
        let tagClass = 'tag-green'; // Default: AI balas otomatis
        if (chat.status === 'NEEDS_HELP') tagClass = 'tag-red';
        if (chat.status === 'MANUAL') tagClass = 'bg-slate-100 text-slate-600 border-slate-200';

        const statusLabel = chat.status === 'NEEDS_HELP' ? 'AI butuh bantuan' : 
                           chat.status === 'MANUAL' ? 'AI dimatikan' : 'AI balas otomatis';

        return `
            <div class="p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-all ${isActive ? 'bg-purple-50/50 border-l-4 border-l-brand-purple' : ''}" 
                 onclick="selectChat('${chat.id}', '${chat.customerName || chat.customerNumber}', '${chat.customerNumber}')">
                <div class="flex justify-between items-start mb-1">
                    <span class="font-bold text-slate-900">${chat.customerName || chat.customerNumber}</span>
                    <span class="text-[10px] text-slate-400">${time}</span>
                </div>
                <div class="text-xs text-slate-500 truncate mb-2">${chat.lastMessage || '...'}</div>
                <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-medium border ${tagClass}">${statusLabel}</span>
                </div>
            </div>
        `;
    }).join('');
}

window.selectChat = function(chatId, name, number) {
    activeChatId = chatId;
    
    // Update active state in UI
    initInbox(); // Re-render list to show active highlight

    // Update Header
    document.getElementById('active-chat-name').textContent = name;
    document.getElementById('active-chat-number').textContent = number;
    
    // Show messages
    loadMessages(chatId);
};

function loadMessages(chatId) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = '<div class="flex items-center justify-center h-full"><span class="material-symbols-outlined animate-spin text-slate-300">autorenew</span></div>';

    const q = query(
        collection(db, 'haloflow_messages'),
        where('chat_id', '==', chatId),
        orderBy('createdAt', 'asc')
    );

    if (msgUnsubscribe) msgUnsubscribe();

    msgUnsubscribe = onSnapshot(q, (snapshot) => {
        const messages = [];
        snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
        renderMessages(messages);
    });
}

function renderMessages(messages) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    if (messages.length === 0) {
        container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-sm">Mulai percakapan...</div>';
        return;
    }

    container.innerHTML = messages.map(msg => {
        const isBot = msg.role === 'assistant' || msg.role === 'bot';
        const isSystem = msg.role === 'system';
        
        if (isSystem) {
            return `<div class="flex justify-center my-4"><span class="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] rounded-full font-medium border border-slate-200 uppercase tracking-wider">${msg.content}</span></div>`;
        }

        return `
            <div class="flex ${isBot ? 'justify-start' : 'justify-end'} mb-4">
                <div class="max-w-[80%] ${isBot ? 'chat-ai' : 'chat-user'} p-3 shadow-sm">
                    <div class="text-sm">${msg.content}</div>
                    <div class="text-[10px] ${isBot ? 'text-purple-100' : 'text-slate-400'} mt-1 text-right">${msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''}</div>
                </div>
            </div>
        `;
    }).join('');

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function initMessageInput() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-button');

    if (!input || !sendBtn) return;

    const handleSend = async () => {
        const content = input.value.trim();
        if (!content || !activeChatId) return;

        input.value = '';
        
        try {
            // Add message to Firestore
            await addDoc(collection(db, 'haloflow_messages'), {
                chat_id: activeChatId,
                content: content,
                role: 'assistant', // Manual takeover is assistant role
                type: 'text',
                createdAt: serverTimestamp()
            });

            // Update chat's last message and status to MANUAL if it was NEEDS_HELP
            await setDoc(doc(db, 'haloflow_chats', activeChatId), {
                lastMessage: content,
                updatedAt: serverTimestamp(),
                status: 'MANUAL' 
            }, { merge: true });

        } catch (error) {
            console.error("Gagal mengirim pesan:", error);
            alert("Gagal mengirim pesan.");
        }
    };

    sendBtn.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}
