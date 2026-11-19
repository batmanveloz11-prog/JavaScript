import { auth, limpiarSesion } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  document.getElementById("usuario").textContent = user.email;
});

document.getElementById("btnSalir").addEventListener("click", async () => {
  await signOut(auth);
  limpiarSesion();
  window.location.href = "login.html";
});