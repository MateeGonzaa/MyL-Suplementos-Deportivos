// ---------------------------------------
// script.js - MyL Suplementos (Versión Pro con efecto fly-to-cart)
// ---------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- ELEMENTOS ---------- */
  const cartCount = document.getElementById("cart-count");
  const toastContainer = document.getElementById("toast-container");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

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
    const toast = document.createElement("div");
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
    img.style.transition =
      "all 0.9s cubic-bezier(0.28, 0.84, 0.42, 1)";
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
});

/// -------------------------------
// CARRUSELES DE PRODUCTOS (mejorados con autoplay + indicadores)
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach((carousel) => {
    const track = carousel.querySelector(".carousel-track");
    const slides = Array.from(track.children);
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");
    const indicatorContainer = carousel.querySelector(".carousel-indicators");

    let currentIndex = 0;
    let autoPlayInterval;

    // Crear indicadores dinámicamente
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.className =
        "w-3 h-3 rounded-full bg-gray-400 hover:bg-cyan-500 transition-all duration-300";
      dot.addEventListener("click", () => {
        currentIndex = i;
        updateCarousel();
        resetAutoPlay();
      });
      indicatorContainer.appendChild(dot);
    });

    const dots = Array.from(indicatorContainer.children);

    // Ajustar el ancho del track según cantidad de slides
    track.style.width = `${slides.length * 100}%`;
    slides.forEach((slide) => {
      slide.style.width = `${100 / slides.length}%`;
      slide.style.flexShrink = "0";
    });

    // Mostrar slide actual
    function updateCarousel() {
      track.style.transform = `translateX(-${currentIndex * (100 / slides.length)}%)`;
      dots.forEach((dot, i) => {
        dot.className =
          i === currentIndex
            ? "w-3 h-3 rounded-full bg-cyan-600 scale-110 transition-all"
            : "w-3 h-3 rounded-full bg-gray-400 hover:bg-cyan-500 transition-all";
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel();
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 6000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    // Eventos
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetAutoPlay();
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    // Inicialización
    updateCarousel();
    startAutoPlay();
  });
});

// ---------------------------------------
// FILTROS DE PRODUCTOS (productos.html)
// ---------------------------------------
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

        products.forEach((product) => {
          if (category === "todos" || product.dataset.category === category) {
            product.style.display = "block";
            product.classList.add("animate-fade-in-up");
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".banner-track");
  if (banner) {
    banner.addEventListener("mouseenter", () => banner.style.animationPlayState = "paused");
    banner.addEventListener("mouseleave", () => banner.style.animationPlayState = "running");
  }
});

/// ---------------------------------------
// MENÚ HAMBURGUESA (mobile optimizado)
// ---------------------------------------
document.addEventListener("DOMContentLoaded", () => {
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
});

// ---------------------------------------
// CARRUSELES DE PRODUCTOS (versión móvil estable)
// ---------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel-container').forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(track?.children || []);
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if (!track || slides.length === 0) return;

    // === Clonar para loop infinito ===
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = Array.from(track.children);
    let currentIndex = 1;
    let isTransitioning = false;
    let autoplayInterval;
    let slideWidth = slides[0].getBoundingClientRect().width;

    // Posicionamiento inicial
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

    // Easing personalizado tipo “rebote”
    const easing = 'cubic-bezier(0.45, 0.05, 0.55, 0.95)';

    // === Actualiza la posición del carrusel ===
    const updateCarousel = (animate = true) => {
      slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transition = animate
        ? `transform 1.1s ${easing}, opacity 0.8s ease`
        : 'none';
      track.style.opacity = animate ? '0.9' : '1';
      setTimeout(() => {
        track.style.opacity = '1';
      }, 400);
      track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    };

    const moveToNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateCarousel();
    };

    const moveToPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateCarousel();
    };

    // === Flechas ===
    nextBtn?.addEventListener('click', () => {
      moveToNext();
      resetAutoplay();
    });

    prevBtn?.addEventListener('click', () => {
      moveToPrev();
      resetAutoplay();
    });

    // === Transición infinita (loop) ===
    track.addEventListener('transitionend', () => {
      if (allSlides[currentIndex].isEqualNode(firstClone)) {
        currentIndex = 1;
        updateCarousel(false);
      } else if (allSlides[currentIndex].isEqualNode(lastClone)) {
        currentIndex = slides.length;
        updateCarousel(false);
      }
      isTransitioning = false;
    });

    // === Swipe táctil ===
    let startX = 0;
    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      pauseAutoplay();
    });

    track.addEventListener('touchend', e => {
      const endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) moveToNext();
      else if (endX - startX > 50) moveToPrev();
      resetAutoplay();
    });

    // === Reajuste al redimensionar ===
    window.addEventListener('resize', () => updateCarousel(false));

    // === Autoplay con pausa al interactuar ===
    const startAutoplay = () => {
      autoplayInterval = setInterval(() => {
        moveToNext();
      }, 4500); // pasa cada 4.5 segundos
    };

    const pauseAutoplay = () => clearInterval(autoplayInterval);
    const resetAutoplay = () => {
      pauseAutoplay();
      startAutoplay();
    };

    // === Inicialización ===
    updateCarousel(false);
    startAutoplay();
  });
});


// ---------------------------------------
// EFECTO SCROLL: Fade + Slide (reveal)
// ---------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  function checkReveal() {
    const windowHeight = window.innerHeight;
    reveals.forEach((el) => {
      const revealTop = el.getBoundingClientRect().top;
      if (revealTop < windowHeight * 0.85) {
        el.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", checkReveal);
  checkReveal(); // ejecutar una vez al cargar
});

function showToast(message, type = "success") {
  if (!toastContainer) return;
  // Limitar toasts visibles a 3
  while (toastContainer.children.length >= 3) {
    toastContainer.children[0].remove();
  }
  const toast = document.createElement("div");
  toast.setAttribute("role","status");
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


