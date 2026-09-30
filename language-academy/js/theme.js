document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  if (themeBtn) {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');

    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('app-theme', nextTheme);
      themeBtn.setAttribute('aria-pressed', !isDark ? 'true' : 'false');
    });
  }

  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__nav-link');

  if (burgerBtn && navMenu) {
    function toggleMenu() {
      const isOpen = burgerBtn.classList.toggle('open');
      navMenu.classList.toggle('open');
      
      if (isOpen) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
      
      burgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closeMenu() {
      burgerBtn.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      burgerBtn.setAttribute('aria-expanded', 'false');
    }

    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }
});
