
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
          <button class="delete-btn" onclick="deleteProduct(${product.id})">Delete</button>
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