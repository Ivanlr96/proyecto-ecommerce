const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const productsContainer = document.getElementById("product-cards-container")


async function getProducts() {
    const res = await fetch(API_URL)
    const products = await res.json()
    console.log(products)
    
    products.forEach(product => {
        productsContainer.innerHTML = `
    
<article class="product-card">
                    <div class="product-image">
                        <img src="https://cdn.shopify.com/s/files/1/0156/6146/files/images-TraceGraphicOversizedT_ShirtGSSourPinkB4B3P_KCPK_0681_A_0092_3840x.jpg?v=1746464011"
                            alt="Trace Graphic Oversized T-Shirt">
                    </div>
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <p class="price">${product.price}</p>
                    </div>
                </article>
 `

    });


}
getProducts()
