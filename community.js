import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
                    authorId: user.uid,
                    content: postContent,
                    timestamp: new Date(),
                    likes: 0 // Initialize likes to 0
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
            const postId = doc.id;
            const newPost = createPost(post, postId);
            postsContainer.appendChild(newPost);
        });
    });

    // Function to create a new post
    function createPost(postData, postId) {
        const post = document.createElement('div');
        post.classList.add('post');
        post.innerHTML = `
            <div class="post-header">
                <img src="user.jpg" alt="User" class="user-icon">
                <div>
                    <h2><a href="userProfile.html?uid=${postData.authorId}" class="user-link">${postData.authorName}</a></h2>
                    <p>Posted on: ${new Date(postData.timestamp.seconds * 1000).toLocaleString()}</p>
                </div>
            </div>
            <div class="post-content">
                <p>${postData.content}</p>
            </div>
            <div class="post-actions">
                <button class="like-button"><i class="fas fa-thumbs-up"></i> Like (<span class="like-count">${postData.likes}</span>)</button>
                <button class="comment-button"><i class="fas fa-comment"></i> Comment</button>
                <button class="share-button"><i class="fas fa-share"></i> Share</button>
            </div>
            <div class="comments" id="comments-${postId}"></div>
            <div class="add-comment">
                <input type="text" placeholder="Write a comment..." class="comment-input">
                <button class="comment-submit">Comment</button>
            </div>
        `;
        addPostEventListeners(post, postId);
        return post;
    }

    function addPostEventListeners(post, postId) {
        // Handle like button
        post.querySelector('.like-button').addEventListener('click', async (e) => {
            const likeCount = post.querySelector('.like-count');
            const user = auth.currentUser;
            if (user) {
                try {
                    await updateDoc(doc(db, 'posts', postId), {
                        likes: increment(1)
                    });
                } catch (error) {
                    console.error("Error updating likes: ", error);
                }
            }
        });

        // Handle comment button
        post.querySelector('.comment-button').addEventListener('click', (e) => {
            const addCommentSection = post.querySelector('.add-comment');
            addCommentSection.querySelector('input').focus();
        });

        // Handle comment submission
        post.querySelector('.comment-submit').addEventListener('click', async (e) => {
            const commentInput = post.querySelector('.comment-input');
            const commentText = commentInput.value;
            const user = auth.currentUser;

            if (commentText && user) {
                try {
                    await addDoc(collection(db, 'posts', postId, 'comments'), {
                        authorName: user.displayName,
                        authorId: user.uid,
                        content: commentText,
                        timestamp: new Date()
                    });
                    commentInput.value = '';
                } catch (error) {
                    console.error("Error adding comment: ", error);
                    alert("Error adding comment: " + error.message);
                }
            }
        });

        // Load comments
        const commentsContainer = post.querySelector(`#comments-${postId}`);
        const commentsQuery = query(collection(db, 'posts', postId, 'comments'), orderBy('timestamp', 'asc'));
        onSnapshot(commentsQuery, (querySnapshot) => {
            commentsContainer.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const comment = doc.data();
                const newComment = createComment(comment);
                commentsContainer.appendChild(newComment);
            });
        });
    }

    function createComment(commentData) {
        const comment = document.createElement('div');
        comment.classList.add('comment');
        comment.innerHTML = `
            <p><strong>${commentData.authorName}:</strong> ${commentData.content}</p>
            <p class="comment-timestamp">${new Date(commentData.timestamp.seconds * 1000).toLocaleString()}</p>
        `;
        return comment;
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
