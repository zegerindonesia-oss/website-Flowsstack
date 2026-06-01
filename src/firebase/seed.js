import { db } from './config';
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const products = [
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
        link: '/apps/flowstatement',
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
        name: 'FlowContent Studio',
        slug: 'flowcontent-studio',
        description: 'AI Content Generation Studio.',
        icon: 'movie',
        link: 'https://ai.studio/apps/b7db0509-947c-4718-9bd0-d544b5dcd5c7?fullscreenApplet=true',
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
