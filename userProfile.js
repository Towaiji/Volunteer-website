import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('uid');

// Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userBio = document.getElementById('userBio');
const userHours = document.getElementById('userHours');
const profilePic = document.getElementById('profilePic');

// Fetch and display user data
async function fetchUserData() {
    if (userId) {
        console.log(`Fetching data for user ID: ${userId}`);
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User data retrieved:", userData);
            userName.textContent = userData.displayName || "User";
            userEmail.textContent = userData.email || "No email available.";
            userBio.textContent = userData.bio || "No bio available.";
            userHours.textContent = userData.hoursCompleted !== undefined ? `${userData.hoursCompleted} hours` : "No hours recorded.";
            profilePic.src = userData.photoURL || "default-profile.png";
        } else {
            console.log("No such document!");
            userName.textContent = "No user found";
        }
    } else {
        console.log("No user ID provided in URL.");
        userName.textContent = "No user ID provided";
    }
}

// Fetch user data on page load
fetchUserData();
