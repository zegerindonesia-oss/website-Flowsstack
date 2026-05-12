const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedHaloFlow() {
    const uid = '2fTfQeeFboUdo0SRqYe5PSvb3692'; // zeger.indonesia@gmail.com
    
    const chats = [
        {
            user_id: uid,
            customerName: 'Zuhal',
            customerNumber: '628561697983',
            lastMessage: 'Halo, saya mau tanya harga paket.',
            status: 'NEEDS_HELP',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        {
            user_id: uid,
            customerName: 'Budi Santoso',
            customerNumber: '628123456789',
            lastMessage: 'Sama-sama mas.',
            status: 'AUTO',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
    ];

    for (const chat of chats) {
        const chatRef = await db.collection('haloflow_chats').add(chat);
        
        // Add some messages
        await db.collection('haloflow_messages').add({
            chat_id: chatRef.id,
            role: 'user',
            content: 'Halo, saya mau tanya harga paket.',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        await db.collection('haloflow_messages').add({
            chat_id: chatRef.id,
            role: 'system',
            content: 'AI menganalisa pesan...',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    console.log("HaloFlow test data seeded!");
}

seedHaloFlow();
