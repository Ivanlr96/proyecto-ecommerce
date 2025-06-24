const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const productsContainer = document.getElementById("product-cards-container")


async function getProducts() {
    const res = await fetch(API_URL)
    const products = await res.json()
    console.log(products)
    let card = ""
    products.forEach(product => {
   
        card += `
    
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
 `

    productsContainer.innerHTML = card
    });


}
getProducts()
