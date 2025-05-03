document.addEventListener('DOMContentLoaded', () => {
    // Existing code...

    // Registration Form Handling
    const registrationForm = document.querySelector('#registrationForm');
    const registrationMessage = document.querySelector('#registrationMessage');

    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.querySelector('#registerEmail').value;
            const password = document.querySelector('#registerPassword').value;

            if (email && password) {
                registrationMessage.textContent = 'Registration successful! Welcome aboard!';
                registrationMessage.style.color = '#007bff';
                registrationForm.reset();
            } else {
                registrationMessage.textContent = 'Please fill in all fields.';
                registrationMessage.style.color = '#e53e3e';
            }
        });

        // Password Toggle Functionality
        const togglePassword = document.querySelector('.toggle-password');
        const passwordInput = document.querySelector('#registerPassword');

        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }
});