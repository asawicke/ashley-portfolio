import './styles.css';

const yearNode = document.querySelector('#current-year');
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const navLinks = [...document.querySelectorAll('[data-nav]')];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href') || ''))
  .filter(Boolean);

function setActiveLink(activeId) {
  navLinks.forEach((link) => {
    if (link.getAttribute('data-nav') === activeId) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if ('IntersectionObserver' in window && sections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { threshold: 0.5 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else if (navLinks[0]) {
  setActiveLink(navLinks[0].dataset.nav || 'about');
}

const revealElements = document.querySelectorAll('.reveal');
if (revealElements.length > 0 && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('.profile-photo, .project-visual').forEach((element) => {
  element.addEventListener('dragstart', (event) => event.preventDefault());
});

const dialog = document.querySelector('[data-contact-dialog]');
const openButton = document.querySelector('[data-open-contact]');
const closeButtons = document.querySelectorAll('[data-close-contact]');
const contactForm = document.querySelector('[data-contact-form]');

function openDialog() {
  if (dialog instanceof HTMLDialogElement && typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

function closeDialog() {
  if (dialog instanceof HTMLDialogElement && dialog.open) {
    dialog.close();
  }
}

openButton?.addEventListener('click', openDialog);
closeButtons.forEach((button) => button.addEventListener('click', closeDialog));

dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) {
    closeDialog();
  }
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const email = String(formData.get('email') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const recipient = 'your-email@example.com';
  const mailSubject = encodeURIComponent(subject || 'Portfolio inquiry');
  const body = encodeURIComponent(`From: ${email}\n\n${message}`);

  window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${body}`;
  closeDialog();
});