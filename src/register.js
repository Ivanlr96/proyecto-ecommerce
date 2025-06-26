document.addEventListener('DOMContentLoaded', function () {
  const togglePasswordButtons = document.querySelectorAll('.password-toggle-btn');

  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function () {
      const targetId = this.dataset.target;
      const passwordInput = document.querySelector(targetId);

      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });
  });

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    // Verificar si ya existe un usuario con ese nombre o correo
    const res = await fetch(`http://localhost:3000/users`);
    const users = await res.json();

    const nameExists = users.some(user => user.name.toLowerCase() === name.toLowerCase());
    const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());

    if (nameExists) {
      showError("El nombre de usuario ya está registrado.");
      return;
    }

    if (emailExists) {
      showError("El correo electrónico ya está registrado.");
      return;
    }

    // Crear nuevo usuario
    const newUser = {
      name,
      email,
      password,
      role: "user"
    };

    await fetch(`http://localhost:3000/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    });

    // Simular login y redirigir
    localStorage.setItem("user", JSON.stringify(newUser));
    window.location.href = "index.html";

  } catch (err) {
    console.error(err);
    showError("Error al conectar con el servidor.");
  }
});

function showError(message) {
  let error = document.getElementById("register-error");
  if (!error) {
    error = document.createElement("div");
    error.id = "register-error";
    error.style.color = "red";
    error.style.marginTop = "10px";
    registerForm.appendChild(error);
  }
  error.textContent = message;
}


});