// Form Elements
const blogTitleInput = document.getElementById('blogTitle');
const writerNameInput = document.getElementById('writerName');
const userEmailInput = document.getElementById('userEmail');
const thumbnailLinkInput = document.getElementById('thumbnailLink');
const blogContentInput = document.getElementById('blogContent');
const previewTitle = document.getElementById('previewTitle');
const previewContent = document.getElementById('previewContent');
const titleCharCounter = document.getElementById('titleCharCounter');
const submissionMessage = document.getElementById('submissionMessage');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');
const form = document.getElementById('blogSubmissionForm');

// Live Preview Functionality
blogTitleInput.addEventListener('input', () => {
    const title = blogTitleInput.value || 'Your title will appear here...';
    previewTitle.textContent = title;
    titleCharCounter.textContent = `${blogTitleInput.value.length}/100`;
});

blogContentInput.addEventListener('input', () => {
    const content = blogContentInput.value || 'Your content will appear here as you type...';
    previewContent.textContent = content;
});

// Clear Form Functionality
clearButton.addEventListener('click', () => {
    form.reset();
    previewTitle.textContent = 'Your title will appear here...';
    previewContent.textContent = 'Your content will appear here as you type...';
    titleCharCounter.textContent = '0/100';
    submissionMessage.textContent = '';
});

// Submit Form Functionality (using AJAX to prevent redirect)
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Stop default submission

    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    const formData = new FormData(form);

    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'  // Ensure Formspree returns JSON and not redirects
        }
    })
    .then(response => {
        if (response.ok) {
            submissionMessage.style.color = '#34d399';
            submissionMessage.textContent = 'Your blog has been submitted successfully!';

            form.reset();
            previewTitle.textContent = 'Your title will appear here...';
            previewContent.textContent = 'Your content will appear here as you type...';
            titleCharCounter.textContent = '0/100';
        } else {
            return response.json().then(data => {
                throw new Error(data.error || 'Form submission failed.');
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        submissionMessage.style.color = '#f87171';
        submissionMessage.textContent = 'Something went wrong. Try again later.';
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Blog';
    });
});
