const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL'; // Replace with your Apps Script web app URL

// Live Preview Functionality
const blogTitleInput = document.getElementById('blogTitle');
const writerNameInput = document.getElementById('writerName');
const blogContentInput = document.getElementById('blogContent');
const previewTitle = document.getElementById('previewTitle');
const previewContent = document.getElementById('previewContent');
const titleCharCounter = document.getElementById('titleCharCounter');

blogTitleInput.addEventListener('input', () => {
    const title = blogTitleInput.value || 'Your title will appear here...';
    previewTitle.textContent = title;
    titleCharCounter.textContent = `${blogTitleInput.value.length}/100`;
});

blogContentInput.addEventListener('input', () => {
    const content = blogContentInput.value || 'Your content will appear here as you type...';
    previewContent.textContent = content;
});

// Form Submission
document.getElementById('blogSubmissionForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = blogTitleInput.value;
    const writer = writerNameInput.value;
    const content = blogContentInput.value;
    const submissionMessage = document.getElementById('submissionMessage');
    const submitButton = document.getElementById('submitButton');

    // Disable the button and show a loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting...';

    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify({ title, content, writer }),
            headers: { 'Content-Type': 'application/json' }
        });

        const result = await response.json();

        if (result.success) {
            submissionMessage.style.color = 'green';
            submissionMessage.innerHTML = `Blog submitted successfully! Your Blog ID is <strong>${result.blogId}</strong>.`;
            document.getElementById('blogSubmissionForm').reset();
            previewTitle.textContent = 'Your title will appear here...';
            previewContent.textContent = 'Your content will appear here as you type...';
            titleCharCounter.textContent = '0/100';
        } else {
            throw new Error(result.message || 'Submission failed');
        }
    } catch (error) {
        submissionMessage.style.color = 'red';
        submissionMessage.textContent = 'Error submitting blog: ' + error.message;
    } finally {
        // Re-enable the button
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Blog';
    }
});