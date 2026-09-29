document.addEventListener('DOMContentLoaded', () => {
  const cardGrid = document.querySelector('.catalog__grid');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const paginationWrapper = document.querySelector('.catalog__pagination');
  
  if (!cardGrid) return;

  let allCourses = [];
  let activeCategory = 'english';
  let isExpanded = false;

  async function loadCoursesData() {
    try {
      const response = await fetch('./assets/data/courses.json');
      if (!response.ok) throw new Error('Network file access error');
      const data = await response.json();
      allCourses = data.courses;
      
      renderCatalog();
      window.addEventListener('resize', handleWindowResize);
    } catch (error) {
      console.error('Failed to parse catalog records:', error);
      cardGrid.innerHTML = `<p class="error-msg">Failed to load courses. Please try again later.</p>`;
    }
  }

  function renderCatalog() {
    cardGrid.innerHTML = '';

    const filteredCourses = allCourses.filter(course => course.category === activeCategory);
    const windowWidth = window.innerWidth;

    const shouldLimit = windowWidth <= 768 && !isExpanded;
    const cardsToDisplay = shouldLimit ? filteredCourses.slice(0, 4) : filteredCourses;

    cardsToDisplay.forEach(course => {
      const cardArticle = document.createElement('article');
      cardArticle.classList.add('card');
      cardArticle.setAttribute('data-id', course.id);

      cardArticle.innerHTML = `
        <div class="card__img-wrapper">
          <img src="${course.image}" alt="${course.name}">
        </div>
        <div class="card__content">
          <span class="card__tag">${course.category}</span>
          <span class="card__title">${course.name}</span>
          <p class="card__desc">${course.description}</p>
          <div class="card__footer">
            <span class="card__price">$${course.price} / mo</span>
          </div>
        </div>
      `;

      cardGrid.appendChild(cardArticle);
    });

    if (windowWidth <= 768 && filteredCourses.length > 4 && !isExpanded) {
      paginationWrapper.style.display = 'flex';
    } else {
      paginationWrapper.style.display = 'none';
    }
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      isExpanded = true;
      renderCatalog();
    });
  }

  categoryButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const targetCategory = e.currentTarget.getAttribute('data-category');

      if (activeCategory === targetCategory) return;

      categoryButtons.forEach(btn => btn.classList.remove('active'));
      e.currentTarget.classList.add('active');

      activeCategory = targetCategory;
      isExpanded = false; 
      renderCatalog();
    });
  });

  function handleWindowResize() {
    renderCatalog();
  }

  loadCoursesData();
});
