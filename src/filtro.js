const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const productsContainer = document.getElementById("product-cards-container");
const title = document.getElementById("name");

const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const btnClose = document.getElementById('close-menu');
const tabButtons = document.querySelectorAll('.gender-tabs .tab');
const categories = document.querySelectorAll('.categories');;

menuToggle.addEventListener("click", toggleMenu);
btnClose.addEventListener("click", closeMenu);
document.addEventListener("click", handleClickOutside);

//Funciones menú
function toggleMenu() {
    if (sideMenu.classList.contains("visible")) {
        closeMenu();
    } else {
        openMenu();
    }
}
function openMenu() {
    sideMenu.classList.add("visible");
    sideMenu.setAttribute("aria-hidden", "false");
    sideMenu.classList.replace("fa-bars", "fa-xmark");
    menuToggle.setAttribute("aria-label", "cerrar menú");
    loadSubcategoriesMenu();
}
function closeMenu() {
    sideMenu.classList.remove('visible');
    sideMenu.setAttribute("aria-hidden", "true");
    sideMenu.classList.replace("fa-xmark", "fa-bars");
    menuToggle.setAttribute("aria-label", "abrir menú");
}
function handleClickOutside(e) {
    const clickInsideMenu = sideMenu.contains(e.target);
    const clickToggle = menuToggle.contains(e.target);
    if (!clickInsideMenu && !clickToggle && sideMenu.classList.contains("visible")) {
        closeMenu();
    }
}
tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const targetId = button.getAttribute("data-target");
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        categories.forEach((cat) => {
            if (cat.id === targetId) {
                cat.classList.remove("hidden");
                cat.classList.add("active");
            } else {
                cat.classList.add("hidden");
                cat.classList.remove("active");
            }
        });
    });
});

//GET subcategorías del menú
async function loadSubcategoriesMenu() {
    try {
        const res = await fetch(API_URL2);
        const categories = await res.json();
        console.log(categories);
        const womanList = document.querySelector("#mujer ul");
        const manList = document.querySelector("#hombre ul");
        womanList.innerHTML = "";
        manList.innerHTML = "";
        categories.forEach((category) => {
            category.subcategories.forEach((subcat) => {
                const li = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/subcategory.html?category=${category.name.toLowerCase()}&subcategory=${subcat.id}`;
                link.textContent = subcat.name;
                li.appendChild(link);
                if (category.name.toLowerCase() === "mujer") {
                    womanList.appendChild(li);
                } else if (category.name.toLowerCase() === "hombre") {
                    manList.appendChild(li);
                }
            });
        });
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las subcategorías ☹️");
    }
}
loadSubcategoriesMenu();

// Lee los parámetros de la URL
const params = new URLSearchParams(window.location.search);
const gender = params.get("gender") || params.get("category"); // 'mujer' o 'hombre'
const subcategory = params.get("subcategory");

let currentSort = null;

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = 0;
  cart.forEach(item => {
    count += item.quantity ? item.quantity : 1;
  });
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
}
document.addEventListener("DOMContentLoaded", updateCartCount);
window.addEventListener("storage", updateCartCount);

// Escucha los cambios 
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
    updateCartCount(); 
    alert('Producto añadido al carrito');
}
}