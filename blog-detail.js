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
const blogTitle = document.querySelector('#blogTitle');
const blogMeta = document.querySelector('#blogMeta');
const blogContent = document.querySelector('#blogContent');
const likeButton = document.querySelector('#likeButton');
const likeCount = document.querySelector('#likeCount');
const commentForm = document.querySelector('#commentForm');
const commentInput = document.querySelector('#commentInput');
const commentsList = document.querySelector('#commentsList');
const logoutButton = document.querySelector('#logoutButton');

// Get Blog ID from URL
const urlParams = new URLSearchParams(window.location.search);
const blogId = urlParams.get('id');

// Check Authentication State
let currentUser = null;
auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
        logoutButton.style.display = 'inline-block';
    } else {
        logoutButton.style.display = 'none';
    }
    loadBlogDetails();
    loadComments();
    checkIfLiked();
});

// Load Blog Details
function loadBlogDetails() {
    if (!blogId) {
        blogContent.innerHTML = '<p>Error: Blog ID not found.</p>';
        return;
    }

    db.collection('blogs').doc(blogId).get()
        .then(doc => {
            if (doc.exists) {
                const blog = doc.data();
                blogTitle.textContent = blog.title;
                blogMeta.textContent = `${new Date(blog.publishedAt.toDate()).toLocaleDateString()} • ${blog.authorEmail}`;
                blogContent.textContent = blog.content;
                likeCount.textContent = blog.likes ? Object.keys(blog.likes).length : 0;
            } else {
                blogContent.innerHTML = '<p>Blog not found.</p>';
            }
        })
        .catch(error => {
            blogContent.innerHTML = `<p>Error loading blog: ${error.message}</p>`;
        });
}

// Like Functionality
function checkIfLiked() {
    if (!currentUser || !blogId) return;
    db.collection('blogs').doc(blogId).get()
        .then(doc => {
            if (doc.exists) {
                const blog = doc.data();
                if (blog.likes && blog.likes[currentUser.uid]) {
                    likeButton.textContent = `Unlike (${likeCount.textContent})`;
                }
            }
        });
}

likeButton.addEventListener('click', () => {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const userId = currentUser.uid;
    db.collection('blogs').doc(blogId).get()
        .then(doc => {
            const blog = doc.data();
            const likes = blog.likes || {};
            if (likes[userId]) {
                delete likes[userId];
                likeButton.textContent = `Like (${Object.keys(likes).length})`;
            } else {
                likes[userId] = true;
                likeButton.textContent = `Unlike (${Object.keys(likes).length})`;
            }
            return db.collection('blogs').doc(blogId).update({ likes });
        })
        .then(() => {
            likeCount.textContent = likeButton.textContent.match(/\d+/)[0];
        });
});

// Comment Functionality
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    const commentText = commentInput.value.trim();
    if (!commentText) return;

    db.collection('blogs').doc(blogId).collection('comments').add({
        userId: currentUser.uid,
        userEmail: currentUser.email,
        content: commentText,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        commentInput.value = '';
        loadComments();
    })
    .catch(error => {
        alert('Error posting comment: ' + error.message);
    });
});

function loadComments() {
    commentsList.innerHTML = '';
    db.collection('blogs').doc(blogId).collection('comments')
        .orderBy('createdAt', 'desc')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const comment = doc.data();
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <p class="comment-meta">${new Date(comment.createdAt?.toDate()).toLocaleDateString()} • ${comment.userEmail}</p>
                    <p class="comment-content">${comment.content}</p>
                `;
                commentsList.appendChild(commentElement);
            });
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