const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsywbN4yiBB5zbizAUMj7luedAziRcVsOdKOgNxZ_Xra7i2AXfzsRUltaY0Fxq0a0/exec'; // Replace with your Apps Script web app URL

// Function to get blog ID from URL
function getBlogIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to load blog post
async function loadBlogPost() {
    const blogId = getBlogIdFromUrl();
    if (!blogId) {
        document.getElementById('blogPostContainer').innerHTML = '<p>Blog not found.</p>';
        return;
    }

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getBlogById&id=${blogId}`);
        const result = await response.json();

        if (result.success) {
            const blog = result.blog;
            if (blog.status.toLowerCase() !== 'approved') {
                document.getElementById('blogPostContainer').innerHTML = '<p>This blog is not yet approved.</p>';
                return;
            }

            document.getElementById('blogPostTitle').textContent = blog.title;
            document.getElementById('blogPostMeta').textContent = `By ${blog.author} on ${blog.submissionDate}`;
            document.getElementById('blogPostContent').textContent = blog.content;
        } else {
            document.getElementById('blogPostContainer').innerHTML = '<p>Blog not found.</p>';
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
        document.getElementById('blogPostContainer').innerHTML = '<p>Error loading blog post.</p>';
    }
}

// Load the blog post when the page loads
document.addEventListener('DOMContentLoaded', loadBlogPost);