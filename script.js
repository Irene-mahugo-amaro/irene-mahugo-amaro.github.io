document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.idioma-tabs button');
  const panels = document.querySelectorAll('.idioma-contenido');

  tabs.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;

      tabs.forEach((btn) => {
        btn.classList.toggle('tab-activa', btn === button);
        btn.setAttribute('aria-selected', String(btn === button));
      });

      panels.forEach((panel) => {
        const isActive = panel.id === target;
        panel.classList.toggle('activo', isActive);
        panel.hidden = !isActive;
      });
    });
  });

  const dropdownTrigger = document.querySelector('.nav-trigger');
  const dropdown = document.querySelector('.dropdown-content');

  if (dropdownTrigger && dropdown) {
    dropdownTrigger.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = dropdown.classList.toggle('is-open');
      dropdownTrigger.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (event) => {
      if (!dropdown.contains(event.target) && !dropdownTrigger.contains(event.target)) {
        dropdown.classList.remove('is-open');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dot'));
  let currentSlide = 0;

  if (slides.length && dots.length) {
    const updateCarousel = (index) => {
      currentSlide = (index + slides.length) % slides.length;

      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === currentSlide);
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
        dot.setAttribute('aria-selected', String(dotIndex === currentSlide));
      });
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => updateCarousel(index));
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      setInterval(() => updateCarousel(currentSlide + 1), 5000);
    }
  }

  const modal = document.querySelector('.modal-proyecto');
  const modalClose = document.querySelector('.modal-cerrar');
  const modalCards = document.querySelectorAll('.tarjeta-boton');

  if (modal && modalClose) {
    const openModal = () => {
      modal.classList.add('activo');
      document.body.classList.add('modal-abierto');
    };

    const closeModal = () => {
      modal.classList.remove('activo');
      document.body.classList.remove('modal-abierto');
    };

    modalCards.forEach((button) => {
      button.addEventListener('click', openModal);
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeModal();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('activo')) {
        closeModal();
      }
    });
  }
});
