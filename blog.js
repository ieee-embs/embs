const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzsywbN4yiBB5zbizAUMj7luedAziRcVsOdKOgNxZ_Xra7i2AXfzsRUltaY0Fxq0a0/exec'; // Replace with your Apps Script web app URL

// Pagination variables
const blogsPerPage = 6;
let currentPage = 1;
let allBlogs = [];
let filteredBlogs = [];

// DOM Elements
const blogGrid = document.getElementById('blogGrid');
const searchInput = document.getElementById('searchInput');
const prevButton = document.querySelector('.page-button.prev');
const nextButton = document.querySelector('.page-button.next');
const pageNumber = document.querySelector('.page-number');
const toastContainer = document.getElementById('toastContainer');

// Function to fetch approved blogs
async function fetchApprovedBlogs() {
    try {
        // Show skeleton loading
        blogGrid.innerHTML = Array(blogsPerPage).fill('<div class="blog-card skeleton"></div>').join('');

        const response = await fetch(`${APPS_SCRIPT_URL}?action=getApprovedBlogs`);
        const result = await response.json();

        if (result.success) {
            allBlogs = result.blogs;
            filteredBlogs = [...allBlogs];
            renderBlogs();
        } else {
            throw new Error(result.message || 'Failed to fetch blogs');
        }
    } catch (error) {
        console.error('Error fetching blogs:', error);
        blogGrid.innerHTML = '<p>Error loading blogs.</p>';
    }
}

// Function to render blogs
function renderBlogs() {
    const start = (currentPage - 1) * blogsPerPage;
    const end = start + blogsPerPage;
    const blogsToDisplay = filteredBlogs.slice(start, end);

    blogGrid.innerHTML = '';
    if (blogsToDisplay.length === 0) {
        blogGrid.innerHTML = '<p>No blogs match your search.</p>';
        return;
    }

    blogsToDisplay.forEach(blog => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('blog-card');

        const excerpt = blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content;
        const tagsHtml = blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join(' ');

        blogCard.innerHTML = `
            <div class="blog-image" style="background-image: url('https://via.placeholder.com/300x200?text=Blog+Image');"></div>
            <div class="blog-content">
                <h3 class="blog-post-title">${blog.title}</h3>
                <p class="blog-meta">By ${blog.author} on ${blog.submissionDate}</p>
                <div class="blog-tags">${tagsHtml}</div>
                <p class="blog-excerpt">${excerpt}</p>
                <a href="blog-post.html?id=${blog.id}" class="read-more">Read More</a>
            </div>
        `;
        blogGrid.appendChild(blogCard);
    });

    updatePagination();
}

// Function to update pagination
function updatePagination() {
    pageNumber.textContent = currentPage;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === Math.ceil(filteredBlogs.length / blogsPerPage);
}

// Search functionality (by title or tags)
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filteredBlogs = allBlogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    currentPage = 1;
    renderBlogs();
});

// Pagination event listeners
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderBlogs();
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < Math.ceil(filteredBlogs.length / blogsPerPage)) {
        currentPage++;
        renderBlogs();
    }
});

// Function to show toast notifications
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.classList.add('toast', `toast-${type}`);
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// Function to check for blog status updates
async function checkBlogStatusUpdates() {
    const submittedBlogs = JSON.parse(localStorage.getItem('submittedBlogs') || '[]');
    if (submittedBlogs.length === 0) return;

    try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getAllBlogs`);
        const result = await response.json();

        if (result.success) {
            const blogs = result.blogs;
            submittedBlogs.forEach((submittedBlog, index) => {
                const currentBlog = blogs.find(b => b.id === submittedBlog.id);
                if (currentBlog && currentBlog.status !== submittedBlog.status) {
                    // Status has changed
                    submittedBlogs[index].status = currentBlog.status;
                    localStorage.setItem('submittedBlogs', JSON.stringify(submittedBlogs));

                    if (currentBlog.status === 'approved') {
                        showToast(`Your blog "${currentBlog.title}" has been approved!`, 'success');
                        fetchApprovedBlogs(); // Refresh blog list
                    } else if (currentBlog.status === 'rejected') {
                        showToast(`Your blog "${currentBlog.title}" was rejected.`, 'error');
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error checking blog status:', error);
    }

    // Check again after 30 seconds
    setTimeout(checkBlogStatusUpdates, 30000);
}

// Optimize Spline for mobile
document.addEventListener('DOMContentLoaded', () => {
    const splineViewer = document.getElementById('splineViewer');
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        splineViewer.setAttribute('loading-anim', 'false');
    }
    fetchApprovedBlogs();
    checkBlogStatusUpdates();
});