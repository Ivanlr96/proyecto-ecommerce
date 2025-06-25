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