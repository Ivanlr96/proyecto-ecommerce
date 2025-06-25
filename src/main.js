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

  // Carrito: Cargar categorias dinamicamente desde la Api

  const categoriesWoman = document.querySelector("#woman ul");
const categoriesMan = document.querySelector("#man ul");

async function loadCategories() {
    try {
        const response = await fetch(API_URL2);
        if (!response.ok) {
            throw new Error("Error al cargar categorías");
        }
        const data = await response.json();

        // Filtra categorías por género
        const womanCategories = data.filter(cat => cat.gender === "woman");
        const manCategories = data.filter(cat => cat.gender === "man");

        // Renderiza categorías de mujer
        categoriesWoman.innerHTML = "";
        womanCategories.forEach(cat => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = cat.name;
            li.appendChild(a);
            categoriesWoman.appendChild(li);
        });

        // Renderiza categorías de hombre
        categoriesMan.innerHTML = "";
        manCategories.forEach(cat => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = cat.name;
            li.appendChild(a);
            categoriesMan.appendChild(li);
        });

    } catch (error) {
        console.error(error);
    }
}

// Ejecutar carga de categorías cuando se abre el menú por primera vez
menuToggle.addEventListener("click", () => {
    if (!sideMenu.classList.contains("visible")) {
        loadCategories();
    }
});

// Ejecutar al cargar
renderProducts();

// Función leer el carrito desde localStorage
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Función guardar el carrito en localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función añade un producto al carrito
function addToCart(item) {
  const cart = getCart();
  const existingItem = cart.find(product => product.id === item.id);

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  alert(`Has añadido ${item.name} al carrito.`);
}


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

// GET de los dos carruseles
async function loadCategories() {
  carouselContainer.innerHTML = "";
  try {
  const res = await fetch(`${API_URL2}`);
  const categoriesData = await res.json();
 
  categoriesData.forEach((category) => {
    const carousel = document.querySelector(`#carousel-${category.name.toLowerCase()}`);
    category.subcategories.forEach((subcat) => {
     
      const card = document.createElement("div");
      card.classList.add("card-category");
      console.log(subcat.name);
      card.innerHTML = `
      <div class="image-wrapper">
      </div>
      <div class="card-content">
      <img class="photo" src="${subcat.image}">
       <button class="btn-category" onclick="location.href='/subcategories/${subcat.id}'">
             ${subcat.name.toUpperCase()}
            </button>
          </div>`;
          carousel.appendChild(card);
    });
  });
 } catch(error){
    alert("error al cargar las subcategorías ☹️❗️");
    console.error(error);
 }
}
loadCategories();