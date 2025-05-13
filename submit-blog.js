document.addEventListener('DOMContentLoaded', () => {
    // Form Elements
    const authForm = document.getElementById('authForm');
    const authContainer = document.getElementById('authContainer');
    const blogForm = document.getElementById('blogSubmissionForm');
    const authTitle = document.getElementById('authTitle');
    const authButton = document.getElementById('authButton');
    const authSwitch = document.getElementById('authSwitch');
    const switchToSignup = document.getElementById('switchToSignup');
    const nameGroup = document.getElementById('nameGroup');
    const usnGroup = document.getElementById('usnGroup');
    const errorMessage = document.getElementById('errorMessage');
    const passwordToggle = document.getElementById('passwordToggle');
    const blogTitleInput = document.getElementById('blogTitle');
    const writerNameInput = document.getElementById('writerName');
    const thumbnailLinkInput = document.getElementById('thumbnailLink');
    const blogContentInput = document.getElementById('blogContent');
    const userEmailInput = document.getElementById('userEmail');
    const titleCharCounter = document.getElementById('titleCharCounter');
    const submissionMessage = document.getElementById('submissionMessage');
    const submitButton = document.getElementById('submitButton');
    const logoutButton = document.getElementById('logoutButton');
    const previewTitle = document.getElementById('previewTitle');
    const previewContent = document.getElementById('previewContent');
    const previewThumbnail = document.getElementById('previewThumbnail');

    // Google Apps Script URL (replace with your deployed web app URL)
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwM0xnrgklpt7uiBgfrHHX-woGrKZQLlq1D2E9_f6XfVQkiSSMi7tiTrZgpe-LpNA14/exec';

    // Check if user is already logged in
    if (sessionStorage.getItem('userEmail')) {
        authContainer.classList.add('hidden');
        blogForm.classList.remove('hidden');
        writerNameInput.value = sessionStorage.getItem('userName') || '';
        userEmailInput.value = sessionStorage.getItem('userEmail');
    }

    // Toggle Sign In/Sign Up
    let isSignIn = true;
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        isSignIn = !isSignIn;
        authTitle.textContent = isSignIn ? 'Sign In' : 'Sign Up';
        authButton.textContent = isSignIn ? 'Sign In' : 'Sign Up';
        authSwitch.innerHTML = isSignIn
            ? `Don't have an account? <a href="#" id="switchToSignup">Sign Up</a>`
            : `Already have an account? <a href="#" id="switchToSignup">Sign In</a>`;
        nameGroup.classList.toggle('hidden', isSignIn);
        usnGroup.classList.toggle('hidden', isSignIn);
        errorMessage.style.display = 'none';
    });

    // Password Visibility Toggle
    passwordToggle.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        passwordToggle.textContent = isPassword ? '🙈' : '👁️';
    });

    // Authentication Form Submission
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.style.display = 'none';
        authButton.disabled = true;
        authButton.classList.add('loading');
        authButton.textContent = isSignIn ? 'Signing In...' : 'Signing Up...';

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const name = document.getElementById('name').value;
        const usn = document.getElementById('usn').value;

        try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: isSignIn ? 'login' : 'signup',
                    email,
                    password,
                    name: isSignIn ? '' : name,
                    usn: isSignIn ? '' : usn
                })
            });

            const result = await response.json();

            if (result.success) {
                if (isSignIn) {
                    sessionStorage.setItem('userEmail', email);
                    sessionStorage.setItem('userName', result.name);
                    authContainer.classList.add('hidden');
                    blogForm.classList.remove('hidden');
                    writerNameInput.value = result.name;
                    userEmailInput.value = email;
                } else {
                    errorMessage.textContent = 'Account created! Please sign in.';
                    errorMessage.style.color = '#34d399';
                    errorMessage.style.display = 'block';
                    switchToSignup.click(); // Switch to sign-in mode
                }
            } else {
                errorMessage.textContent = result.message || 'An error occurred.';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = 'Network error. Please try again.';
            errorMessage.style.display = 'block';
        } finally {
            authButton.disabled = false;
            authButton.classList.remove('loading');
            authButton.textContent = isSignIn ? 'Sign In' : 'Sign Up';
        }
    });

    // Blog Form Live Preview
    blogTitleInput.addEventListener('input', () => {
        const title = blogTitleInput.value || 'Your title will appear here...';
        previewTitle.textContent = title;
        titleCharCounter.textContent = `${blogTitleInput.value.length}/100`;
    });

    blogContentInput.addEventListener('input', () => {
        const content = blogContentInput.value || 'Your content will appear here as you type...';
        previewContent.textContent = content;
    });

    thumbnailLinkInput.addEventListener('input', () => {
        const url = thumbnailLinkInput.value;
        if (url) {
            previewThumbnail.src = url;
            previewThumbnail.classList.remove('hidden');
        } else {
            previewThumbnail.classList.add('hidden');
        }
    });

    // Blog Form Submission (Formspree)
    blogForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        submissionMessage.textContent = '';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Submitting...';

        const formData = new FormData(blogForm);

        try {
            const response = await fetch(blogForm.action, {
                method: blogForm.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submissionMessage.style.color = '#34d399';
                submissionMessage.textContent = 'Your blog has been submitted successfully!';
                blogForm.reset();
                previewTitle.textContent = 'Your title will appear here...';
                previewContent.textContent = 'Your content will appear here as you type...';
                previewThumbnail.classList.add('hidden');
                titleCharCounter.textContent = '0/100';
                writerNameInput.value = sessionStorage.getItem('userName') || '';
                userEmailInput.value = sessionStorage.getItem('userEmail');
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Form submission failed.');
            }
        } catch (error) {
            submissionMessage.style.color = '#f87171';
            submissionMessage.textContent = 'Something went wrong. Try again later.';
        } finally {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.textContent = 'Submit Blog';
        }
    });

    // Logout Functionality
    logoutButton.addEventListener('click', () => {
        sessionStorage.clear();
        authContainer.classList.remove('hidden');
        blogForm.classList.add('hidden');
        authForm.reset();
        errorMessage.style.display = 'none';
        isSignIn = true;
        authTitle.textContent = 'Sign In';
        authButton.textContent = 'Sign In';
        authSwitch.innerHTML = `Don't have an account? <a href="#" id="switchToSignup">Sign Up</a>`;
        nameGroup.classList.add('hidden');
        usnGroup.classList.add('hidden');
    });
});