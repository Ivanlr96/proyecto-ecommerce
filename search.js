

const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

// Tus datos actualizados (asumiendo que 'appData' es donde resides tus datos principales)
const appData = {
  "categories": [
    // ... tus categorías y subcategorías actuales ...
  ],
  "products": [
    {
      "id": "f46e",
      "name": "camiseta",
      "price": 20,
      "categoryId": "2", // Nota: Lo he puesto como string para coincidir con el id de categoría "2"
      "subcategoryId": 205,
      "description": "camiseta blanca",
      "image": "data:image/png;base64,..." // Tu base64 completo
    }
  ]
};



// --- Nueva preparación de datos ---
let searchableItems = [];

// --- FUNCIÓN ACTUALIZADA: Prepara los datos para la búsqueda ---
function prepareSearchableItems() {
    searchableItems = []; // Limpiamos la lista existente para reconstruirla
    
    // 1. Añadir categorías y subcategorías
    appData.categories.forEach(category => {
        // (Opcional) Añadimos la categoría principal si quieres que sea buscable
        searchableItems.push({ 
            id: category.id, 
            name: category.name, 
            type: 'category', 
            image: null,
            searchableText: category.name.toLowerCase() 
        }); 

        category.subcategories.forEach(subcategory => {
            searchableItems.push({
                id: subcategory.id,
                name: subcategory.name,
                image: subcategory.image,
                categoryName: category.name, // Renombré 'category' a 'categoryName' para evitar conflictos
                categoryId: category.id, // Guardamos el ID de la categoría padre
                type: 'subcategory',
                searchableText: `${subcategory.name} ${category.name}`.toLowerCase() 
            });
        });
    });

    // 2. Añadir productos
    // ¿Por qué es crucial esta parte ahora?
    // Porque aquí es donde tus productos reales se convierten en elementos buscables.
    appData.products.forEach(product => {
        // Encontramos la categoría y subcategoría para obtener sus nombres
        const parentCategory = appData.categories.find(cat => cat.id === String(product.categoryId)); // Convertir a string para coincidir
        const parentSubcategory = parentCategory 
            ? parentCategory.subcategories.find(sub => sub.id === product.subcategoryId) 
            : null;

        searchableItems.push({
            id: product.id,
            name: product.name,
            price: `${product.price},00 €`, // Formateamos el precio para la visualización
            image: product.image,
            description: product.description,
            // Añadimos las referencias a las categorías/subcategorías para dar contexto en la búsqueda
            categoryName: parentCategory ? parentCategory.name : 'Desconocida',
            subCategoryName: parentSubcategory ? parentSubcategory.name : 'Desconocida',
            type: 'product', // Es importante etiquetar el tipo de elemento
            // Combinamos campos para una búsqueda más completa: nombre, descripción, categoría, subcategoría
            searchableText: `${product.name} ${product.description} ${parentCategory ? parentCategory.name : ''} ${parentSubcategory ? parentSubcategory.name : ''} ${product.price}`.toLowerCase() 
        });
    });

    console.log("Datos de búsqueda actualizados:", searchableItems); 
}

prepareSearchableItems(); // Ejecútala al cargar la página por primera vez

let searchTimeout; // necesaria para el debounce

// ABRIR MODAL DE BÚSQUEDA
function openSearch() {
    const modal = document.getElementById('searchModal');
    const overlay = document.querySelector('.search-overlay');
    const input = document.getElementById('searchInput');

    // ¿Por qué uso clases en lugar de style.display?
    // Las clases permiten usar animaciones CSS, mientras que 
    // cambiar display directamente no se puede animar
    modal.classList.add('active');
    overlay.classList.add('active');

    // ¿Por qué setTimeout?
    // Permite que la animación de apertura se complete antes de enfocar
    // Mejora la experiencia visual
    setTimeout(() => {
        input.focus();
    }, 100);

    // ¿Por qué prevenir scroll?
    // Evita que el usuario haga scroll del contenido de fondo
    // Mantiene el foco en la búsqueda
    document.body.style.overflow = 'hidden';
}

// CERRAR MODAL DE BÚSQUEDA
function closeSearch() {
    const modal = document.getElementById('searchModal');
    const overlay = document.querySelector('.search-overlay');
    const input = document.getElementById('searchInput');

    modal.classList.remove('active');
    overlay.classList.remove('active');

    // Limpiar búsqueda al cerrar
    input.value = '';
    showDefaultContent();

    // Restaurar scroll
    document.body.style.overflow = 'auto';
}

// MANEJAR BÚSQUEDA CON DEBOUNCE
function handleSearch(query) {
    // ¿Qué es debounce y por qué lo uso?
    // Evita hacer búsquedas en cada tecla presionada
    // Espera a que el usuario termine de escribir
    // Mejora performance y UX
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        if (query.trim() === '') {
            showDefaultContent();
        } else {
            performSearch(query);
        }
    }, 300); // Espera 300ms después de dejar de escribir
}

// REALIZAR BÚSQUEDA
function performSearch(query) {
    const resultsContainer = document.getElementById('resultsContainer');
    const lowerCaseQuery = query.toLowerCase();
    
    const results = searchableItems.filter(item => {
        // Ahora buscamos directamente en la propiedad 'searchableText' que creamos.
        // Esto simplifica la lógica aquí, ya que 'searchableText' contiene todos los campos relevantes.
        return item.searchableText.includes(lowerCaseQuery);
    });
    
    if (results.length > 0) {
        displayResults(results);
    } else {
        displayNoResults(query);
    }
}

// MOSTRAR RESULTADOS
function displayResults(items) { 
    const resultsContainer = document.getElementById('resultsContainer');
    
    resultsContainer.innerHTML = `
        <div class="search-results-grid">
            ${items.map(item => `
                <div class="product-card ${item.type}"> 
                    <div class="product-image">
                        ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '📷'}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                        ${item.subCategoryName && item.type === 'product' ? `<div class="product-type">${item.subCategoryName}</div>` : ''}
                        ${item.categoryName && item.type !== 'product' ? `<div class="product-type">${item.categoryName}</div>` : ''}
                        ${item.price && item.type === 'product' ? `<div class="product-price">${item.price}</div>` : ''} 
                        ${item.description && item.type === 'product' ? `<div class="product-description">${item.description}</div>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// MOSTRAR "SIN RESULTADOS"
function displayNoResults(query) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
                <div class="no-results">
                    <p>No encontramos resultados para "${query}"</p>
                    <p>Prueba con otros términos de búsqueda</p>
                </div>
            `;
}

// MOSTRAR CONTENIDO POR DEFECTO
function showDefaultContent() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = '';
}

// BUSCAR TÉRMINO ESPECÍFICO (desde sugerencias)
function searchFor(term) {
    const input = document.getElementById('searchInput');
    input.value = term;
    performSearch(term);
}

// CERRAR CON TECLA ESC
// ¿Por qué escucho eventos de teclado?
// Mejora la accesibilidad y UX
// Es estándar poder cerrar modales con Escape
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeSearch();
    }
});



function addNewProductFromForm(newProductData) {
    // 1. Añade el nuevo producto al array `products` en tu `appData`
    appData.products.push(newProductData); 
    
    // 2. ¡IMPORTANTE! Vuelve a generar la lista de elementos buscables
    // para incluir el nuevo producto.
    prepareSearchableItems(); 

    // 3. Opcional: Aquí podrías querer limpiar el formulario de añadir producto,
    // o refrescar la visualización de tu tabla de productos si la tienes.
    // displayProductsInTable();
}