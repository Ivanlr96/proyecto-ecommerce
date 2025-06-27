
// Comprobación sesión de usuario
const user = JSON.parse(localStorage.getItem("user"));
if (!user || user.role !== "admin") {
  alert("Acceso denegado");
  window.location.href = "login.html";
}
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


      // 1. Crea una cadena de texto con todos los campos que quieres que sean buscables.
      const searchableRowText = `${product.id} ${product.name} ${product.description || ''} ${categoryName} ${subcategoryName} ${product.price}`.toLowerCase();
      // El || '' asegura que la descripción no sea 'undefined' si no existe.
      

      // Crear el elemento tr (fila) para reenderizar en la tabla y lo asignamos a la variable row
      const row = document.createElement("tr");

      // Asignamos la cadena de búsqueda a un atributo de datos en la fila.
      row.setAttribute('data-search-text', searchableRowText);

      //Crear las celdas (td) dentro de la etiqueta de Tr de la variable donde guardamos el elemento. En cada td ponemos el contenido del objeto, que creará cada entrada de la bd en su celda correspondiente.
      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.image}" alt="${product.name}" width="50" /></td>
        <td>${product.name}</td>
        <td>${categoryName}</td>
        <td>${subcategoryName}</td>
        <td>$${product.price}</td>
        <td>
          <button class="edit-btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out" data-id="${product.id}">Editar</button>
         <button class="delete-btn" onclick="deleteProduct('${product.id}')">Delete</button>
        
        </td>
      `;
      //Asignamos la fila creada al cuerpo de la tabla
      tableBody.appendChild(row);
    });

    // Boton para editar el modal
    tableBody.addEventListener("click", (event) => {
      // Check if the clicked element has the 'edit-btn' class
      if (event.target.classList.contains("edit-btn")) {
        const productId = event.target.dataset.id; // Get the product ID from the data-id attribute
        cargarProductoEnFormulario(productId);
        modal.showModal(); // Assuming you want to open the modal for editing
      }
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
  form.reset()
  titleForm.textContent = "Crear Producto";
  createBtn.textContent = "Crear"
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
  categoryId = Number(categoryId); // Asegura que sea número
  const selectedCategory = categories.find(cat => Number(cat.id) === categoryId);

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

  //const id = parseInt(document.getElementById("product-id").value);
  let id
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
    image: imageBase64 
  };

    try {
    if (modoEdicion) {
      // Solo actualizar producto existente
      await fetch(`${API_URL}/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      alert("Producto actualizado con éxito");
    } else {
      // Solo crear producto nuevo
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        alert("Producto creado con éxito");
      } else {
        throw new Error("Error al crear producto");
      }
    }
    form.reset();
    modal.close();
    modoEdicion = false;
    idEditando = null;
    titleForm.textContent = "Crear nuevo producto";
    document.getElementById("create").textContent = "Crear";
    renderProducts();
  } catch (error) {
    alert("Error al guardar");
    console.error(error);
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















































































let modoEdicion = false;
let idEditando = null;
const titleForm = document.getElementById("titleForm");

//cargar para editarlo
async function cargarProductoEnFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();

    id = product.id; 
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("text").value = product.description;

    // Handle category and subcategory selects for editing
    await fetchCategories(); // Ensure categories are loaded
    genderSelect.value = product.categoryId;
    populateSubcategories(product.categoryId); // Populate subcategories based on selected category
    // Delay setting subcategory value slightly to ensure options are rendered
    setTimeout(() => {
      categorySelect.value = product.subcategoryId;
    }, 100);


    modoEdicion = true;
    idEditando = id;
    titleForm.textContent = "Editar producto";
    createBtn.textContent = "Editar"

  } catch (error) {
    alert("error al cargar el producto");
    console.error(error);
  }
}











// DELETE
   // Boton de Borrar
async function deleteProduct(id) {
  const confirmDelete = confirm("Estas seguro de querer eliminar este producto?");
  if (!confirmDelete) // Si le dan a cancelar
     return; // Devuelve los datos 

  try {
    await fetch(`${API_URL}/${id}`, { // Pide a la Api
      method: "DELETE" // Eliminar el producto
    });

    renderProducts();

  } catch (err) {
    console.error("Error deleting product:", err);
  }
}

// Ejecutar al cargar
renderProducts();



/* Maneja la búsqueda en tiempo real.
 * Oculta o muestra las filas de la tabla según la consulta.
 */
function handleAdminSearch() {
  // Capturamos el campo de búsqueda
  const adminSearchInput = document.getElementById('adminSearchInput');
  if (!adminSearchInput) {
    console.error("No se encontró el elemento con ID 'adminSearchInput'");
    return; // Salir si el elemento no existe.
  }
  
  // Obtiene el valor del campo de búsqueda y lo convierte a minúsculas.
  const query = adminSearchInput.value.toLowerCase().trim();
  
  // Obtiene todas las filas del cuerpo de la tabla.
  const rows = document.querySelectorAll("#products-table tbody tr");
  
  // Itera sobre cada fila para mostrarla u ocultarla.
  rows.forEach(row => {
    // Obtiene el texto de búsqueda de la fila del atributo data-search-text.
    const rowSearchText = row.dataset.searchText || ''; // Usamos .dataset para acceder al atributo
    
    // Si el texto de la fila incluye la consulta, la muestra.
    // Si la consulta está vacía, se muestran todas las filas.
    if (rowSearchText.includes(query)) {
      row.style.display = ''; // Muestra la fila
    } else {
      row.style.display = 'none'; // Oculta la fila
    }
  });
}


// *** CONECTAR EL BUSCADOR CON EL CAMPO DE ENTRADA ***

// Asegúrate de que el DOM esté completamente cargado antes de añadir el event listener
document.addEventListener("DOMContentLoaded", () => {
    // Es mejor que esta función se llame después de que la tabla ya se haya renderizado.
    // Tu llamada a renderProducts() ya está fuera, lo cual es correcto.
    // Ahora, solo hay que conectar el evento.
    
    // Captura el input del buscador
    const adminSearchInput = document.getElementById('adminSearchInput');
    
    // Añade el event listener para que la búsqueda sea en tiempo real con cada tecla
    if (adminSearchInput) {
      adminSearchInput.addEventListener('input', handleAdminSearch);
    }
});






// Ejecutar al cargar
renderProducts();






















//cargar para editarlo
async function cargarProductoEnFormulario(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const product = await res.json();

   // document.getElementById("product-id").value = product.id; // Assuming you have an ID input field
    id = product
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("text").value = product.description;

    // Handle category and subcategory selects for editing
    await fetchCategories(); // Ensure categories are loaded
    genderSelect.value = product.categoryId;
    populateSubcategories(product.categoryId); // Populate subcategories based on selected category
    // Delay setting subcategory value slightly to ensure options are rendered
    setTimeout(() => {
      categorySelect.value = product.subcategoryId;
    }, 100);


    modoEdicion = true;
    idEditando = product.id;
    titleForm.textContent = "Editar producto";
    createBtn.textContent = "Editar"
  } catch (error) {
    alert("error al cargar el producto");
    console.error(error);
  }
}











// DELETE
   // Boton de Borrar
async function deleteProduct(id) {
  const confirmDelete = confirm("Estas seguro de querer eliminar este producto?");
  if (!confirmDelete) // Si le dan a cancelar
     return; // Devuelve los datos 

  try {
    await fetch(`${API_URL}/${id}`, { // Pide a la Api
      method: "DELETE" // Eliminar el producto
    });

    renderProducts();

  } catch (err) {
    console.error("Error deleting product:", err);
  }
}

// Ejecutar al cargar
renderProducts();