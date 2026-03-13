import { subscribeToAuthChanges } from '../firebase/auth';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

/**
 * Checks if the current user owns a specific product.
 * @param {string} productSlug - The slug of the product to check (e.g., 'flowpict').
 * @returns {Promise<boolean>} - True if owned, false otherwise.
 */
export async function checkProductOwnership(uid, productSlug) {
    try {
        const q = query(
            collection(db, "user_products"),
            where("user_id", "==", uid),
            where("product_id", "==", productSlug)
        );
        const snap = await getDocs(q);
        return !snap.empty;
    } catch (error) {
        console.error("Error checking ownership:", error);
        return false;
    }
}

/**
 * Middleware-like function to protect app pages.
 * @param {string} productSlug 
 */
export function protectApp(productSlug) {
    subscribeToAuthChanges(async (user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }

        const isOwned = await checkProductOwnership(user.uid, productSlug);
        if (!isOwned) {
            // Show purchase required message or redirect
            document.body.innerHTML = `
                <div class="min-h-screen bg-[#f8f7fa] flex items-center justify-center p-6 text-center">
                    <div class="max-w-md w-full bg-white p-10 rounded-[32px] shadow-xl border border-gray-100">
                        <div class="size-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span class="material-symbols-outlined text-5xl">lock</span>
                        </div>
                        <h1 class="text-2xl font-bold mb-4">Access Restricted</h1>
                        <p class="text-gray-500 mb-8">Please purchase access to use this tool.</p>
                        <div class="flex flex-col gap-3">
                            <a href="/billing.html?product=${productSlug}" class="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-purple-200 transition-all transform hover:-translate-y-1">
                                Buy Access
                            </a>
                            <a href="/dashboard.html" class="w-full text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all">
                                Back to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            `;
            // Add Material Symbols if not present
            if (!document.querySelector('link[href*="Material+Symbols"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap';
                document.head.appendChild(link);
            }
        }
    });
}
