// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Your web app's Firebase configuration
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

// Select the form
const form = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');

// Add event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get email and password values from input fields
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user;

            // Update user profile with the username
            return updateProfile(user, {
                displayName: username
            }).then(() => {
                // Save additional user data in Firestore
                return setDoc(doc(db, "users", user.uid), {
                    username: username,
                    email: email
                });
            }).then(() => {
                alert("Account created successfully!");
                window.location.href = "Home2.html";
            }).catch((error) => {
                console.error("Error updating profile or saving data: ", error);
                errorMessage.textContent = error.message;
            });
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});

// Function to handle Google sign-up
const googleButton = document.querySelector('.go');
googleButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default button behavior

    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            // Save additional user data in Firestore if needed
            return setDoc(doc(db, "users", user.uid), {
                username: user.displayName,
                email: user.email
            }).then(() => {
                alert("Logged in with Google!");
                window.location.href = "Home2.html";
            });
        })
        .catch((error) => {
            document.getElementById('error-message').textContent = error.message;
        });
});
