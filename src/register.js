import { registerWithEmail } from './firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Creating account...';
                
                await registerWithEmail(email, password, name);
                
                // Redirect to dashboard on success
                window.location.href = '/dashboard.html';
            } catch (error) {
                console.error("Registration failed:", error);
                alert(error.message || "Registration failed. Please try again.");
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            }
        });
    }
});
