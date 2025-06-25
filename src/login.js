 document.addEventListener('DOMContentLoaded', function() {
            const togglePasswordButtons = document.querySelectorAll('.password-toggle-btn');

            togglePasswordButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetId = this.dataset.target;
                    const passwordInput = document.querySelector(targetId);

                    if (passwordInput.type === 'password') {
                        passwordInput.type = 'text';
                        // Example: button.querySelector('svg').outerHTML = '<svg class="bi bi-eye-slash" ...>';
                    } else {
                        passwordInput.type = 'password';
                        // Example: button.querySelector('svg').outerHTML = '<svg class="bi bi-eye" ...>';
                    }
                });
            });
        });


const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
    const users = await res.json();

    if (users.length > 0) {
      const user = users[0];

      // Simular sesión
      localStorage.setItem("user", JSON.stringify(user));

      // Redirección según el rol
      if (user.role === "admin") {
        window.location.href = "admin.html"; 
      } else {
        window.location.href = "index.html"; 
      }
    } else {
      showError("Usuario o contraseña incorrectos.");
    }
  } catch (err) {
    console.error(err);
    showError("Error al conectar con el servidor.");
  }
});

function showError(message) {
  let error = document.getElementById("login-error");
  if (!error) {
    error = document.createElement("div");
    error.id = "login-error";
    error.style.color = "red";
    error.style.marginTop = "10px";
    loginForm.appendChild(error);
  }
  error.textContent = message;
}