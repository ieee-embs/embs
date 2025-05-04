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
const userBlogs = document.querySelector('#userBlogs');
const logoutButton = document.querySelector('#logoutButton');

// Redirect if not authenticated
auth.onAuthStateChanged(user => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    logoutButton.style.display = 'inline-block';
    loadUserBlogs(user);
});

// Load User's Blogs
function loadUserBlogs(user) {
    db.collection('blogs')
        .where('authorId', '==', user.uid)
        .orderBy('submittedAt', 'desc')
        .get()
        .then(snapshot => {
            userBlogs.innerHTML = '';
            snapshot.forEach(doc => {
                const blog = { id: doc.id, ...doc.data() };
                const blogCard = document.createElement('article');
                blogCard.className = 'blog-card';
                blogCard.innerHTML = `
                    <h2 class="blog-post-title">${blog.title}</h2>
                    <p class="blog-meta">${new Date(blog.submittedAt.toDate()).toLocaleDateString()} • ${blog.authorEmail}</p>
                    <p class="blog-excerpt">${blog.content.substring(0, 100)}...</p>
                    <p class="blog-status ${blog.status}">Status: ${blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}</p>
                    ${blog.status === 'pending' ? `
                        <div class="action-buttons">
                            <button class="edit-btn" data-id="${blog.id}">Edit</button>
                            <button class="delete-btn" data-id="${blog.id}">Delete</button>
                        </div>
                    ` : ''}
                `;
                userBlogs.appendChild(blogCard);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const blogId = btn.getAttribute('data-id');
                    // For simplicity, prompt for new content; in a production app, use a modal
                    const newTitle = prompt('Enter new title:', '');
                    const newContent = prompt('Enter new content:', '');
                    if (newTitle && newContent) {
                        db.collection('blogs').doc(blogId).update({
                            title: newTitle,
                            content: newContent,
                            submittedAt: firebase.firestore.FieldValue.serverTimestamp()
                        })
                        .then(() => {
                            loadUserBlogs(user);
                        });
                    }
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const blogId = btn.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this blog?')) {
                        db.collection('blogs').doc(blogId).delete()
                            .then(() => {
                                loadUserBlogs(user);
                            });
                    }
                });
            });
        })
        .catch(error => {
            userBlogs.innerHTML = `<p>Error loading blogs: ${error.message}</p>`;
        });
}

// Logout Functionality
logoutButton.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            alert('Logged out successfully!');
        })
        .catch(error => {
            alert('Error logging out: ' + error.message);
        });
});