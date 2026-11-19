import { auth, registrarAcceso, traducirError } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("btnRegistro").addEventListener("click", async () => {
  const email = document.getElementById("EmailR").value.trim();
  const password = document.getElementById("PasswordR").value;

  if (!email || !password) {
    Swal.fire("Campos vacíos", "Completa correo y contraseña", "warning");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await registrarAcceso(cred.user, "registro");

    await Swal.fire({ icon: "success", title: "Cuenta creada", timer: 1500, showConfirmButton: false });
    window.location.href = "inicio.html";
  } catch (error) {
    console.error(error.code, error.message);
    Swal.fire("Error", traducirError(error.code), "error");
  }
});