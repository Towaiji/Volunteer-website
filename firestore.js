// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBiMl4BGYHEAYWXE-NDQ38SHvM0B_v3GZA",
//     authDomain: "volunteer-website-6282d.firebaseapp.com",
//     projectId: "volunteer-website-6282d",
//     storageBucket: "volunteer-website-6282d.appspot.com",
//     messagingSenderId: "1072219968898",
//     appId: "1:1072219968898:web:5d1da878d2f8e92bfa2b9b"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to add a new blog post
// export async function addBlogPost(author, content) {
//     try {
//         await addDoc(collection(db, "blogPosts"), {
//             author: author,
//             content: content,
//             timestamp: serverTimestamp()
//         });
//         console.log("Blog post added successfully!");
//     } catch (e) {
//         console.error("Error adding blog post: ", e);
//     }
// }

// // Function to fetch all blog posts
// export async function getBlogPosts() {
//     const posts = [];
//     const q = query(collection(db, "blogPosts"), orderBy("timestamp", "desc"));
//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//         posts.push({ id: doc.id, ...doc.data() });
//     });
//     return posts;
// }
