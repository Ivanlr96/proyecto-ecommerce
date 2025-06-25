// Selecciona los elementos del HTML
const cartItemsContainer = document.getElementById('cart-items');
const totalAmountSpan = document.getElementById('total-amount'); // Cambiado de cart-total a total-amount
const clearCartBtn = document.getElementById('clear-cart');
const cartCountElement = document.getElementById('cart-count'); // Para actualizar el contador en el navbar

// Función para obtener el carrito del localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cartItems')) || [];
}

// Función para guardar el carrito en el localStorage
function saveCart(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
  updateCartCount(); // Actualizar el contador cada vez que se guarda el carrito
}

// Función para eliminar un ítem del carrito
function removeItemFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  renderCart(); // Volver a renderizar el carrito después de eliminar
}

// Función para mostrar el carrito en la página
function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>El carrito está vacío.</p>";
  } else {
    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('cart-item'); // Añadir clase para estilos

      // Asumiendo que tienes una imagen para el producto (puedes ajustar esto)
      const imageUrl = item.image || 'https://via.placeholder.com/120x120?text=Producto'; // Imagen de placeholder si no hay

      itemDiv.innerHTML = `
        <img src="${imageUrl}" alt="${item.name}">
        <div class="item-details">
          <h2>${item.name}</h2>
          <p>Cantidad: ${item.quantity}</p>
          <p>Precio unitario: €${item.price.toFixed(2)}</p>
          <p>Subtotal: €${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button class="remove-item" data-id="${item.id}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(itemDiv);
      total += item.price * item.quantity;
    });
  }

  totalAmountSpan.textContent = total.toFixed(2); // Actualizar el total

  // Añadir event listeners a los botones de eliminar
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.dataset.id;
      removeItemFromCart(productId);
    });
  });
}

// Función para actualizar el contador del carrito en la navegación
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Botón para vaciar el carrito
clearCartBtn.addEventListener('click', () => {
  localStorage.removeItem('cartItems');
  renderCart();
  updateCartCount();

});

// Mostrar carrito al cargar la página del carrito
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartCount(); // Asegúrate de que el contador se actualice al cargar la página
});