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
    }
];

export const seedProducts = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (querySnapshot.empty) {
            console.log("Seeding products...");
            for (const product of products) {
                await setDoc(doc(db, "products", product.id), product);
            }
            console.log("Products seeded successfully.");
        } else {
            console.log("Products already exist, skipping seed.");
        }
    } catch (error) {
        console.error("Error seeding products:", error);
    }
};
