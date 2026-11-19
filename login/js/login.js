import { auth, registrarAcceso, traducirError } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("Email").value.trim();
  const password = document.getElementById("Password").value;

  if (!email || !password) {
    Swal.fire("Campos vacíos", "Completa correo y contraseña", "warning");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const datos = await registrarAcceso(cred.user, "login");

    await Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: `Has entrado ${datos.total} ${datos.total === 1 ? "vez" : "veces"}`,
      timer: 1500,
      showConfirmButton: false
    });
    window.location.href = "inicio.html";
  } catch (error) {
    console.error(error.code, error.message);
    Swal.fire("Error", traducirError(error.code), "error");
  }
});