import './style.css';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from './firebase/auth';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    easing: 'ease-out-cubic'
});

// DOM Elements
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const form = document.getElementById('auth-form');
const nameField = document.getElementById('field-name-container');
const btnSubmit = document.getElementById('btn-submit');
const errorDiv = document.getElementById('auth-error');
const googleBtn = document.getElementById('google-login-btn');

let isRegisterMode = false;

// State Management
function toggleMode(register) {
    isRegisterMode = register;
    errorDiv.classList.add('hidden'); // Clear errors

    const activeClasses = ['text-primary', 'border-primary', 'bg-white/20'];
    const inactiveClasses = ['text-gray-400', 'border-transparent'];

    if (isRegisterMode) {
        // Switch to Register (Active)
        tabRegister.classList.add(...activeClasses);
        tabRegister.classList.remove(...inactiveClasses);

        // Login becomes Inactive
        tabLogin.classList.remove(...activeClasses);
        tabLogin.classList.add(...inactiveClasses);

        // Show Name Field
        nameField.classList.remove('hidden');
        nameField.classList.add('block'); // Ensure it displays
        document.getElementById('input-name').required = true;
        btnSubmit.textContent = 'Create Account';
    } else {
        // Switch to Login (Active)
        tabLogin.classList.add(...activeClasses);
        tabLogin.classList.remove(...inactiveClasses);

        // Register becomes Inactive
        tabRegister.classList.remove(...activeClasses);
        tabRegister.classList.add(...inactiveClasses);

        // Hide Name Field
        nameField.classList.remove('block');
        nameField.classList.add('hidden');
        document.getElementById('input-name').required = false;
        btnSubmit.textContent = 'Sign In';
    }
}

// Event Listeners
tabLogin.addEventListener('click', () => toggleMode(false));
tabRegister.addEventListener('click', () => toggleMode(true));

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.classList.add('hidden');

    const email = document.getElementById('input-email').value;
    const password = document.getElementById('input-password').value;
    const name = document.getElementById('input-name').value;

    const originalBtnText = btnSubmit.textContent;
    btnSubmit.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">refresh</span> Processing...';
    btnSubmit.disabled = true;

    try {
        if (isRegisterMode) {
            await registerWithEmail(email, password, name);
        } else {
            await loginWithEmail(email, password);
        }
        // Redirect
        window.location.href = '/';
    } catch (error) {
        console.error(error);
        let msg = "Authentication failed. Please check your credentials.";
        if (error.code === 'auth/email-already-in-use') msg = "Email is already registered.";
        if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
        if (error.code === 'auth/user-not-found') msg = "User not found. Please register.";
        if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";

        errorDiv.textContent = msg;
        errorDiv.classList.remove('hidden');
        btnSubmit.textContent = originalBtnText;
        btnSubmit.disabled = false;
    }
});

// Google Login
googleBtn.addEventListener('click', async () => {
    try {
        const originalText = googleBtn.innerHTML;
        googleBtn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">refresh</span> Connecting...';
        googleBtn.disabled = true;

        await loginWithGoogle();
        window.location.href = '/';
    } catch (error) {
        console.error("Google Login User Cancelled or Failed", error);
        googleBtn.innerHTML = '<img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5"> Google';
        googleBtn.disabled = false;
    }
});
