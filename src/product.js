const API_URL = "http://localhost:3000/products";
const API_URL2 = "http://localhost:3000/categories";

const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const btnClose = document.getElementById('close-menu');
const menuIcon = menuToggle.querySelector("i");

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
    const womanList = document.querySelector("#woman ul");
    const manList = document.querySelector("#man ul");
    womanList.innerHTML = "";
    manList.innerHTML = "";
    categories.forEach((category) => {
      category.subcategories.forEach((subcat) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `/subcategories/${subcat.id}`;
        link.textContent = subcat.name;
        li.appendChild(link);
        if (category.name.toLowerCase() === "woman") {
          womanList.appendChild(li);
        } else if (category.name.toLowerCase() === "man") {
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

//GET de los textos

document.addEventListener("DOMContentLoaded", async () => {
    // --- Cargar producto ---
    const btnAdd = document.getElementById('btn-add');
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    let selectedValue = '';
    let product = null;

    // Dropdown
    const customSelect = document.getElementById('customSelect');
    const dropdownOptions = document.getElementById('dropdownOptions');
    const textSelect = customSelect.querySelector('.text-select');

    let isOpen = false;

    function toggleDropdown() {
        isOpen = !isOpen;
        customSelect.classList.toggle('active', isOpen);
        dropdownOptions.classList.toggle('show', isOpen);
        if (isOpen) {
            customSelect.focus();
        } else {
            customSelect.blur();
        }
    }
    function closeDropdown() {
        if (isOpen) {
            isOpen = false;
            customSelect.classList.remove('active');
            dropdownOptions.classList.remove('show');
        }
    }
    function selectOption(option) {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        if (option.classList.contains('placeholder')) return;
        selectedValue = value;
        textSelect.textContent = text;
        document.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        closeDropdown();
        btnAdd.disabled = !selectedValue;
    }
    customSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });
    dropdownOptions.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.dropdown-option');
        if (option) selectOption(option);
    });
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target) && !dropdownOptions.contains(e.target)) {
            closeDropdown();
        }
    });
    btnAdd.disabled = true;

    // --- Cargar datos del producto ---
    if (!id) return;
    try {
        const res = await fetch(API_URL);
        const products = await res.json();
        product = products.find(p => String(p.id) === id);

        if (product) {
            document.getElementById('product-image').src = product.image;
            document.getElementById('product-image').alt = product.name;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = product.price + "€";
            document.getElementById('product-description').textContent = product.description || "";
        } else {
            document.getElementById('product-name').textContent = 'Producto no encontrado';
            btnAdd.disabled = true;
        }
    } catch (error) {
        document.getElementById('product-name').textContent = 'Error al cargar el producto';
        btnAdd.disabled = true;
    }

    // --- Añadir al carrito con talla ---
    btnAdd.addEventListener("click", () => {
        if (!selectedValue) {
            alert('Por favor, selecciona una talla');
            return;
        }
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Busca por id y talla
        const existing = cart.find(item => item.id === product.id && item.size === selectedValue);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, size: selectedValue });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Producto añadido al carrito');
        // window.location.href = "cart.html"; // Descomenta si quieres redirigir
    });
});













//Dropdown y botón
document.addEventListener('DOMContentLoaded', () => {
    const customSelect = document.getElementById('customSelect');
    const dropdownOptions = document.getElementById('dropdownOptions');
    const textSelect = customSelect.querySelector('.text-select');
    const btnAdd = document.getElementById('btn-add');
    
    let selectedValue = '';
    let isOpen = false;

    // Función para abrir/cerrar dropdown
    function toggleDropdown() {
        isOpen = !isOpen;
        customSelect.classList.toggle('active', isOpen);
        dropdownOptions.classList.toggle('show', isOpen);
        
        if (isOpen) {
            // Focus en el dropdown para capturar eventos de teclado
            customSelect.focus();
        } else {
            customSelect.blur();
        }
    }

    // Función para cerrar dropdown
    function closeDropdown() {
        if (isOpen) {
            isOpen = false;
            customSelect.classList.remove('active');
            dropdownOptions.classList.remove('show');
        }
    }

    // Función para seleccionar opción
    function selectOption(option) {
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        // No seleccionar si es el placeholder
        if (option.classList.contains('placeholder')) {
            return;
        }
        
        selectedValue = value;
        textSelect.textContent = text;
        
        // Actualizar clases selected
        document.querySelectorAll('.dropdown-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        closeDropdown();
        
        // Habilitar/deshabilitar botón
        btnAdd.disabled = !selectedValue;
    }

    // Event listeners
    customSelect.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown();
    });

    // Click en opciones
    dropdownOptions.addEventListener('click', (e) => {
        e.stopPropagation();
        const option = e.target.closest('.dropdown-option');
        if (option) {
            selectOption(option);
        }
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target) && !dropdownOptions.contains(e.target)) {
            closeDropdown();
        }
    });

    // Funcionalidad del botón
   // btnAdd.addEventListener('click', () => {
     //   if (selectedValue) {
       //     alert(`Añadido al carrito: Talla ${selectedValue}`);
       // } else {
        //    alert('Por favor, selecciona una talla');
        //}
   // });

    // Estado inicial del botón
    btnAdd.disabled = true;
});