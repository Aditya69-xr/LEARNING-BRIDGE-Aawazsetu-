// AawazSetu Authentication Logic
// Powered by NEURONEXSIS

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('aawazsetu_session')) {
        window.location.href = 'index.html';
        return;
    }

    // Initialize forms
    setupForms();
});

// --- Tab Switching Logic ---
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const tabLogin = document.getElementById('tabLogin');
    const tabSignup = document.getElementById('tabSignup');
    const indicator = document.getElementById('tabIndicator');
    const title = document.getElementById('formTitle');
    const subtitle = document.getElementById('formSubtitle');
    const formContainer = loginForm.parentElement;

    if (tab === 'login') {
        // Update tabs styling
        tabLogin.classList.remove('text-gray-400', 'hover:text-gray-600');
        tabLogin.classList.add('text-primary');
        tabSignup.classList.remove('text-primary');
        tabSignup.classList.add('text-gray-400', 'hover:text-gray-600');
        indicator.style.transform = 'translateX(0)';

        // Update texts
        title.textContent = 'Welcome back';
        subtitle.textContent = 'Please enter your details to sign in.';

        // Transition forms
        signupForm.classList.remove('active', 'translate-x-0', 'opacity-100');
        signupForm.classList.add('translate-x-full', 'opacity-0', 'pointer-events-none');
        
        loginForm.classList.remove('-translate-x-full', 'opacity-0', 'pointer-events-none');
        loginForm.classList.add('active', 'translate-x-0', 'opacity-100');
        loginForm.style.pointerEvents = 'auto';

        // Adjust container height
        formContainer.style.height = `${loginForm.offsetHeight}px`;

    } else {
        // Update tabs styling
        tabSignup.classList.remove('text-gray-400', 'hover:text-gray-600');
        tabSignup.classList.add('text-primary');
        tabLogin.classList.remove('text-primary');
        tabLogin.classList.add('text-gray-400', 'hover:text-gray-600');
        indicator.style.transform = 'translateX(100%)';

        // Update texts
        title.textContent = 'Create an account';
        subtitle.textContent = 'Join AawazSetu today.';

        // Transition forms
        loginForm.classList.remove('active', 'translate-x-0', 'opacity-100');
        loginForm.classList.add('-translate-x-full', 'opacity-0', 'pointer-events-none');
        
        signupForm.classList.remove('translate-x-full', 'opacity-0', 'pointer-events-none');
        signupForm.classList.add('active', 'translate-x-0', 'opacity-100');
        signupForm.style.pointerEvents = 'auto';

        // Adjust container height
        setTimeout(() => {
            formContainer.style.height = `${signupForm.offsetHeight}px`;
        }, 50); // slight delay to allow display computation
    }
    
    // Clear errors when switching
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

// Initial height adjustment
window.addEventListener('load', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm && loginForm.parentElement) {
        loginForm.parentElement.style.height = `${loginForm.offsetHeight}px`;
        loginForm.parentElement.style.transition = 'height 0.3s ease-in-out';
    }
});

// --- Password Visibility Toggle ---
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('ph-eye');
        icon.classList.add('ph-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('ph-eye-slash');
        icon.classList.add('ph-eye');
    }
}

// --- Password Strength ---
function checkPasswordStrength() {
    const val = document.getElementById('signupPassword').value;
    const bars = document.getElementById('strengthBar').children;
    const text = document.getElementById('strengthText');
    
    // Reset
    Array.from(bars).forEach(bar => {
        bar.className = 'h-full flex-1 rounded-full bg-gray-200 transition-colors duration-300';
    });
    
    if (!val) {
        text.textContent = 'Password strength';
        text.className = 'text-[10px] text-gray-500 ml-1 mt-1';
        return;
    }

    let strength = 0;
    if (val.length >= 8) strength += 1;
    if (val.match(/[a-z]/) && val.match(/[A-Z]/)) strength += 1;
    if (val.match(/\d/) || val.match(/[^a-zA-Z\d]/)) strength += 1;

    if (strength === 1) {
        bars[0].classList.replace('bg-gray-200', 'bg-red-500');
        text.textContent = 'Weak';
        text.classList.replace('text-gray-500', 'text-red-500');
        text.classList.replace('text-yellow-500', 'text-red-500');
        text.classList.replace('text-green-500', 'text-red-500');
    } else if (strength === 2) {
        bars[0].classList.replace('bg-gray-200', 'bg-yellow-400');
        bars[1].classList.replace('bg-gray-200', 'bg-yellow-400');
        text.textContent = 'Good';
        text.classList.replace('text-gray-500', 'text-yellow-500');
        text.classList.replace('text-red-500', 'text-yellow-500');
        text.classList.replace('text-green-500', 'text-yellow-500');
    } else if (strength === 3) {
        bars[0].classList.replace('bg-gray-200', 'bg-green-500');
        bars[1].classList.replace('bg-gray-200', 'bg-green-500');
        bars[2].classList.replace('bg-gray-200', 'bg-green-500');
        text.textContent = 'Strong';
        text.classList.replace('text-gray-500', 'text-green-500');
        text.classList.replace('text-red-500', 'text-green-500');
        text.classList.replace('text-yellow-500', 'text-green-500');
    }
}

// --- Form Validation & Submission ---
function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Remove error class on input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.closest('.input-group').classList.remove('input-error');
        });
    });

    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const group = input.closest('.input-group');
    const msgEl = group.querySelector('.error-msg');
    
    if (message) msgEl.textContent = message;
    
    group.classList.remove('shake');
    void group.offsetWidth; // trigger reflow
    group.classList.add('input-error', 'shake');
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showToast(title, message, isError = false) {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');
    const iconWrapper = toast.querySelector('div');
    const icon = iconWrapper.querySelector('i');
    
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    
    if (isError) {
        iconWrapper.className = 'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600';
        icon.className = 'ph ph-x-circle text-xl';
        toast.classList.replace('border-green-100', 'border-red-100');
    } else {
        iconWrapper.className = 'w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600';
        icon.className = 'ph ph-check-circle text-xl';
        toast.classList.replace('border-red-100', 'border-green-100');
    }
    
    toast.classList.add('toast-visible');
    
    setTimeout(() => {
        toast.classList.remove('toast-visible');
    }, 3000);
}

function handleSignup(e) {
    e.preventDefault();
    
    let isValid = true;
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const age = parseInt(document.getElementById('signupAge').value);
    const password = document.getElementById('signupPassword').value;

    // Validate Name
    if (name.length < 2) {
        showError('signupName', 'Name must be at least 2 characters.');
        isValid = false;
    }

    // Validate Email
    if (!isValidEmail(email)) {
        showError('signupEmail', 'Please enter a valid email.');
        isValid = false;
    }

    // Validate Age
    if (isNaN(age) || age < 5 || age > 100) {
        showError('signupAge', 'Age must be between 5 and 100.');
        isValid = false;
    }

    // Validate Password
    if (password.length < 8) {
        showError('signupPassword', 'Password must be at least 8 characters.');
        isValid = false;
    }

    if (!isValid) return;

    // Check existing users
    let users = JSON.parse(localStorage.getItem('aawazsetu_users') || '[]');
    if (users.find(u => u.email === email)) {
        showError('signupEmail', 'Email already in use.');
        return;
    }

    // Save user
    const newUser = { id: Date.now(), name, email, age, password };
    users.push(newUser);
    localStorage.setItem('aawazsetu_users', JSON.stringify(users));

    // Success
    showToast('Account created!', 'Welcome to AawazSetu.');
    
    // Auto login
    setTimeout(() => {
        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email };
        localStorage.setItem('aawazsetu_session', JSON.stringify(sessionUser));
        window.location.href = 'index.html';
    }, 1500);
}

function handleLogin(e) {
    e.preventDefault();
    
    let isValid = true;
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Validate
    if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email.');
        isValid = false;
    }

    if (!password) {
        showError('loginPassword', 'Password is required.');
        isValid = false;
    }

    if (!isValid) return;

    // Check credentials
    let users = JSON.parse(localStorage.getItem('aawazsetu_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        showToast('Login successful!', 'Redirecting...');
        setTimeout(() => {
            const sessionUser = { id: user.id, name: user.name, email: user.email };
            localStorage.setItem('aawazsetu_session', JSON.stringify(sessionUser));
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showError('loginPassword', 'Invalid email or password.');
        showError('loginEmail', 'Invalid email or password.');
        showToast('Login failed', 'Please check your credentials.', true);
    }
}
