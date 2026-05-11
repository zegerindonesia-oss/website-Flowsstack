import { db } from './config';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const products = [
    {
        id: 'flowpict',
        name: 'FlowPict',
        slug: 'flowpict',
        description: 'AI-powered professional product photography.',
        icon: 'Image',
        link: '/apps/flowpict',
        price: 290000,
        status: 'active'
    },
    {
        id: 'flowstatement',
        name: 'FlowStatement',
        slug: 'flowstatement',
        description: 'Smart financial statement analysis and automation.',
        icon: 'Banknote',
        link: '/apps/flowstatement',
        price: 490000,
        status: 'active'
    },
    {
        id: 'haloflow',
        name: 'HaloFlow',
        slug: 'haloflow',
        description: 'Automasi Customer Service & Sales 24/7 menggunakan AI.',
        icon: 'SmartToy',
        link: '/products/haloflow/dashboard.html',
        price: 390000,
        status: 'active'
    }
];

export const seedProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        console.log("Seeding products...");
        for (const product of products) {
            await setDoc(doc(db, "products", product.id), product, { merge: true });
        }
        console.log("Products seeded successfully.");
    } catch (error) {
        console.error("Error seeding products:", error);
    }
};
