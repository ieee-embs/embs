// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDOlq4QFi-xTjO0hMFF_BvzsK1xtoJT_hs",
    authDomain: "embs-database.firebaseapp.com",
    projectId: "embs-database",
    storageBucket: "embs-database.firebasestorage.app",
    messagingSenderId: "790422485014",
    appId: "1:790422485014:web:a7125c64bd626a83dedd37",
    measurementId: "G-8ZMJ1XVMN1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const registerFormContainer = document.querySelector('#registerFormContainer');
const loginFormContainer = document.querySelector('#loginFormContainer');
const switchToLogin = document.querySelector('#switchToLogin');
const switchToRegister = document.querySelector('#switchToRegister');
const registrationForm = document.querySelector('#registrationForm');
const registrationMessage = document.querySelector('#registrationMessage');
const loginForm = document.querySelector('#loginForm');
const loginMessage = document.querySelector('#loginMessage');
const registerButton = registrationForm.querySelector('.auth-button');
const loginButton = loginForm.querySelector('.auth-button');

// Redirect if already logged in
auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'blog.html';
    }
});

// Switch between Forms
switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    registrationMessage.textContent = ''; // Clear messages when switching
    loginMessage.textContent = '';
});

switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    registerFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';
    registrationMessage.textContent = ''; // Clear messages when switching
    loginMessage.textContent = '';
});

// Registration Form Handling
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#registerEmail').value;
    const password = document.querySelector('#registerPassword').value;

    // Disable button and show loading state
    registerButton.disabled = true;
    registerButton.textContent = 'Registering...';
    registrationMessage.textContent = '';

    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            const user = userCredential.user;
            return db.collection('users').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        })
        .then(() => {
            registrationMessage.textContent = 'Registration successful! Redirecting...';
            registrationMessage.style.color = '#007bff';
            registrationForm.reset();
            setTimeout(() => {
                window.location.href = 'blog.html';
            }, 1000);
        })
        .catch(error => {
            registrationMessage.textContent = error.message;
            registrationMessage.style.color = '#e53e3e';
        })
        .finally(() => {
            // Re-enable button
            registerButton.disabled = false;
            registerButton.textContent = 'Register';
        });
});

// Login Form Handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('#loginEmail').value;
    const password = document.querySelector('#loginPassword').value;

    // Disable button and show loading state
    loginButton.disabled = true;
    loginButton.textContent = 'Logging in...';
    loginMessage.textContent = '';

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            loginMessage.textContent = 'Login successful! Redirecting...';
            loginMessage.style.color = '#007bff';
            loginForm.reset();
            setTimeout(() => {
                window.location.href = 'blog.html';
            }, 1000);
        })
        .catch(error => {
            loginMessage.textContent = error.message;
            loginMessage.style.color = '#e53e3e';
        })
        .finally(() => {
            // Re-enable button
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        });
});

// Password Toggle Functionality for Both Forms
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
togglePasswordButtons.forEach(button => {
    button.addEventListener('click', () => {
        const formType = button.getAttribute('data-form');
        const passwordInput = document.querySelector(`#${formType}Password`);
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        button.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
});