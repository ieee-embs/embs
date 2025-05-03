try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const db = firebase.firestore();
  } catch (error) {
      console.error("Error initializing firebase", error);
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const blogSubmissionForm = document.getElementById('blogSubmissionForm');
    const submissionMessage = document.getElementById('submissionMessage');
  
    if (blogSubmissionForm) {
      blogSubmissionForm.addEventListener('submit', (event) => {
        event.preventDefault();
  
        const title = document.getElementById('blogTitle').value;
        const content = document.getElementById('blogContent').value;
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          db.collection('blogs').add({
            title: title,
            content: content,
            authorId: currentUser.uid,
            submissionDate: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'pending'
          })
            .then(() => {
              console.log("Blog submitted successfully!");
              submissionMessage.textContent = "Blog submitted successfully and is awaiting moderation.";
              blogSubmissionForm.reset();
               // Redirect back to the main blog page after successful submission
              window.location.href = "blog.html";
            })
            .catch((error) => {
              console.error("Error submitting blog:", error);
              submissionMessage.textContent = "Error submitting blog. Please try again.";
            });
        } else {
          alert("You must be logged in to submit a blog post.");
          window.location.href = "blog.html"; //redirect to blog.html
        }
      });
    }
      else{
          console.log("blogSubmissionForm does not exist");
      }
  });