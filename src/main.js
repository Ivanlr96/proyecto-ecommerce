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
function toggleMenu() {
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

// GET de los dos carruseles
async function loadCategories() {
  carouselContainer.innerHTML = "";
  
  try {

  const res = await fetch(`${API_URL2}`);
  const categoriesData = await res.json();

  const resSubcategories = await fetch(`${API_URL2}`);
  const subcategories = await resSubcategories.json();
  console.log(subcategories)

  
  categoriesData.forEach((category) => {
    category.subcategories.forEach((subcat) => {
      const subcategoryImage = subcategories.find(p => p.subcategoryId === subcat.id && p.image);

      if(!subcategoryImage) return;

      const card = document.createElement("div");
      card.classList.add("card-category");

      card.innerHTML = `
      <div class="image-wrapper">
       <img src="${subcategoryImage.image}" alt=${subcat.name}"/>
      </div>
      <div class="card-content">
        <span class="subcategory-name">@${subcat.name.toUpperCase()}</span>
       <button class="btn-category" onclick="location.href='/subcategories/${subcat.id}'">
       <button class="btn-category" onclick="location.href='/subcategorias/${subcat.id}'">
             ${subcat.name}
            </button>
          </div>`;
    });
    
  });
 } catch(error){
    alert("error al cargar las subcategorías ☹️❗️");
    console.error(error);
 }
}

loadCategories();