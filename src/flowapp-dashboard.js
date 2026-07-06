import { subscribeToAuthChanges } from './firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
            return;
        }

        // Save Token to LocalStorage for API Calls
        const token = await user.getIdToken();
        localStorage.setItem('fs_token', token);

        // Update UI info
        const userNameEl = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');
        if (userNameEl) userNameEl.textContent = user.displayName || 'User';
        if (userEmailEl) userEmailEl.textContent = user.email;

        // Verify Subscription
        const subActive = await checkFlowAppSubscription(token);
        if (!subActive) {
            document.getElementById('unsubscribed-notice').classList.remove('hidden');
            document.getElementById('workspace-content').classList.add('hidden');
            return;
        }

        // Load project lists & templates
        loadProjects(token);
        loadTemplates(token);
    });
});

async function checkFlowAppSubscription(token) {
    try {
        const response = await fetch('/api/billing/subscription', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const sub = await response.json();
        
        if (sub.active) {
            const badge = document.getElementById('tier-badge');
            if (badge) {
                badge.textContent = sub.planId.replace('flowapp-', '').toUpperCase();
                if (sub.planId === 'flowapp-lite') badge.className = "text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 font-extrabold uppercase";
                if (sub.planId === 'flowapp-pro') badge.className = "text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-extrabold uppercase";
                if (sub.planId === 'flowapp-cloud') badge.className = "text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-extrabold uppercase";
            }
            return true;
        }
        return false;
    } catch (e) {
        console.error('Subscription verification failed:', e);
        return false;
    }
}

async function loadProjects(token) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    try {
        const response = await fetch('/api/flowapp/projects', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const projects = await response.json();
        
        // Update Limits Tracker
        const limits = getPlanLimitsForTier(document.getElementById('tier-badge').textContent.toLowerCase());
        const count = projects.length;
        document.getElementById('limit-text').textContent = `${count} / ${limits === -1 ? 'Unlimited' : limits} Project`;
        const percentage = limits === -1 ? 0 : Math.min((count / limits) * 100, 100);
        document.getElementById('limit-bar').style.width = `${percentage}%`;

        if (projects.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-white p-8">
                    <span class="material-symbols-outlined text-[48px] text-gray-300 mb-4 font-light">terminal</span>
                    <h3 class="font-heading text-lg font-bold mb-1">Belum ada project</h3>
                    <p class="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Klik tombol 'Buat Project Baru' di atas untuk melahirkan aplikasi AI pertamamu.</p>
                    <button onclick="openCreateModal()" class="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-md transition-all">Buat Project Sekarang</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = projects.map(proj => {
            const dateStr = new Date(proj.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            return `
                <div class="glass-card p-6 rounded-2xl flex flex-col justify-between h-full bg-white transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 font-extrabold uppercase rounded-lg">${proj.category}</span>
                            <span class="text-xs text-gray-400 font-bold">${dateStr}</span>
                        </div>
                        <h3 class="font-heading font-bold text-lg text-gray-900 mb-2 leading-snug">${proj.name}</h3>
                        <p class="text-gray-500 text-xs line-clamp-2 mb-6">${proj.description || 'Tidak ada deskripsi'}</p>
                    </div>

                    <div class="flex items-center gap-3">
                        <a href="/dashboard/flowapp/editor.html?id=${proj.id}" class="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center font-bold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10">
                            <span class="material-symbols-outlined text-[16px]">edit</span> Edit Code
                        </a>
                        ${proj.isPublished ? `
                            <a href="/p/${proj.slug}" target="_blank" class="px-3 py-2.5 border border-emerald-500 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all" title="Buka Live App">
                                <span class="material-symbols-outlined text-[18px]">launch</span>
                            </a>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

    } catch (e) {
        console.error('Failed to load projects:', e);
        grid.innerHTML = '<div class="col-span-full py-10 text-center text-red-500 font-bold">Failed to load projects.</div>';
    }
}

function getPlanLimitsForTier(tier) {
    if (tier === 'lite') return 20;
    if (tier === 'pro') return 100;
    if (tier === 'cloud') return -1;
    return 0;
}

async function loadTemplates(token) {
    const grid = document.getElementById('templates-grid');
    if (!grid) return;

    try {
        const response = await fetch('/api/flowapp/templates', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const templates = await response.json();

        grid.innerHTML = templates.map(temp => {
            return `
                <div class="glass-card flex flex-col justify-between h-full bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl transition-all">
                    <img src="${temp.previewImage}" class="w-full h-44 object-cover object-center bg-gray-100 border-b border-gray-100" alt="Preview">
                    <div class="p-6 flex-1 flex flex-col justify-between">
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-800 font-extrabold uppercase rounded">${temp.category}</span>
                                ${temp.isPremium ? `<span class="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-800 font-extrabold uppercase rounded">Premium</span>` : ''}
                            </div>
                            <h3 class="font-heading font-bold text-lg text-gray-900 mb-2 leading-snug">${temp.name}</h3>
                            <p class="text-gray-500 text-xs mb-6 line-clamp-3">${temp.description}</p>
                        </div>
                        <button onclick="useTemplatePrompt('${temp.id}')" class="w-full py-2.5 border border-cyan-600 hover:bg-cyan-50 text-cyan-600 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-1.5">
                            <span class="material-symbols-outlined text-[16px]">bolt</span> Gunakan Prompt
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (e) {
        console.error('Failed to load templates:', e);
        grid.innerHTML = '<div class="col-span-full text-center text-gray-500">Failed to load templates.</div>';
    }
}

window.useTemplatePrompt = function(templateId) {
    // Open project modal and prefill prompt description if available
    openCreateModal();
    // Fetch template details to prefill description
    fetch('/api/flowapp/templates', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('fs_token') }
    }).then(res => res.json()).then(templates => {
        const temp = templates.find(t => t.id === templateId);
        if(temp) {
            document.getElementById('new-proj-name').value = temp.name;
            document.getElementById('new-proj-desc').value = temp.promptTemplate;
            document.getElementById('new-proj-category').value = temp.category;
        }
    });
}

window.handleCreateProject = async function(e) {
    e.preventDefault();
    const token = localStorage.getItem('fs_token');
    
    const name = document.getElementById('new-proj-name').value;
    const category = document.getElementById('new-proj-category').value;
    const theme = document.getElementById('new-proj-theme').value;
    const description = document.getElementById('new-proj-desc').value;

    try {
        const response = await fetch('/api/flowapp/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ name, category, theme, description })
        });

        const data = await response.json();
        if(response.ok) {
            closeCreateModal();
            // Redirect straight to editor with the prompt
            window.location.href = `/dashboard/flowapp/editor.html?id=${data.id}&autogenerate=true`;
        } else {
            alert('Gagal membuat project: ' + (data.error || 'Unknown error'));
        }
    } catch(err) {
        console.error(err);
        alert('Server connection failed.');
    }
}
