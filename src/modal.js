const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modalProduct");
const cancelBtn = document.getElementById("cancel"); // Botón Cancelar

// 1. Abrir el modal
openModalBtn.addEventListener("click", () => {
  modal.showModal(); // Abre el modal como diálogo nativo
});

// 2. Cerrar el modal al hacer clic en "Cancelar"
cancelBtn.addEventListener("click", () => {
  modal.close();
});

// 3. Cerrar el modal al hacer clic fuera del contenido (opcional)
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});