const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modalProduct");
const cancelBtn = document.getElementById("cancel");

const genderSelect = document.getElementById("gender-select");
const categorySelect = document.getElementById("category-select");
const API_CATEGORIES = "http://localhost:3000/categories";

let categories = [];

// 1. Abrir modal
openModalBtn.addEventListener("click", () => {
  modal.showModal();
});

// 2. Cerrar modal con botón cancelar
cancelBtn.addEventListener("click", () => {
  modal.close();
});

// 3. Cerrar modal clic fuera del contenido
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.close();
  }
});

// 4. Fetch de categorías
async function fetchCategories() {
  try {
    const res = await fetch(API_CATEGORIES);
    categories = await res.json();
    populateGenderSelect();
  } catch (error) {
    console.error("Error al cargar categorías:", error);
  }
}

// 5. Poblar select de género (categorías principales)
function populateGenderSelect() {
  genderSelect.innerHTML = `<option disabled selected>-- Selecciona un género --</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id; // Guardamos ID para usarlo después
    option.textContent = cat.name;
    genderSelect.appendChild(option);
  });

  genderSelect.disabled = false;
}

// 6. Poblar subcategorías al seleccionar género
function populateSubcategories(categoryId) {
  categoryId = parseInt(categoryId); // Asegura que sea número
  const selectedCategory = categories.find(cat => cat.id === categoryId);

  categorySelect.innerHTML = ""; // Limpiar

  if (selectedCategory && selectedCategory.subcategories?.length > 0) {
    selectedCategory.subcategories.forEach(sub => {
      const option = document.createElement("option");
      option.value = sub.id;
      option.textContent = sub.name;
      categorySelect.appendChild(option);
    });
    categorySelect.disabled = false;
  } else {
    categorySelect.innerHTML = `<option disabled selected>No hay subcategorías</option>`;
    categorySelect.disabled = true;
  }
}

// 7. Evento al cambiar género
genderSelect.addEventListener("change", (e) => {
  populateSubcategories(e.target.value);
});

// 8. Ejecutar al iniciar
fetchCategories();


const createBtn = document.getElementById("create");
const form = document.querySelector("form");
const API_PRODUCTS = "http://localhost:3000/products";

// Evitar recarga al enviar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = parseInt(document.getElementById("product-id").value);
  const name = document.getElementById("product-name").value;
  const price = parseFloat(document.getElementById("product-price").value);
  const categoryId = parseInt(document.getElementById("gender-select").value);
  const subcategoryId = parseInt(document.getElementById("category-select").value);
  const description = document.getElementById("text").value;
  const imageInput = document.getElementById("image");

  // Convertir imagen a base64
  const imageFile = imageInput.files[0];
  const imageBase64 = await toBase64(imageFile);

  const newProduct = {
    id,
    name,
    price,
    categoryId,
    subcategoryId,
    description,
    image: imageBase64 // Enviar como base64 o URL si usas Cloudinary
  };

  try {
    const res = await fetch(API_PRODUCTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProduct)
    });

    if (res.ok) {
      alert("Producto creado con éxito");
      form.reset();
      modal.close();
    } else {
      throw new Error("Error al crear producto");
    }
  } catch (err) {
    console.error(err);
    alert("Error al enviar el producto");
  }
});

// Función para convertir imagen a base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result); // Devuelve base64
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}