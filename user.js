import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
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
const auth = getAuth(app);
const db = getFirestore(app);

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // User is signed in
        console.log(user);
        await updateUserProfile(user);
    } else {
        // No user is signed in, redirect to login
        alert("Please create an account & login");
        window.location.href = "/Home.html";
    }
});

// Function to update the user profile
async function updateUserProfile(user) {
    const userName = user.displayName || "User"; // Default to "User" if displayName is not set
    const userEmail = user.email;
    const userProfilePicture = user.photoURL || "default-profile.png"; // Default to a placeholder image if photoURL is not set

    // Update the profile section with user data
    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;

    // Fetch additional user data from Firestore if needed
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        // Update the profile with additional user data if available
        if (userData.additionalInfo) {
            document.getElementById("additionalInfo").textContent = userData.additionalInfo;
        }
    }
}

// Handle logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "Home.html";
    }).catch((error) => {
        console.error("Sign out error", error);
    });
});
