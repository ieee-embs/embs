const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsywbN4yiBB5zbizAUMj7luedAziRcVsOdKOgNxZ_Xra7i2AXfzsRUltaY0Fxq0a0/exec'; // Replace with your Apps Script web app URL

// Function to load submission history
async function loadSubmissionHistory() {
    const submissionHistory = document.getElementById('submissionHistory');
    const submittedBlogs = JSON.parse(localStorage.getItem('submittedBlogs') || '[]');

    if (submittedBlogs.length === 0) {
        submissionHistory.innerHTML = '<p>You have not submitted any blogs yet.</p>';
        return;
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getAllBlogs`);
        const result = await response.json();

        if (result.success) {
            const blogs = result.blogs;
            submissionHistory.innerHTML = '';
            submittedBlogs.forEach(submittedBlog => {
                const blog = blogs.find(b => b.id === submittedBlog.id);
                if (blog) {
                    const card = document.createElement('div');
                    card.classList.add('submission-card');
                    card.innerHTML = `
                        <h3>${blog.title}</h3>
                        <p>Blog ID: ${blog.id}</p>
                        <p>Submitted on: ${blog.submissionDate}</p>
                        <p>Status: <span class="status-${blog.status.toLowerCase()}">${blog.status}</span></p>
                    `;
                    submissionHistory.appendChild(card);
                }
            });
        } else {
            throw new Error(result.message || 'Failed to load submission history');
        }
    } catch (error) {
        console.error('Error loading submission history:', error);
        submissionHistory.innerHTML = '<p>Error loading submission history.</p>';
    }
}

// Load submission history on page load
document.addEventListener('DOMContentLoaded', loadSubmissionHistory);