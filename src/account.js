import { subscribeToAuthChanges, logout } from './firebase/auth';
import { auth, db } from './firebase/config';
import { updateProfile, updatePassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profile-form');
    const passwordForm = document.getElementById('password-form');
    let currentUser = null;

    subscribeToAuthChanges((user) => {
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        currentUser = user;
        document.getElementById('acc-name').value = user.displayName || '';
        document.getElementById('acc-email').value = user.email || '';
    });

    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newName = document.getElementById('acc-name').value;
            const btn = profileForm.querySelector('button');

            try {
                btn.disabled = true;
                btn.textContent = 'Saving...';

                // Update Firebase Auth Profile
                await updateProfile(auth.currentUser, { displayName: newName });

                // Update Firestore User Doc
                const userRef = doc(db, "users", currentUser.uid);
                await updateDoc(userRef, { displayName: newName });

                alert('Profile updated successfully!');
            } catch (error) {
                console.error("Error updating profile:", error);
                alert('Failed to update profile.');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Save Changes';
            }
        });
    }

    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nPass = document.getElementById('new-password').value;
            const btn = passwordForm.querySelector('button');

            if (!nPass) return;

            try {
                btn.disabled = true;
                btn.textContent = 'Updating...';
                await updatePassword(auth.currentUser, nPass);
                alert('Password updated successfully!');
                document.getElementById('new-password').value = '';
            } catch (error) {
                console.error("Error updating password:", error);
                alert(error.message || 'Failed to update password. You may need to login again.');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Update Password';
            }
        });
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => logout());
    }
});
