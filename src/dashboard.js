import { subscribeToAuthChanges, logout } from './firebase/auth';
import { db } from './firebase/config';
import { collection, query, where, getDocs, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { seedProducts } from './firebase/seed';

// Local Fallback Products List to ensure dashboard always renders
const localProducts = [
    {
        id: 'flowpict',
        name: 'FlowPict Premium',
        slug: 'flowpict',
        description: 'AI-powered professional product photography.',
        icon: 'image',
        link: 'https://gemini.google.com/share/ac8efd3572bc',
        price: 290000,
        status: 'active'
    },
    {
        id: 'flowstatement',
        name: 'FlowStatement',
        slug: 'flowstatement',
        description: 'Smart financial statement analysis and automation.',
        icon: 'payments',
        link: 'https://script.google.com/macros/s/AKfycbyLhgARMn5-UspEFNftpwywT0wWTV_GXBWy_R26ScM7xtUhWlqHg2bGkN-rBi9fsGaP/exec',
        price: 490000,
        status: 'active'
    },
    {
        id: 'haloflow',
        name: 'HaloFlow',
        slug: 'haloflow',
        description: 'Automasi Customer Service & Sales 24/7 menggunakan AI.',
        icon: 'smart_toy',
        link: '/products/haloflow/dashboard.html',
        price: 390000,
        status: 'active'
    },
    {
        id: 'flowpict-fb',
        name: 'Flowpict F&B',
        slug: 'flowpict-fb',
        description: 'AI photography for Food & Beverage.',
        icon: 'restaurant',
        link: 'https://gemini.google.com/share/8fa30b7740c8',
        price: 290000,
        status: 'active'
    },
    {
        id: 'flowcontent-studio',
        name: 'FlowContent',
        slug: 'flowcontent-studio',
        description: 'AI Video Content Factory - Automate creation & publishing of social media videos.',
        icon: 'movie',
        link: '/apps/flowcontent/',
        price: 390000,
        status: 'active'
    },
    {
        id: 'flowapp',
        name: 'FlowApp Workspace',
        slug: 'flowapp',
        description: 'Generate Google Apps Script + Sheets + HTML apps dengan AI secara instan.',
        icon: 'terminal',
        link: '/dashboard/flowapp/index.html',
        price: 199000,
        status: 'active'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    // Auth Check
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        // Update UI
        const userNameEl = document.getElementById('user-name');
        const userEmailEl = document.getElementById('user-email');
        const welcomeNameEl = document.getElementById('welcome-name');

        if (userNameEl) userNameEl.textContent = user.displayName || 'User';
        if (userEmailEl) userEmailEl.textContent = user.email;
        if (welcomeNameEl) welcomeNameEl.textContent = (user.displayName || 'User').split(' ')[0];

        // Seed products if needed (wrapped in try-catch so it won't crash)
        try {
            await seedProducts();
        } catch (e) {
            console.warn("⚠️ Failed to seed Firestore products:", e.message);
        }

        const token = await user.getIdToken();
        localStorage.setItem('fs_token', token);

        // Fetch User Products (Ownership)
        loadUserProducts(user.uid, token, user.email);

        // Auto-setup for owner (wrapped in try-catch)
        if (user.email === 'zeger.indonesia@gmail.com' || user.email === 'weebeeone@gmail.com') {
            try {
                setupOwnerAccess(user.uid);
            } catch (e) {
                console.warn("⚠️ Owner auto-setup in Firestore failed:", e.message);
            }
        }
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

async function loadUserProducts(uid, token, email) {
    const appsGrid = document.getElementById('apps-grid');
    const activeAppsCount = document.getElementById('active-apps-count');

    if (!appsGrid) return;

    // Check if logged in user is admin by email
    const isAdmin = email === 'zeger.indonesia@gmail.com' || email === 'weebeeone@gmail.com';

    try {
        // Check FlowApp active subscription from SQL backend
        let flowappSubscribed = false;
        if (token) {
            try {
                const subRes = await fetch('/api/billing/subscription', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const subData = await subRes.json();
                flowappSubscribed = subData.active === true;
            } catch (e) {
                console.error('Failed to fetch subscription status from API:', e);
            }
        }

        // Get all products first (with local products as fallback)
        let allProducts = [...localProducts];
        try {
            const productsSnap = await getDocs(collection(db, "products"));
            const dbProducts = [];
            productsSnap.forEach(doc => dbProducts.push({ id: doc.id, ...doc.data() }));
            if (dbProducts.length > 0) {
                allProducts = dbProducts;
            }
        } catch (dbErr) {
            console.warn("⚠️ Firestore failed to retrieve products collection, using local fallback:", dbErr.message);
        }

        // Helper function to render Grid UI
        const renderGrid = (ownedProductIds) => {
            // Admin automatically owns all products
            if (isAdmin) {
                allProducts.forEach(p => {
                    if (!ownedProductIds.includes(p.id)) {
                        ownedProductIds.push(p.id);
                    }
                });
            }

            if (activeAppsCount) activeAppsCount.textContent = ownedProductIds.length;

            appsGrid.innerHTML = allProducts.map(product => {
                const isOwned = isAdmin || ownedProductIds.includes(product.id);

                return `
                    <div class="glass-card p-6 rounded-2xl flex flex-col h-full transform transition-all hover:-translate-y-1 hover:shadow-xl ${!isOwned ? 'opacity-90' : ''}">
                        <div class="flex items-center gap-4 mb-6">
                            <div class="size-14 rounded-xl ${isOwned ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'} flex items-center justify-center">
                                <span class="material-symbols-outlined text-[32px]">${product.icon || 'terminal'}</span>
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
                            <a href="${product.link}" ${product.link.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''} class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2">
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
        };

        // Get user owned products from Firestore (with try-catch for permission checks)
        try {
            const ownedQuery = query(collection(db, "user_products"), where("user_id", "==", uid));
            onSnapshot(ownedQuery, (ownedSnap) => {
                const ownedProductIds = [];
                ownedSnap.forEach(doc => ownedProductIds.push(doc.data().product_id));

                if (flowappSubscribed && !ownedProductIds.includes('flowapp')) {
                    ownedProductIds.push('flowapp');
                }

                renderGrid(ownedProductIds);
            }, (snapshotErr) => {
                console.warn("⚠️ onSnapshot error, falling back to static render:", snapshotErr.message);
                const fallbackIds = flowappSubscribed ? ['flowapp'] : [];
                renderGrid(fallbackIds);
            });
        } catch (queryErr) {
            console.warn("⚠️ Firestore query error, falling back to static render:", queryErr.message);
            const fallbackIds = flowappSubscribed ? ['flowapp'] : [];
            renderGrid(fallbackIds);
        }

    } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Fallback render to prevent total blank page block
        appsGrid.innerHTML = '<div class="col-span-full py-10 text-center text-red-500 font-bold">Failed to load apps. Please refresh the page.</div>';
    }
}

async function setupOwnerAccess(uid) {
    try {
        await setDoc(doc(db, "users", uid), { role: 'admin', updatedAt: new Date() }, { merge: true });
        
        const products = ['flowpict', 'flowstatement', 'haloflow', 'flowpict-fb', 'flowcontent-studio'];
        for (const pid of products) {
            await setDoc(doc(db, "user_products", `${uid}_${pid}`), {
                user_id: uid,
                product_id: pid,
                grantedAt: new Date()
            }, { merge: true });
        }
        console.log("Owner access granted successfully.");
    } catch (error) {
        console.error("Error setting up owner access:", error);
    }
}
