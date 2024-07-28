import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updateProfile, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

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
const storage = getStorage(app);

// Google sign-in function
async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Create or update user document in Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            await setDoc(userDocRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                bio: "",
                hoursCompleted: 0
            });
        }
    } catch (error) {
        console.error("Error during Google sign-in:", error);
    }
}

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        await updateUserProfile(user);
    } else {
        alert("Please create an account & login");
        window.location.href = "/Home.html";
    }
});

// Function to update the user profile
async function updateUserProfile(user) {
    const userName = user.displayName || "User";
    const userEmail = user.email;
    const userProfilePicture = user.photoURL || "default-profile.png";

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.bio) {
            document.getElementById("userBio").value = userData.bio;
        }
        if (userData.hoursCompleted !== undefined) {
            const hoursCompleted = Number(userData.hoursCompleted); // Convert to number
            updateProgressBar(hoursCompleted);
            document.getElementById('hoursInput').value = hoursCompleted; // Set the input value
        }
    }
}

// Handle file input and profile picture update
document.querySelector('.change-pic-btn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        const user = auth.currentUser;
        const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoURL = await getDownloadURL(storageRef);
        await updateProfile(user, { photoURL });
        await setDoc(doc(db, "users", user.uid), { photoURL }, { merge: true });
        document.getElementById('userProfilePicture').src = photoURL;
        alert("Profile picture updated!");
    }
});

// Function to update the progress bar based on hours input
async function updateProgress() {
    const hoursInput = Number(document.getElementById('hoursInput').value); // Convert to number
    const totalHours = 40; // Total required hours
    const progressPercentage = (hoursInput / totalHours) * 100;

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progressPercentage + '%';
    progressBar.textContent = Math.round(progressPercentage) + '%';

    // Save hours to Firestore
    const user = auth.currentUser;
    await setDoc(doc(db, "users", user.uid), { hoursCompleted: hoursInput }, { merge: true });
}

// Add event listener to the update button
document.getElementById('updateButton').addEventListener('click', updateProgress);

// Function to update the progress bar
function updateProgressBar(hoursCompleted) {
    const totalHours = 40; // Total required hours
    const progressPercentage = (hoursCompleted / totalHours) * 100;

    const progressBar = document.getElementById('progressBar');
    progressBar.style.width = progressPercentage + '%';
    progressBar.textContent = Math.round(progressPercentage) + '%';
}

// Handle logout
document.getElementById('logout').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "Home.html";
    }).catch((error) => {
        console.error("Sign out error", error);
    });
});

// Function to save the bio to Firestore
async function saveBio() {
    const userBio = document.getElementById('userBio').value;
    const user = auth.currentUser;
    await setDoc(doc(db, "users", user.uid), { bio: userBio }, { merge: true });
}

// Add event listener to the save bio button
document.getElementById('saveBioButton').addEventListener('click', saveBio);

// Show Save Bio button only when the bio textarea is being edited
document.getElementById('userBio').addEventListener('input', () => {
    const saveBioButton = document.getElementById('saveBioButton');
    saveBioButton.style.display = 'block';
});
