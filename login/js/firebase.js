import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onIdTokenChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCInE4wA8hcbYk8jZUPNTR09LLdPoK5V4g",
  authDomain: "login-59150.firebaseapp.com",
  projectId: "login-59150",
  storageBucket: "login-59150.firebasestorage.app",
  messagingSenderId: "302299593242",
  appId: "1:302299593242:web:c6571d9ba00c238dccefa3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ---------- Guarda el token y los datos de la sesión ----------
export const guardarToken = async (user) => {
  const r = await user.getIdTokenResult();
  localStorage.setItem("token", r.token);
  localStorage.setItem("uid", user.uid);
  localStorage.setItem("email", user.email);
};

// ---------- Guarda el token y suma un acceso ----------
export const registrarAcceso = async (user, tipo) => {
  await guardarToken(user);

  const clave = `accesos_${user.uid}`;
  const datos = JSON.parse(localStorage.getItem(clave)) || {
    email: user.email,
    total: 0,
    primerAcceso: new Date().toLocaleString("es-MX"),
    historial: []
  };

  const ahora = new Date().toLocaleString("es-MX");
  datos.total += 1;
  datos.ultimoAcceso = ahora;
  datos.historial.push({ tipo, fecha: ahora });
  datos.historial = datos.historial.slice(-20); // guarda solo los últimos 20

  localStorage.setItem(clave, JSON.stringify(datos));
  return datos;
};

// Borra solo la sesión (el contador de accesos se conserva)
export const limpiarSesion = () => {
  ["token", "refreshToken", "tokenExpira", "uid", "email"].forEach((k) =>
    localStorage.removeItem(k)
  );
};

// Actualiza el token en localStorage cuando Firebase lo renueva (cada ~1 hora)
onIdTokenChanged(auth, async (user) => {
  if (user) await guardarToken(user);
});

export const traducirError = (code) => {
  const errores = {
    "auth/email-already-in-use": "Ese correo ya está registrado.",
    "auth/invalid-email": "El correo no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/user-not-found": "No existe una cuenta con ese correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Error de conexión.",
    "auth/configuration-not-found": "Authentication no está habilitado en Firebase."
  };
  return errores[code] || "Ocurrió un error: " + code;
};