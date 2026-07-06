import { subscribeToAuthChanges } from './firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const token = await user.getIdToken();
        localStorage.setItem('fs_token', token);

        const ok = await verifyAdminStatus(token);
        if(!ok) {
            document.getElementById('unauthorized-block').classList.remove('hidden');
            document.getElementById('admin-tabs-container').classList.add('hidden');
            return;
        }

        // Initialize view tab
        window.switchTab('users');

        // Fetch data
        loadAdminUsers(token);
        loadAdminSubscriptions(token);
        loadAdminPayments(token);
        loadAdminProjects(token);
    });
});

async function verifyAdminStatus(token) {
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        return response.ok;
    } catch(e) {
        return false;
    }
}

async function loadAdminUsers(token) {
    const tbody = document.getElementById('users-table-body');
    if(!tbody) return;

    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        tbody.innerHTML = data.map(u => {
            const date = new Date(u.createdAt).toLocaleDateString('id-ID');
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-bold text-slate-800">${u.name || 'Anonymous'}</td>
                    <td class="p-4 font-mono text-gray-500">${u.email}</td>
                    <td class="p-4"><span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}">${u.role}</span></td>
                    <td class="p-4 text-gray-400">${date}</td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-red-500 font-bold">Gagal memuat data user</td></tr>';
    }
}

async function loadAdminSubscriptions(token) {
    const tbody = document.getElementById('subs-table-body');
    if(!tbody) return;

    try {
        const res = await fetch('/api/admin/subscriptions', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        tbody.innerHTML = data.map(s => {
            const ends = s.endsAt ? new Date(s.endsAt).toLocaleDateString('id-ID') : '--';
            const isActive = s.status === 'active';
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono text-gray-500 max-w-[120px] truncate" title="${s.userId}">${s.userId}</td>
                    <td class="p-4 font-semibold text-slate-800">${s.planId}</td>
                    <td class="p-4 font-mono">${s.billingCycle}</td>
                    <td class="p-4 text-gray-400">${ends}</td>
                    <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${s.status}</span>
                    </td>
                    <td class="p-4">
                        <button onclick="toggleSubscriptionStatus('${s.id}', '${s.status}')" class="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-[10px] font-bold rounded transition-all">
                            ${isActive ? 'Deactivate' : 'Activate'}
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-500 font-bold">Gagal memuat data langganan</td></tr>';
    }
}

window.toggleSubscriptionStatus = async function(subId, currentStatus) {
    const token = localStorage.getItem('fs_token');
    const newStatus = currentStatus === 'active' ? 'expired' : 'active';
    
    if (confirm(`Ubah status langganan menjadi ${newStatus}?`)) {
        try {
            const response = await fetch(`/api/admin/subscriptions/${subId}/toggle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                alert('Status langganan diperbarui.');
                loadAdminSubscriptions(token);
            } else {
                alert('Gagal memperbarui status.');
            }
        } catch(e) {
            console.error(e);
            alert('Request failed.');
        }
    }
}

async function loadAdminPayments(token) {
    const tbody = document.getElementById('payments-table-body');
    if(!tbody) return;

    try {
        const res = await fetch('/api/admin/payments', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        tbody.innerHTML = data.map(p => {
            const paid = p.paidAt ? new Date(p.paidAt).toLocaleDateString('id-ID') : '--';
            const isPaid = p.status === 'paid';
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono text-gray-500 truncate max-w-[120px]" title="${p.id}">${p.id}</td>
                    <td class="p-4 font-mono text-gray-400 truncate max-w-[120px]" title="${p.userId}">${p.userId}</td>
                    <td class="p-4 font-bold text-slate-800">${p.planId}</td>
                    <td class="p-4 font-semibold text-slate-700">Rp ${p.amount.toLocaleString('id-ID')}</td>
                    <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold ${isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${p.status}</span>
                    </td>
                    <td class="p-4 text-gray-400">${paid}</td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-500 font-bold">Gagal memuat data pembayaran</td></tr>';
    }
}

async function loadAdminProjects(token) {
    const tbody = document.getElementById('projects-grid'); // wait, the ID in HTML table is projects-table-body
    const tableBody = document.getElementById('projects-table-body');
    if(!tableBody) return;

    try {
        const res = await fetch('/api/admin/projects', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();

        tableBody.innerHTML = data.map(pr => {
            return `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="p-4 font-mono text-gray-500 truncate max-w-[120px]" title="${pr.id}">${pr.id}</td>
                    <td class="p-4 font-mono text-gray-400 truncate max-w-[120px]" title="${pr.userId}">${pr.userId}</td>
                    <td class="p-4 font-bold text-slate-800">${pr.name}</td>
                    <td class="p-4 font-semibold text-cyan-600">/p/${pr.slug}</td>
                    <td class="p-4 font-medium uppercase text-gray-500">${pr.category || 'General'}</td>
                    <td class="p-4 text-gray-400">${pr.theme || 'modern'}</td>
                    <td class="p-4">
                        <span class="px-2 py-0.5 rounded text-[10px] uppercase font-bold ${pr.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}">${pr.isPublished ? 'Yes' : 'No'}</span>
                    </td>
                </tr>
            `;
        }).join('');
    } catch(e) {
        tableBody.innerHTML = '<tr><td colspan="7" class="p-4 text-center text-red-500 font-bold">Gagal memuat data project</td></tr>';
    }
}
