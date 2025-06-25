// document.addEventListener('DOMContentLoaded', function() {
//   const searchIcon = document.querySelector('.menu-search');
//   const searchBar = document.querySelector('.search-bar');

// const searchContainer = document.querySelector('.search');

//   searchIcon.addEventListener('click', function() {
//     searchBar.classList.toggle('active'); // Toggle the 'active' class
//     if (searchBar.classList.contains('active')) {
//       searchBar.focus(); // Focus on the search bar when it opens
//     }
//   });
  
//   document.addEventListener('click', function(event) {
//     if (!searchContainer.contains(event.target) && searchBar.classList.contains('active')) {
//       searchBar.classList.remove('active');
//       searchBar.value = '';
//     }
//   });
// });



        // DATOS DE EJEMPLO - En producción vendrían de una API
        const mockProducts = [
            { id: 1, name: "Vestido midi flores", price: "25,95 €", category: "vestidos" },
            { id: 2, name: "Jean skinny negro", price: "19,95 €", category: "jeans" },
            { id: 3, name: "Camiseta básica blanca", price: "7,95 €", category: "camisetas" },
            { id: 4, name: "Chaqueta denim", price: "35,95 €", category: "chaquetas" },
            { id: 5, name: "Vestido corto negro", price: "22,95 €", category: "vestidos" },
            { id: 6, name: "Jean mom fit", price: "24,95 €", category: "jeans" },
            { id: 7, name: "Camiseta rayas", price: "12,95 €", category: "camisetas" },
            { id: 8, name: "Zapatos tacón", price: "29,95 €", category: "zapatos" }
        ];

        let searchTimeout;

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
            
            // Filtrar productos (simulación de búsqueda)
            const results = mockProducts.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );
            
            if (results.length > 0) {
                displayResults(results);
            } else {
                displayNoResults(query);
            }
        }

        // MOSTRAR RESULTADOS
        function displayResults(products) {
            const resultsContainer = document.getElementById('resultsContainer');
            
            // ¿Por qué uso template literals y map?
            // Template literals permiten HTML multilínea legible
            // map() transforma cada producto en HTML
            // join('') convierte el array en string
            resultsContainer.innerHTML = `
                <div class="search-results-grid">
                    ${products.map(product => `
                        <div class="product-card">
                            <div class="product-image">📷</div>
                            <div class="product-info">
                                <div class="product-name">${product.name}</div>
                                <div class="product-price">${product.price}</div>
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
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
  
