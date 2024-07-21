// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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
            alert("Creating account...");
            window.location.href = "Home.html";
        })
        .catch((error) => {
            errorMessage.textContent = error.message;
        });
});
