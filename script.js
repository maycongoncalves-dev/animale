const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-navigation]');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 28);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -30px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min((index % 4) * 65, 195)}ms`;
  observer.observe(element);
});

const magneticZone = document.querySelector('[data-magnetic-zone]');
const magneticButton = document.querySelector('[data-magnetic-button]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

if (magneticZone && magneticButton && window.gsap && !reducedMotion.matches) {
  if (window.CustomEase && window.CustomWiggle) {
    gsap.registerPlugin(CustomEase, CustomWiggle);
  }

  gsap.to(magneticButton, {
    rotation: 12,
    duration: 1.5,
    repeat: -1,
    ease: window.CustomWiggle ? 'wiggle({wiggles:8, type:easeOut})' : 'sine.inOut',
    yoyo: !window.CustomWiggle
  });

  if (finePointer.matches) {
    const strength = 0.18;

    magneticZone.addEventListener('mousemove', (event) => {
      const rect = magneticZone.getBoundingClientRect();
      const x = gsap.utils.mapRange(rect.left, rect.right, -rect.width / 2, rect.width / 2, event.clientX);
      const y = gsap.utils.mapRange(rect.top, rect.bottom, -rect.height / 2, rect.height / 2, event.clientY);

      gsap.to(magneticButton, {
        x: x * strength,
        y: y * strength,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    magneticZone.addEventListener('mouseleave', () => {
      gsap.to(magneticButton, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto'
      });
    });
  }
}
