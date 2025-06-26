const API_URL2 = "http://localhost:3000/categories";

const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const btnClose = document.getElementById('close-menu');
const menuIcon = menuToggle.querySelector("i");

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

//estas dos son las categorías sólo del menú
const tabButtons = document.querySelectorAll('.gender-tabs .tab');
const categories = document.querySelectorAll('.categories');

const carouselContainer = document.querySelector('.cards-carousel');

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
    sideMenu.classList.remove("hidden");
    sideMenu.setAttribute("aria-hidden", "false");
    menuIcon.classList.replace("fa-bars", "fa-xmark");
    menuToggle.setAttribute("aria-label", "cerrar menú");
    loadSubcategoriesMenu();
}

function closeMenu() {
    sideMenu.classList.remove('visible');
    sideMenu.classList.add('hidden');
    sideMenu.setAttribute("aria-hidden", "true");
    menuIcon.classList.replace("fa-xmark", "fa-bars");
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
                link.href = `/subcategories/${subcat.id}`;
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

document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const cartCount = document.getElementById('cart-count');

    // Mostrar/ocultar mensaje de carrito
    const cartMessage = document.getElementById('cart-message');
    const summary = document.querySelector('.cart-summary');
    const totalBlock = document.querySelector('.amount');
    const body = document.body;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalAmount.textContent = "0€";
        if (cartCount) cartCount.textContent = "0";

        // Ocultar elementos
        cartMessage?.classList.add('hidden');
        summary?.classList.add('hidden');
        totalBlock?.classList.add('hidden');

        // Quitar clase de estilo visual
        body.classList.remove('active-cart');
        return;
    }

    let html = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div class="cart-image-container">
                <img src="${item.image}" alt="${item.name}" class="cart-image" width="100">
                </div>
                <div class="cart-info">
                <span class="item-name">${item.name}</span>
                <span class="item-price">${item.price}€</span>
                <span class="item-quantity">Cantidad: ${item.quantity}</span>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
                </div>
            </div>
        `;
        total += item.price * item.quantity;
        count += item.quantity;
    });

    cartItems.innerHTML = html;
    totalAmount.textContent = total.toFixed(2) + "€";
    if (cartCount) cartCount.textContent = count;

    // Mostrar elementos
    cartMessage?.classList.remove('hidden');
    summary?.classList.remove('hidden');
    totalBlock?.classList.remove('hidden');

    // Añadir clase para aplicar estilos
    body.classList.add('active-cart');

    // Eliminar producto
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.getAttribute('data-id'));
        });
    });

    // Vaciar carrito
    const clearBtn = document.getElementById('clear-cart');
    if (clearBtn) {
        clearBtn.onclick = () => {
            localStorage.removeItem('cart');
            renderCart();
        };
    }
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => String(item.id) !== String(id));
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}