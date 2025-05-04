try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
} catch (error) {
    console.error("Error initializing firebase", error);
}

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminLoginMessage = document.getElementById('adminLoginMessage');

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;

            if (email && password) {
                auth.signInWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                         //  Check if the user is an admin.
                        isAdmin(user).then(isAdminUser => {
                            if(isAdminUser){
                                adminLoginMessage.textContent = 'Login successful! Redirecting...';
                                adminLoginMessage.style.color = '#007bff';
                                window.location.href = 'moderate.html'; // Redirect to moderate.html
                            }
                            else{
                                adminLoginMessage.textContent = 'You are not authorized to access this page';
                                adminLoginMessage.style.color = '#e53e3e';
                                auth.signOut();
                            }
                        })
                       
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        adminLoginMessage.textContent = 'Error: ' + errorMessage;
                        adminLoginMessage.style.color = '#e53e3e';
                    });
            } else {
                adminLoginMessage.textContent = 'Please fill in all fields.';
                adminLoginMessage.style.color = '#e53e3e';
            }
        });
    }
    function isAdmin(user) {
        //  Replace this with your actual admin check.
        //  This is just a placeholder.
        //  You might check for a specific email, a custom claim, or a role in a database.
        if (user.email === "sharmassujal@gmail.com") { //Replace with your email.
            return Promise.resolve(true); //  Promise
        } else {
           return Promise.resolve(false);
        }
    }

    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('adminPassword');

    if (togglePassword) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }
});