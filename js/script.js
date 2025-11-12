/* ================================
   MyL Suplementos - script.js
================================ */

document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const toastContainer = document.getElementById("toast-container");

  /* ---------- INICIALIZAR CARRITO ---------- */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();

  function updateCartCount() {
    const totalItems = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
    if (cartCount) cartCount.textContent = totalItems;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  function showToast(message, type = "success") {
    if (!toastContainer) return;
    while (toastContainer.children.length >= 3) {
      toastContainer.children[0].remove();
    }
    const toast = document.createElement("div");
    toast.setAttribute("role", "status");
    toast.className = `p-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 ${
      type === "success" ? "bg-cyan-600" : "bg-red-600"
    }`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-x-4");
      setTimeout(() => toast.remove(), 400);
    }, 1800);
  }

  function flyToCartEffect(productImage) {
    const cartIcon = document.querySelector("a[href='cart.html'] i");
    if (!productImage || !cartIcon) return;

    const img = productImage.cloneNode(true);
    const imgRect = productImage.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    img.style.position = "fixed";
    img.style.left = imgRect.left + "px";
    img.style.top = imgRect.top + "px";
    img.style.width = imgRect.width + "px";
    img.style.height = imgRect.height + "px";
    img.style.transition = "all 0.9s cubic-bezier(0.28, 0.84, 0.42, 1)";
    img.style.zIndex = "1000";
    img.style.borderRadius = "12px";
    img.style.opacity = "0.9";
    document.body.appendChild(img);

    requestAnimationFrame(() => {
      img.style.left = cartRect.left + cartRect.width / 2 + "px";
      img.style.top = cartRect.top + cartRect.height / 2 + "px";
      img.style.width = "0px";
      img.style.height = "0px";
      img.style.opacity = "0";
      img.style.transform = "rotate(360deg)";
    });

    setTimeout(() => img.remove(), 1000);
  }

  function addToCart(button) {
    const id = button.dataset.productId;
    const name = button.dataset.productName;
    const price = parseFloat(button.dataset.price);
    const productCard = button.closest(".product-card");
    const image = productCard?.querySelector("img")?.src || "";
    const imageElement = productCard?.querySelector("img");

    const existing = cart.find((p) => p.id === id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }

    saveCart();
    showToast(`✅ ${name} añadido al carrito`);
    flyToCartEffect(imageElement);

    if (cartCount) {
      cartCount.classList.add("animate-bounce");
      setTimeout(() => cartCount.classList.remove("animate-bounce"), 600);
    }
  }

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => addToCart(button));
  });

  /* ---------- MENÚ HAMBURGUESA ---------- */
  const menuToggle = document.getElementById("menu-toggle");
  const navbarLinks = document.getElementById("navbar-links");

  if (menuToggle && navbarLinks) {
    menuToggle.addEventListener("click", () => {
      navbarLinks.classList.toggle("active");

      const icon = menuToggle.querySelector("i");
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-times");
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navbarLinks.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      });
    });
  }

  /* ---------- SWIPER (solo en index) ---------- */
  if (document.body.classList.contains("home-page") && typeof Swiper !== "undefined") {
    // Carrusel: Productos destacados
    new Swiper(".productosSwiper", {
      loop: true,
      slidesPerView: 1, // solo 1 producto visible
      spaceBetween: 30,
      centeredSlides: true,
      grabCursor: true,
      navigation: {
        nextEl: ".productosSwiper .swiper-button-next",
        prevEl: ".productosSwiper .swiper-button-prev",
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
      },
    });

    // Carrusel: Suplementos importados
    new Swiper(".importadosSwiper", {
      loop: true,
      slidesPerView: 1, // también uno por vez
      spaceBetween: 30,
      centeredSlides: true,
      grabCursor: true,
      navigation: {
        nextEl: ".importadosSwiper .swiper-button-next",
        prevEl: ".importadosSwiper .swiper-button-prev",
      },
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
      },
    });
  }

  /* ---------- FILTROS DE PRODUCTOS (productos.html) ---------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  if (filterButtons.length > 0 && products.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.filter;
        let visibleIndex = 0;

        products.forEach((product) => {
          const matches = category === "todos" || product.dataset.category === category;

          if (matches) {
            product.style.display = "block";
            product.classList.remove("hide");
            product.style.opacity = "0";

            product.classList.remove("animate-product");
            void product.offsetWidth;

            setTimeout(() => {
              product.classList.add("animate-product");
              product.style.opacity = "1";
            }, visibleIndex * 150);

            visibleIndex++;
          } else {
            product.classList.add("hide");
            setTimeout(() => {
              product.style.display = "none";
            }, 300);
          }
        });
      });
    });

    // Animación inicial
    let delay = 0;
    products.forEach((product) => {
      product.classList.remove("animate-product");
      void product.offsetWidth;
      setTimeout(() => product.classList.add("animate-product"), delay);
      delay += 120;
    });
  }

  /* ---------- ANIMACIÓN SOBRE NOSOTROS ---------- */
  const aboutCards = document.querySelectorAll(".about-card");
  if (aboutCards.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    aboutCards.forEach((card) => observer.observe(card));
  }
});

/* ---------- EFECTO SCROLL NAVBAR ---------- */
document.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});