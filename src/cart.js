document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const cartCount = document.getElementById('cart-count');

    const cartMessage = document.getElementById('cart-message');
    const summary = document.querySelector('.cart-summary');
    const totalBlock = document.querySelector('.amount');
    const body = document.body;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
        totalAmount.textContent = "0€";
        if (cartCount) cartCount.textContent = "0";

        cartMessage?.classList.add('hidden');
        summary?.classList.add('hidden');
        totalBlock?.classList.add('hidden');

        body.classList.remove('active-cart');
        return;
    }

    let html = "";
    let total = 0;
    let count = 0;
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" width="50">
                <span>${item.name}</span>
                <span>${item.price}€</span>
                <span>Cantidad: ${item.quantity}</span>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        total += item.price * item.quantity;
        count += item.quantity;
    });
    cartItems.innerHTML = html;
    totalAmount.textContent = total.toFixed(2) + "€";
    if (cartCount) cartCount.textContent = count;

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