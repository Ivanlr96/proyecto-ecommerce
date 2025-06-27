### **🖥 🛍 SIROKO (propuesta de rediseño)**

Rediseño de Siroko, un e-commerce pensado tanto para el administrador, que podrá Crear, Leer, Actualizar y Eliminar (CRUD) productos para su venta online, y para el usuario que pueda buscar y comprar sus productos favoritos. 🛍

Esta aplicación utiliza un servidor JSON para poder cargar los productos y simular un backend.

## **📝 Características**

USER - ADMIN

- Acceso desde el login
- Panel de administración para gestión de productos (operaciones CRUD)

USER - COMPRADOR

- Explorar productos mediante el buscador
- Filtrar por precio
- Actualización del carrito usando localStorage
- Estructura organizada por categorías (género )y subcategorías (tipología de producto)
- API pública para localizar la ubicación de tiendas en el mapa.

## Tecnologías  y metodología utilizadas

Métodología del CRUD

<img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/HTML/html3.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/CSS/css2.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Javascript/javascript2.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/JSON/json3.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/NodeJS/nodejs3.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/npm/npm1.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Github/github3.svg">
 <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/Git/git2.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/VisualStudioCode/visualstudiocode2.svg"> <img src="https://ziadoua.github.io/m3-Markdown-Badges/badges/FontAwesome/fontawesome3.svg">

## 🚀 Vamos a paso a paso

Lo primero que debemos hacer es seguir estas instrucciones para instalarla antes de ejecutarla.

**Requisitos previos**

- Node.js (última versión LTS)
- npm (incluido con Node.js)

**Instalación**

1. Clona el repositorio:

```
git clone https://github.com/Ivanlr96/proyecto-ecommerce.git
```

1. Instala las dependencias:

```
npm install
```

1. Inicia el servidor JSON

```
npm run api
```

**Como admin**

1. Abre `admin.html` en tu navegador para acceder a la aplicación.
2. Otra opción es entrar desde  `index.html` en tu navegador y acceder al icono de perfil.
3. Desde el perfil tendrás escribir en el login tus datos: 
    1. USUARIO: admin
    2. CONTRASEÑA: admin123


**Como comprador**

1. Abre `index.html` en tu navegador para acceder a la aplicación principal. 


**💻 Uso**

**Interfaz de Usuario Admin**

- Visualiza todos los productos en formato tabla
- Añade nuevos productos
- Edita productos existentes
- Elimina productos
- Busca los productos que necesites

**Interfaz de Usuario Comprador**

- Visualiza las categorías y subcategorías desde la pantalla principal
- Utiliza el menú hamurguesa para navegar entre subcategorías
- Usa el buscador para encontrar productos
- Entra en las subcategorías para filtrar productos por precio o para ver los productos.
- Entra en el producto que tu quieras, selecciona la talla en el dropdown y añádelo al carrito.
- En el carrito puedes ver los productos que estás a punto de comprar (o tu cesta vacía) y finalizar el proceso de compra.
