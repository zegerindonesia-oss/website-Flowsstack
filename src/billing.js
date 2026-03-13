import { subscribeToAuthChanges } from './firebase/auth';
import { db } from './firebase/config';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        loadPurchaseHistory(user.uid);
    });
});

async function loadPurchaseHistory(uid) {
    const tableBody = document.getElementById('purchase-history-body');

    try {
        const q = query(
            collection(db, "purchases"),
            where("user_id", "==", uid),
            orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        if (snap.empty) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-10 text-center text-gray-500">No purchases found yet.</td>
                </tr>
            `;
            return;
        }

        let html = '';
        snap.forEach(doc => {
            const data = doc.data();
            const date = data.createdAt?.toDate() ? data.createdAt.toDate().toLocaleDateString() : 'Pending';

            html += `
                <tr class="hover:bg-white/30 transition-colors">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <span class="font-bold text-gray-800">${data.product_name || data.product_id}</span>
                        </div>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded-full text-xs font-bold ${data.payment_status === 'success' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}">
                            ${data.payment_status.toUpperCase()}
                        </span>
                    </td>
                    <td class="px-6 py-4 font-bold">Rp ${data.amount.toLocaleString()}</td>
                    <td class="px-6 py-4 text-gray-500">${date}</td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;

    } catch (error) {
        console.error("Error loading history:", error);
        tableBody.innerHTML = `<tr><td colspan="4" class="px-6 py-10 text-center text-red-500">Error loading data.</td></tr>`;
    }
}
