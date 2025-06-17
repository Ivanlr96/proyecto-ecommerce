const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

async function renderProducts() {
  const tableBody = document.querySelector("#products-table tbody");

  try {
    // Obtener productos y categorías al mismo tiempo
    const [resProducts, resCategories] = await Promise.all([
      fetch(API_URL),
      fetch(API_URL2)
    ]);

    const products = await resProducts.json();
    const categories = await resCategories.json();

    tableBody.innerHTML = "";

    products.forEach(product => {
      const category = categories.find(cat => cat.id === product.categoryId);
      const categoryName = category ? category.name : "Desconocida";

      const subcategory = category?.subcategories.find(
        sub => sub.id === product.subcategoryId
      );
      const subcategoryName = subcategory ? subcategory.name : "Desconocida";

      const row = document.createElement("tr");
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
      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error fetching products or categories:", err);
  }
}

// Ejecutar al cargar
renderProducts();