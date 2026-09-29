document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider__track');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider__arrow--prev');
  const nextBtn = document.querySelector('.slider__arrow--next');
  const dots = document.querySelectorAll('.slider__dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function moveNext() {
    if (currentIndex < totalSlides - 1) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateSlider();
  }

  function movePrev() {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = totalSlides - 1;
    }
    updateSlider();
  }

  nextBtn.addEventListener('click', moveNext);
  prevBtn.addEventListener('click', movePrev);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlider();
    });
  });

  window.addEventListener('resize', () => {
    updateSlider();
  });
});
