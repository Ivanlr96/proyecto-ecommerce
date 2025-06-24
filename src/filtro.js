const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const productsContainer = document.getElementById("product-cards-container");

// Lee el parámetro de la URL
const params = new URLSearchParams(window.location.search);
const gender = params.get("gender"); // 'woman' o 'man'

async function getProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();

    // Filtra según el género
    let filteredProducts = products;
    if (gender) {

        const genderId = gender === "man" ? "1" : "2";
        filteredProducts = products.filter(product => String(product.categoryId) === genderId);
    }

    let html = "";
    filteredProducts.forEach(product => {
        html += `
            <article class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="add-to-cart" aria-label="Add to Cart">
                        <i class="fa-solid fa-cart-plus"></i>
                    </button>
                </div>
                <div class="product-details">
                    <h4>${product.name}</h4>
                    <p class="price">${product.price}€</p>
                </div>
            </article>
        `;
    });

    productsContainer.innerHTML = html;
}

getProducts();