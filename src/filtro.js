const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const productsContainer = document.getElementById("product-cards-container");
const title = document.getElementById("name");

// Lee los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const gender = params.get("gender") || params.get("category"); // 'mujer' o 'hombre'
const subcategory = params.get("subcategory");

let currentSort = null;

// Escucha los cambios en los radios de orden
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('input[name="sort"]').forEach(radio => {
        radio.addEventListener("change", (e) => {
            currentSort = e.target.value;
            getProducts();
        });
    });
    getProducts();
});

async function getProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    let filteredProducts = products;

    // Filtra por género si existe
    let genderId;
    if (gender) {
        genderId = gender === "hombre" ? "1" : "2";
        filteredProducts = filteredProducts.filter(product => String(product.categoryId) === genderId);
        title.textContent = gender.toUpperCase();
    } else {
        title.textContent = "Todos nuestros productos disponibles";
    }

    // Filtra por subcategoría si existe
    if (subcategory) {
        filteredProducts = filteredProducts.filter(product => String(product.subcategoryId) === subcategory);

        // Obtener el nombre de la subcategoría
        const resCat = await fetch(API_URL2);
        const categories = await resCat.json();
        const categoryObj = categories.find(cat => String(cat.id) === genderId);
        let subcatName = subcategory;
        if (categoryObj) {
            const subcatObj = categoryObj.subcategories.find(sub => String(sub.id) === subcategory);
            if (subcatObj) {
                subcatName = subcatObj.name.toUpperCase();
            }
        }
        title.textContent = `${subcatName} DE ${gender.toUpperCase()}`;
    }

    // Ordena por precio si hay sort seleccionado
    if (currentSort === "low-to-high") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === "high-to-low") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    let html = "";
    filteredProducts.forEach(product => {
        html += `
        <article class="product-card">
            <div class="product-image">
            <a href="product.html?id=${product.id}" class="product-link">
                <img src="${product.image}" alt="${product.name}">
                </a>
                <button class="add-to-cart" aria-label="Add to Cart" data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i>
                </button>
            </div>
            <div class="product-details">
           <h4 class="product-link">${product.name}
            </h4>
                <p class="price">${product.price}€</p>
            </div>
        </article>
    `;
    });
    productsContainer.innerHTML = html;

    // Añade listeners a los botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = btn.getAttribute('data-id');
            const prod = filteredProducts.find(p => String(p.id) === id);
            addToCart(prod);
        });
    });

    // Función para añadir al carrito en localStorage
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto añadido al carrito');
    }
}