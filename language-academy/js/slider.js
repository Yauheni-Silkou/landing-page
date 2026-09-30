document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider__track');
  let slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider__arrow--prev');
  const nextBtn = document.querySelector('.slider__arrow--next');
  const dots = document.querySelectorAll('.slider__dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 1;
  const originalLength = slides.length;
  let isTransitioning = false;

  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[originalLength - 1].cloneNode(true);

  firstClone.classList.remove('active');
  lastClone.classList.remove('active');

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = document.querySelectorAll('.slide');

  track.style.transition = 'none';
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  function moveSlider(index, animate = true) {
    if (animate) {
      if (isTransitioning) return;
      isTransitioning = true;
      track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    } else {
      track.style.transition = 'none';
    }

    track.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;

    let activeDotIndex = currentIndex - 1;
    if (currentIndex === 0) activeDotIndex = originalLength - 1;
    if (currentIndex === originalLength + 1) activeDotIndex = 0;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeDotIndex);
    });
  }

  track.addEventListener('transitionend', () => {
    isTransitioning = false;

    if (currentIndex === originalLength + 1) {
      moveSlider(1, false);
    }
    if (currentIndex === 0) {
      moveSlider(originalLength, false);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    moveSlider(currentIndex + 1);
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    moveSlider(currentIndex - 1);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isTransitioning) return;
      moveSlider(index + 1);
    });
  });

  window.addEventListener('resize', () => {
    moveSlider(currentIndex, false);
  });
});
