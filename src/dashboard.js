import { subscribeToAuthChanges, logout } from './firebase/auth';
import { db } from './firebase/config';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { seedProducts } from './firebase/seed';

document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        // Update UI
        document.getElementById('user-name').textContent = user.displayName || 'User';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('welcome-name').textContent = (user.displayName || 'User').split(' ')[0];

        // Seed products if needed
        await seedProducts();

        // Fetch User Products (Ownership)
        loadUserProducts(user.uid);
    });

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to logout?')) {
                await logout();
                window.location.href = '/login.html';
            }
        });
    }
});

async function loadUserProducts(uid) {
    const appsGrid = document.getElementById('apps-grid');
    const activeAppsCount = document.getElementById('active-apps-count');
    const totalSpend = document.getElementById('total-spend');

    try {
        // Get all products first
        const productsSnap = await getDocs(collection(db, "products"));
        const allProducts = [];
        productsSnap.forEach(doc => allProducts.push({ id: doc.id, ...doc.data() }));

        // Get user owned products
        const ownedQuery = query(collection(db, "user_products"), where("user_id", "==", uid));

        onSnapshot(ownedQuery, (ownedSnap) => {
            const ownedProductIds = [];
            ownedSnap.forEach(doc => ownedProductIds.push(doc.data().product_id));

            activeAppsCount.textContent = ownedProductIds.length;

            // Render Apps Grid
            appsGrid.innerHTML = allProducts.map(product => {
                const isOwned = ownedProductIds.includes(product.id);

                return `
                    <div class="glass-card p-6 rounded-2xl flex flex-col h-full transform transition-all hover:-translate-y-1 hover:shadow-xl ${!isOwned ? 'opacity-90' : ''}">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="size-14 rounded-xl ${isOwned ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center">
                                <span class="material-symbols-outlined text-[32px]">${product.icon}</span>
                            </div>
                            <div>
                                <h3 class="font-bold text-lg">${product.name}</h3>
                                <span class="text-xs px-2 py-0.5 rounded-full ${isOwned ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 font-bold'} uppercase">
                                    ${isOwned ? 'Active' : 'Not Purchased'}
                                </span>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mb-6 flex-1">${product.description}</p>
                        
                        ${isOwned ? `
                            <a href="${product.link}" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2">
                                Open App
                                <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
                            </a>
                        ` : `
                            <a href="/billing.html?product=${product.id}" class="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-3 rounded-xl text-center transition-all flex items-center justify-center gap-2">
                                Buy Access
                                <span class="material-symbols-outlined text-[18px]">shopping_cart</span>
                            </a>
                        `}
                    </div>
                `;
            }).join('');
        });

        // Mock Spend (should come from purchases table)
        // totalSpend.textContent = 'Rp 0';

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        appsGrid.innerHTML = '<div class="col-span-full py-10 text-center text-red-500 font-bold">Failed to load apps. Please refresh the page.</div>';
    }
}
