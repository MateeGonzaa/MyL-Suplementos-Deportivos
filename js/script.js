/* ================================
   MyL Suplementos - script.js
================================ */

// Esperar que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const cartCount = document.getElementById("cart-count");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  const toastContainer = document.getElementById("toast-container");

  /* ---------- INICIALIZAR CARRITO ---------- */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  updateCartCount();

  /* ---------- FUNCIONES ---------- */

  // Actualiza contador del carrito (en navbar)
  function updateCartCount() {
    const totalItems = cart.reduce((sum, p) => sum + (p.quantity || 1), 0);
    if (cartCount) cartCount.textContent = totalItems;
  }

  // Guarda el carrito en localStorage
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  }

  // Muestra notificación tipo toast
  function showToast(message, type = "success") {
    if (!toastContainer) return;
    // Limitar toasts visibles a 3
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

  // Efecto: imagen del producto vuela hacia el ícono del carrito
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

  // Añade producto al carrito
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

    // Efecto visual
    flyToCartEffect(imageElement);

    // Animación leve del contador
    if (cartCount) {
      cartCount.classList.add("animate-bounce");
      setTimeout(() => cartCount.classList.remove("animate-bounce"), 600);
    }
  }

  /* ---------- EVENTOS ---------- */
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => addToCart(button));
  });

  /* ---------- BANNER SUPERIOR ---------- */
  const banner = document.querySelector(".banner-track");
  if (banner) {
    banner.addEventListener("mouseenter", () => (banner.style.animationPlayState = "paused"));
    banner.addEventListener("mouseleave", () => (banner.style.animationPlayState = "running"));
  }

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

  /* ---------- SWIPER CONFIG ---------- */
  if (typeof Swiper !== "undefined") {
    const swipers = document.querySelectorAll(".mySwiper");
    swipers.forEach((swiperEl) => {
      new Swiper(swiperEl, {
        loop: true,
        spaceBetween: 25,
        slidesPerView: 1,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: swiperEl.querySelector(".swiper-button-next"),
          prevEl: swiperEl.querySelector(".swiper-button-prev"),
        },
        pagination: {
          el: swiperEl.querySelector(".swiper-pagination"),
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    });
  }
});

/* ==== EFECTO STICKY DINÁMICO DEL NAVBAR ==== */
document.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// FILTROS DE PRODUCTOS (productos.html)
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const products = document.querySelectorAll(".product-card");

  if (filterButtons.length > 0 && products.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Cambia el botón activo
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

            // 🔹 Reiniciar animación para que se vea siempre
            product.classList.remove("animate-product");
            void product.offsetWidth; // fuerza reflow

            setTimeout(() => {
              product.classList.add("animate-product");
              product.style.opacity = "1";
            }, visibleIndex * 150); // cada producto entra con 150ms de diferencia

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

    // 🔹 Animación inicial al cargar la página
    let delay = 0;
    products.forEach((product) => {
      product.classList.remove("animate-product");
      void product.offsetWidth;
      setTimeout(() => product.classList.add("animate-product"), delay);
      delay += 120;
    });
  }
});

// === SWIPER CONFIGURACIÓN GENERAL ===
document.addEventListener("DOMContentLoaded", () => {
  // Carrusel: Productos destacados
  new Swiper(".productosSwiper", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: ".productosSwiper .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".productosSwiper .swiper-button-next",
      prevEl: ".productosSwiper .swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // Carrusel: Suplementos importados
  new Swiper(".importadosSwiper", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: true,
    autoplay: {
      delay: 3500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    navigation: {
      nextEl: ".importadosSwiper .swiper-button-next",
      prevEl: ".importadosSwiper .swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
});

// === ANIMACIÓN SUAVE EN CAMBIO DE SLIDE ===
function resetSwiperAnimations(swiperSelector) {
  const swiper = document.querySelector(swiperSelector)?.swiper;
  if (!swiper) return;

  swiper.on("slideChangeTransitionStart", () => {
    const slides = swiper.slides;
    slides.forEach((slide) => {
      const card = slide.querySelector(".product-card");
      if (card) card.style.animation = "none";
    });
  });

  swiper.on("slideChangeTransitionEnd", () => {
    const activeSlides = [
      swiper.slides[swiper.activeIndex],
      swiper.slides[swiper.activeIndex + 1],
      swiper.slides[swiper.activeIndex - 1],
    ];
    activeSlides.forEach((slide) => {
      const card = slide?.querySelector(".product-card");
      if (card) {
        card.style.animation = "productFadeUp 0.7s cubic-bezier(0.25, 0.8, 0.25, 1) forwards";
      }
    });
  });
}

// Aplicar la función a ambos Swipers
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    resetSwiperAnimations(".productosSwiper");
    resetSwiperAnimations(".importadosSwiper");
  }, 800);
});

// === INICIALIZACIÓN SWIPER (solo movimiento con flechas y drag) ===
document.addEventListener("DOMContentLoaded", () => {
  // Productos destacados
  new Swiper(".productosSwiper", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: false,
    grabCursor: true,
    navigation: {
      nextEl: ".productosSwiper .swiper-button-next",
      prevEl: ".productosSwiper .swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  // Suplementos importados
  new Swiper(".importadosSwiper", {
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
    centeredSlides: false,
    grabCursor: true,
    navigation: {
      nextEl: ".importadosSwiper .swiper-button-next",
      prevEl: ".importadosSwiper .swiper-button-prev",
    },
    breakpoints: {
      320: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });
});

// ==== Animar tarjetas al entrar en pantalla ====
  document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".about-card");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
  });
