

const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

// appData ahora se inicializa vacía o con una estructura mínima,
// y sus contenidos serán llenados por las APIs.
let appData = {
    categories: [],
    products: []
};

// --- Nueva preparación de datos ---
let searchableItems = [];
let searchTimeout; // necesaria para el debounce


console.log(initializeDataAndSearch());
// --- NUEVA FUNCIÓN MAESTRA DE CARGA DE DATOS ---
// ¿Por qué async? Porque hacemos peticiones de red que son asíncronas.
// ¿Por qué la llamamos al inicio? Para que el buscador tenga datos desde el primer momento.
async function initializeDataAndSearch() {
    try {
        // 1. Cargar categorías
        // ¿Por qué esta primera petición? Para obtener la estructura de categorías/subcategorías.
        const categoriesResponse = await fetch(API_URL2);
        if (!categoriesResponse.ok) {
            throw new Error(`Error al cargar categorías: ${categoriesResponse.status}`);
        }
        appData.categories = await categoriesResponse.json();
        console.log("Categorías cargadas:", appData.categories); // Para depuración

        // 2. Cargar productos
        // ¿Por qué esta segunda petición? Para obtener la lista de productos.
        const productsResponse = await fetch(API_URL);
        if (!productsResponse.ok) {
            throw new Error(`Error al cargar productos: ${productsResponse.status}`);
        }
        appData.products = await productsResponse.json();
        console.log("Productos cargados:", appData.products); // Para depuración

        // 3. Una vez que appData.categories y appData.products están llenos,
        // preparamos la lista para el buscador.
        // ¿Por qué aquí? Porque necesitamos TODOS los datos antes de aplanarlos.
        prepareSearchableItems();

    } catch (error) {
        console.error("Fallo crítico al inicializar la aplicación:", error);
        // Aquí podrías mostrar un mensaje grande de error en la UI al usuario.
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = `<div class="error-message">
                                            <p>No se pudieron cargar los datos de productos y categorías.</p>
                                          </div>`;
        }
    }
}




// --- Prepara los datos para la búsqueda ---
function prepareSearchableItems() {
    searchableItems = []; // Limpiamos la lista existente para reconstruirla
    
    // 1. Añadir categorías y subcategorías
    appData.categories.forEach(category => {
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





// --- Tu función para añadir un producto (de tu tabla/formulario) ---
// ¿Por qué la modificamos? Para que interactúe directamente con tu API POST.
async function addNewProductFromForm(newProductData) {
    try {
        console.log("Intentando añadir producto:", newProductData);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProductData)
        });

        if (!response.ok) {
            // Si la API responde con un error (ej. 400, 500), lanzamos un error.
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            throw new Error(`Error al añadir el producto: ${response.status} - ${errorData.message || 'Sin mensaje de error'}`);
        }

        // Si el POST fue exitoso, no necesitamos usar `response.json()` a menos que tu API devuelva el objeto completo.
        // Lo más importante es que los datos del SERVIDOR están actualizados.

        console.log("Producto añadido exitosamente a la API.");

        // ¿Por qué `initializeDataAndSearch()` de nuevo?
        // Después de un POST exitoso, volvemos a cargar TODOS los datos del servidor (productos y categorías).
        // Esto asegura que `appData` y, por lo tanto, `searchableItems` estén completamente sincronizados.
        await initializeDataAndSearch(); 

        // Opcional: Si el modal de búsqueda está abierto y hay una búsqueda activa,
        // podrías querer volver a ejecutarla para mostrar los resultados actualizados.
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim() !== '') {
            handleSearch(searchInput.value); 
        }

        alert("¡Producto añadido y buscador actualizado!");
        // Aquí podrías limpiar el formulario de añadir producto en tu UI.

    } catch (error) {
        console.error("Error al añadir el producto:", error);
        alert(`Error al añadir el producto: ${error.message}. Por favor, revisa la consola.`);
    }
}



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
    
    // FILTRAMOS AQUÍ: Solo queremos mostrar los elementos que son de tipo 'product'.
    const productsToDisplay = items.filter(item => item.type === 'product');

    // Si no hay productos después de filtrar (pero sí hay categorías/subcategorías),
    // podrías mostrar un mensaje diferente si lo deseas, o simplemente no mostrar nada.
    if (productsToDisplay.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No encontramos productos para tu búsqueda.</p>
                <p>Prueba con otros términos.</p>
            </div>
        `;
        return; // Salimos de la función si no hay productos que mostrar.
    }

    resultsContainer.innerHTML = `
        <div class="search-results-grid">
            ${productsToDisplay.map(item => `
                <div class="product-card ${item.type}"> 
                    <div class="product-image">
                        ${item.image ? `<img class="img-search" src="${item.image}" alt="${item.name}">` : '📷'}
                    </div>
                    <div class="product-info">
                        <div class="product-name">${item.name}</div>
                        ${item.subCategoryName && item.type === 'product' ? `<div class="product-type">${item.subCategoryName}</div>` : ''}
                        ${item.categoryName && item.type === 'product' ? `<div class="product-category">${item.categoryName}</div>` : ''}
                        ${item.price && item.type === 'product' ? `<div class="product-price">${item.price}</div>` : ''} 
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

