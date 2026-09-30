document.addEventListener('DOMContentLoaded', () => {
  const cardGrid = document.querySelector('.catalog__grid');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const paginationWrapper = document.querySelector('.catalog__pagination');
  const modalOverlay = document.getElementById('course-modal');
  const modalCloseBtn = document.querySelector('.modal-close');
  const modalDynamicContent = document.getElementById('modal-dynamic-content');

  
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
          <img src="${course.image}" alt="${course.name}" loading="lazy">
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

  function openModal(courseId) {
    const course = allCourses.find(item => item.id === courseId);
    if (!course) return;

    let basePrice = course.price;
    let intensityModifier = 0;
    let formatModifier = 0;

    modalDynamicContent.innerHTML = `
      <div class="modal-body-wrapper">
        <div class="modal__img-wrapper">
          <img src="${course.image}" alt="${course.name}">
        </div>
        <div class="modal__details">
          <span class="modal-title">${course.name}</span>
          <p class="modal-desc">${course.description}</p>

          <div class="modal__meta-group">
            <span class="modal__meta-item"><strong>Duration:</strong> ${course.duration}</span>
            <span class="modal__meta-item"><strong>Prerequisites:</strong> ${course.prerequisites}</span>
          </div>

          <div class="modal__options-group">
            <span class="modal__options-label">Select Intensity:</span>
            <div class="modal__options-row" id="intensity-row">
              <button class="modal__option-btn active" data-mod="0">${course.parameters.intensity.name}</button>
              <button class="modal__option-btn" data-mod="${course.parameters.intensity.int_price}">${course.parameters.intensity.intensive} (+$${course.parameters.intensity.int_price})</button>
            </div>
          </div>

          <div class="modal__options-group">
            <span class="modal__options-label">Select Format:</span>
            <div class="modal__options-row" id="format-row">
              <button class="modal__option-btn active" data-mod="0">${course.parameters.format.group}</button>
              <button class="modal__option-btn" data-mod="${course.parameters.format.priv_price}">${course.parameters.format.private} (+$${course.parameters.format.priv_price})</button>
            </div>
          </div>

          <div class="modal-footer-info" style="font-size: 24px; font-weight:700; margin-top:16px; border-top: 1px dashed var(--btn-border); padding-top:16px;">
            Total Tuition: <span id="modal-total-price">$${basePrice}</span> / mo
          </div>
        </div>
      </div>
    `;

    const totalPriceSpan = document.getElementById('modal-total-price');
    const intensityButtons = document.querySelectorAll('#intensity-row .modal__option-btn');
    const formatButtons = document.querySelectorAll('#format-row .modal__option-btn');

    function updateTotalPrice() {
      const liveTotal = basePrice + intensityModifier + formatModifier;
      totalPriceSpan.textContent = `$${liveTotal}`;
    }

    intensityButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        intensityButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        intensityModifier = parseInt(e.currentTarget.getAttribute('data-mod'), 10);
        updateTotalPrice();
      });
    });

    formatButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        formatButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        formatModifier = parseInt(e.currentTarget.getAttribute('data-mod'), 10);
        updateTotalPrice();
      });
    });

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  cardGrid.addEventListener('click', (e) => {
    const clickedCard = e.target.closest('.card');
    if (clickedCard) {
      const courseId = clickedCard.getAttribute('data-id');
      openModal(courseId);
    }
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
  });

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
