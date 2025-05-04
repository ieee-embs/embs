try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
} catch (error) {
    console.error("Error initializing firebase", error);
}

document.addEventListener('DOMContentLoaded', () => {
    const moderatePostsContainer = document.getElementById('moderatePostsContainer');

    // Function to check if the user is an admin
    function isAdmin(user) {
        //  Replace this with your actual admin check.
        //  This is just a placeholder.
        //  You might check for a specific email, a custom claim, or a role in a database.
        if (user.email === "youradminemail@example.com") { //Replace with your email.
            return Promise.resolve(true); //  Promise
        } else {
           return Promise.resolve(false);
        }
    }

    // Function to display pending blog posts
    function displayPendingPosts() {
        moderatePostsContainer.innerHTML = '<h2>Pending Blog Posts</h2><p>Loading pending blog posts...</p>'; // Initial loading message.

        auth.onAuthStateChanged(user => {
            if (user) {
                // Check if the user is an admin
                isAdmin(user).then(isAdminUser => {
                    if (isAdminUser) {
                        // User is an admin, fetch and display pending posts
                        db.collection('blogs')
                            .where('status', '==', 'pending')
                            .orderBy('submissionDate', 'desc')
                            .get()
                            .then(querySnapshot => {
                                moderatePostsContainer.innerHTML = '<h2>Pending Blog Posts</h2>'; // Clear loading message
                                if (querySnapshot.empty) {
                                    moderatePostsContainer.innerHTML += '<p>No pending blog posts to moderate.</p>';
                                    return;
                                }

                                querySnapshot.forEach(doc => {
                                    const blogData = doc.data();
                                    const postId = doc.id;  // Get the document ID
                                    const submissionDate = blogData.submissionDate ? blogData.submissionDate.toDate() : null;

                                    const postDiv = document.createElement('div');
                                    postDiv.classList.add('moderate-post');
                                    postDiv.innerHTML = `
                                        <h3>${blogData.title}</h3>
                                        <p class="posted-on">Posted on: ${submissionDate ? submissionDate.toLocaleDateString() : 'N/A'}</p>
                                        <p>${blogData.content}</p>
                                        <div class="actions">
                                            <button class="approve-btn" data-post-id="${postId}">Approve</button>
                                            <button class="reject-btn" data-post-id="${postId}">Reject</button>
                                        </div>
                                        <hr>
                                    `;
                                    moderatePostsContainer.appendChild(postDiv);
                                });

                                // Add event listeners to the approve and reject buttons *after* they are added to the DOM
                                const approveButtons = document.querySelectorAll('.approve-btn');
                                const rejectButtons = document.querySelectorAll('.reject-btn');

                                approveButtons.forEach(button => {
                                    button.addEventListener('click', (event) => {
                                        const postId = event.target.dataset.postId;
                                        updateStatus(postId, 'approved');
                                    });
                                });

                                rejectButtons.forEach(button => {
                                    button.addEventListener('click', (event) => {
                                        const postId = event.target.dataset.postId;
                                        updateStatus(postId, 'rejected');
                                    });
                                });
                            })
                            .catch(error => {
                                console.error("Error fetching pending posts:", error);
                                moderatePostsContainer.innerHTML = `<p>Error fetching pending posts: ${error.message}</p>`;
                            });
                    } else {
                        // User is not an admin, show an error message or redirect
                        moderatePostsContainer.innerHTML = '<p>You do not have permission to moderate blog posts.  Redirecting to login...</p>';
                        setTimeout(() => {
                            window.location.href = "admin_login.html";
                        }, 3000);
                        
                    }
                }).catch(error => {
                    console.error("Error checking admin status:", error);
                    moderatePostsContainer.innerHTML = `<p>Error checking admin status: ${error.message}</p>`;
                });
            } else {
                // User is not logged in, redirect to login
                moderatePostsContainer.innerHTML = '<p>Please log in to moderate blog posts.  Redirecting to login...</p>';
                setTimeout(() => {
                     window.location.href = "admin_login.html";
                }, 3000);
               
            }
        });
    }

    // Function to update the status of a blog post
    function updateStatus(postId, newStatus) {
        db.collection('blogs').doc(postId)
            .update({
                status: newStatus
            })
            .then(() => {
                console.log(`Blog post ${postId} status updated to ${newStatus}`);
                // Refresh the list of pending posts after updating the status
                displayPendingPosts();
            })
            .catch(error => {
                console.error(`Error updating status of post ${postId}:`, error);
                alert(`Failed to update status.  Check the console for errors.`)
            });
    }

    // Call function to display posts
    displayPendingPosts();
});