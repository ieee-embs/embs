document.addEventListener('DOMContentLoaded', () => {
    // Pagination for Blog Page
    const blogGrid = document.querySelector('.blog-grid');
    const prevButton = document.querySelector('.page-button.prev');
    const nextButton = document.querySelector('.page-button.next');
    const pageNumber = document.querySelector('.page-number');
    
    if (blogGrid) { // Ensure we're on the blog page
        let currentPage = 1;
        const postsPerPage = 4;
        const blogPosts = Array.from(document.querySelectorAll('.blog-card'));

        function displayPosts(page) {
            const start = (page - 1) * postsPerPage;
            const end = start + postsPerPage;
            
            blogPosts.forEach((post, index) => {
                post.style.display = (index >= start && index < end) ? 'block' : 'none';
            });

            pageNumber.textContent = page;
            prevButton.disabled = page === 1;
            nextButton.disabled = end >= blogPosts.length;
        }

        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                displayPosts(currentPage);
                window.scrollTo({ top: blogGrid.offsetTop - 100, behavior: 'smooth' });
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage < Math.ceil(blogPosts.length / postsPerPage)) {
                currentPage++;
                displayPosts(currentPage);
                window.scrollTo({ top: blogGrid.offsetTop - 100, behavior: 'smooth' });
            }
        });

        displayPosts(currentPage);
    }

    // Smooth Scrolling for Hero Buttons
    const readBlogsButton = document.querySelector('.read-blogs');
    const blogSection = document.querySelector('#blog-posts');

    if (readBlogsButton) {
        readBlogsButton.addEventListener('click', (e) => {
            e.preventDefault();
            blogSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Modal Handling for Registration Form
    const openModalButton = document.querySelector('#openRegisterModal');
    const closeModalButton = document.querySelector('#closeRegisterModal');
    const registerModal = document.querySelector('#registerModal');

    if (openModalButton) {
        openModalButton.addEventListener('click', () => {
            registerModal.style.display = 'flex';
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            registerModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside the modal content
    window.addEventListener('click', (e) => {
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

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

        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                togglePassword.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
    }
});

