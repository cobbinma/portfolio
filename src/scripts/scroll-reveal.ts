export function initScrollReveal() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: just make everything visible
    document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing for performance
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animationClasses = [
    '.fade-in-up',
    '.fade-in',
    '.slide-in-left',
    '.slide-in-right',
    '.scale-in'
  ];

  animationClasses.forEach(className => {
    document.querySelectorAll(className).forEach(el => {
      observer.observe(el);
    });
  });
}
