import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiMl4BGYHEAYWXE-NDQ38SHvM0B_v3GZA",
    authDomain: "volunteer-website-6282d.firebaseapp.com",
    projectId: "volunteer-website-6282d",
    storageBucket: "volunteer-website-6282d.appspot.com",
    messagingSenderId: "1072219968898",
    appId: "1:1072219968898:web:5d1da878d2f8e92bfa2b9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.querySelector('.posts');
    
    // Handle post creation
    document.getElementById('postButton').addEventListener('click', async () => {
        const postContent = document.getElementById('postContent').value;
        const user = auth.currentUser;

        if (postContent && user) {
            try {
                await addDoc(collection(db, 'posts'), {
                    authorName: user.displayName,
                    authorEmail: user.email,
                    content: postContent,
                    timestamp: new Date()
                });
                document.getElementById('postContent').value = '';
            } catch (error) {
                console.error("Error adding document: ", error);
                alert("Error adding document: " + error.message);
            }
        } else {
            alert("You must be logged in and enter some content to post.");
        }
    });

    // Load posts
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (querySnapshot) => {
        postsContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const post = doc.data();
            const newPost = createPost(post);
            postsContainer.appendChild(newPost);
        });
    });

    // Function to create a new post
    function createPost(postData) {
        const post = document.createElement('div');
        post.classList.add('post');
        post.innerHTML = `
            <div class="post-header">
                <img src="user.jpg" alt="User" class="user-icon">
                <div>
                    <h2>${postData.authorName}</h2>
                    <p>Posted on: ${new Date(postData.timestamp.seconds * 1000).toLocaleString()}</p>
                </div>
            </div>
            <div class="post-content">
                <p>${postData.content}</p>
            </div>
            <div class="post-actions">
                <button class="like-button"><i class="fas fa-thumbs-up"></i> Like (<span class="like-count">0</span>)</button>
                <button class="comment-button"><i class="fas fa-comment"></i> Comment</button>
                <button class="share-button"><i class="fas fa-share"></i> Share</button>
            </div>
            <div class="comments"></div>
            <div class="add-comment">
                <input type="text" placeholder="Write a comment...">
                <button>Comment</button>
            </div>
        `;
        addPostEventListeners(post);
        return post;
    }

    function addPostEventListeners(post) {
        // Handle like button
        post.querySelector('.like-button').addEventListener('click', (e) => {
            const likeCount = post.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        });

        // Handle comment button
        post.querySelector('.comment-button').addEventListener('click', (e) => {
            const addCommentSection = post.querySelector('.add-comment');
            addCommentSection.querySelector('input').focus();
        });

        // Handle comment submission
        post.querySelector('.add-comment button').addEventListener('click', (e) => {
            const commentInput = post.querySelector('.add-comment input');
            const commentText = commentInput.value;
            if (commentText) {
                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.innerHTML = `<p><strong>You:</strong> ${commentText}</p>`;
                post.querySelector('.comments').appendChild(newComment);
                commentInput.value = '';
            }
        });

        // Handle share button (Placeholder functionality)
        post.querySelector('.share-button').addEventListener('click', (e) => {
            alert("Post shared!");
        });
    }

    // Check if user is logged in
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('User is logged in:', user);
        } else {
            console.log('No user is logged in');
            window.location.href = "/Home.html"; // Redirect to home page if not logged in
        }
    });
});
