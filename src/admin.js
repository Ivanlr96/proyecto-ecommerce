
// Guardar las rutas de la base de datos en variables para la llamada a la bd (API)
const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";


// GET (Read)
// Función asíncrona para poder cargar los productos en la tabla de admin (uso de await y fetch para hacer las llamadas que pueden llevar un tiempo)
async function renderProducts() {
  // Capturamos la tabla de admin y en concreto el tbody, que es donde se van a insertar las filas
  const tableBody = document.querySelector("#products-table tbody");

  try {

    // Obtener los productos de su ruta y guardar la respuesta en una variable
    const resProducts = await fetch(API_URL);
    const products = await resProducts.json();

    // Obtener las categorías de su ruta y guardar la respuesta en una variable
    const resCategories = await fetch(API_URL2);
    const categories = await resCategories.json();

    // Limpiar el cuerpo de la tabla
    tableBody.innerHTML = "";

    // Recorrer el objeto de producst con el forEach 
    products.forEach(product => {
      // Buscar en el objeto categorías la coincidencia de la id de esa categoría entre su objeto y el de productos
      const category = categories.find(cat => Number(cat.id) === Number(product.categoryId));
      //Operador ternario para que devuelva desconocida si no se encuentra
      const categoryName = category ? category.name : "Desconocida";

      //Realizar lo mismo para subcategoría
       const subcategory = category?.subcategories.find(sub => Number(sub.id) === Number(product.subcategoryId));
      const subcategoryName = subcategory ? subcategory.name : "Desconocida";

      // Crear el elemento tr (fila) para reenderizar en la tabla y lo asignamos a la variable row
      const row = document.createElement("tr");

      //Crear las celdas (td) dentro de la etiqueta de Tr de la variable donde guardamos el elemento. En cada td ponemos el contenido del objeto, que creará cada entrada de la bd en su celda correspondiente.
      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.image}" alt="${product.name}" width="50" /></td>
        <td>${product.name}</td>
        <td>${categoryName}</td>
        <td>${subcategoryName}</td>
        <td>$${product.price}</td>
        <td>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        </td>
      `;
      //Asignamos la fila creada al cuerpo de la tabla
      tableBody.appendChild(row);
    });

    // Establecemos el mensaje de error que saldrá si no se ejecuta lo del try
  } catch (err) {
    console.error("Error fetching products or categories:", err);
  }
}

// Ejecutar al cargar
renderProducts();



const openModalBtn = document.getElementById("openModal");
const modal = document.getElementById("modalProduct");
const cancelBtn = document.getElementById("cancel");

const genderSelect = document.getElementById("gender-select");
const categorySelect = document.getElementById("category-select");


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
    const res = await fetch(API_URL2);
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
    const res = await fetch(API_URL, {
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