import { app } from "./firebase-config.js";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const byId = (id) => document.getElementById(id);

function notify(message) {
  const toast = byId("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 4500);
}

function showLoginError(error) {
  const messages = {
    "auth/email-already-in-use": "An account already exists for this email. Use Google or sign in with your password.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Use a password with at least 8 characters.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/unauthorized-domain": "This website domain must be added to Firebase Authentication's authorized domains."
  };
  notify(messages[error.code] || "Unable to sign in right now. Please try again.");
}

async function saveProfile(user) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    providerIds: user.providerData.map((item) => item.providerId),
    lastLoginAt: serverTimestamp()
  }, { merge: true });
}

async function finishSignIn(user) {
  try {
    await saveProfile(user);
  } catch (error) {
    // Authentication should still work if Firestore has not been provisioned
    // or its rules have not yet been deployed.
    console.warn("Could not save the user profile.", error);
  }
  localStorage.setItem("ai-horizons-user", "true");
  localStorage.setItem("massive-ai-user", "true");
  document.body.classList.remove("signed-out");
  if (typeof window.showView === "function") window.showView("home");
  const button = byId("authButton");
  if (button) {
    button.textContent = "Sign out";
    button.onclick = async () => {
      await signOut(auth);
    };
  }
  notify(`Welcome to Ai Horizons${user.displayName ? `, ${user.displayName}` : ""}.`);
}

async function startGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await finishSignIn(result.user);
  } catch (error) {
    showLoginError(error);
  }
}

async function startEmailSignUp(event) {
  event.preventDefault();
  event.stopImmediatePropagation();
  const email = byId("signupEmail").value.trim();
  const password = byId("signupPassword").value;
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(credential.user);
    byId("emailSignup").classList.add("hidden");
    const step = byId("otpStep");
    step.classList.add("show");
    step.innerHTML = `<span class="kicker">Verify your email</span><p>We sent a verification link to <b>${email}</b>. Open that link in your inbox, then return here and sign in.</p>`;
    await signOut(auth);
    notify("Verification email sent. Check your inbox.");
  } catch (error) {
    showLoginError(error);
  }
}

document.querySelector(".oauth.google")?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  startGoogleSignIn();
}, true);

byId("emailSignup")?.addEventListener("submit", startEmailSignUp, true);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    localStorage.removeItem("ai-horizons-user");
    localStorage.removeItem("massive-ai-user");
    document.body.classList.add("signed-out");
    const button = byId("authButton");
    if (button) {
      button.textContent = "Log in / Sign up";
      button.onclick = () => window.showView("login");
    }
    return;
  }
  if (user.providerData.some((provider) => provider.providerId === "password") && !user.emailVerified) {
    document.body.classList.add("signed-out");
    notify("Please verify your email, then sign in to continue.");
    return;
  }
  try {
    await finishSignIn(user);
  } catch (error) {
    console.error("Could not finish Firebase sign-in.", error);
    notify("Unable to complete sign-in right now. Please try again.");
  }
});
