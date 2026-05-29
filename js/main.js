// NAV: scroll + hamburger
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// GALERIA: gera placeholders e abre lightbox
const galeriaLabels = [
  'Fio a Fio – Natural', 'Volume Russo – Intenso', 'Volume Brasileiro',
  'Wispy – Fox Eyes', 'Híbrido – Textura', 'Volume Egípcio',
  'Olho de Gato', 'Boneca', 'Volume Russo – Leques'
];

const grid = document.getElementById('galeriaGrid');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbCaption = document.getElementById('lightboxCaption');
let currentLbIndex = 0;

galeriaLabels.forEach((label, i) => {
  const item = document.createElement('div');
  item.className = 'galeria__item';
  item.innerHTML = `
    <div class="galeria__placeholder">
      <i class="fa-solid fa-camera"></i>
      <span>${label}</span>
    </div>
    <div class="galeria__overlay"><i class="fa-solid fa-magnifying-glass-plus"></i></div>
  `;
  item.addEventListener('click', () => openLightbox(i));
  grid.appendChild(item);
});

function openLightbox(index) {
  currentLbIndex = index;
  lbImg.src = '';
  lbImg.alt = galeriaLabels[index];
  lbCaption.textContent = galeriaLabels[index];
  lightbox.setAttribute('aria-hidden', 'false');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);

document.getElementById('lightboxNext').addEventListener('click', () => {
  currentLbIndex = (currentLbIndex + 1) % galeriaLabels.length;
  lbImg.alt = galeriaLabels[currentLbIndex];
  lbCaption.textContent = galeriaLabels[currentLbIndex];
});

document.getElementById('lightboxPrev').addEventListener('click', () => {
  currentLbIndex = (currentLbIndex - 1 + galeriaLabels.length) % galeriaLabels.length;
  lbImg.alt = galeriaLabels[currentLbIndex];
  lbCaption.textContent = galeriaLabels[currentLbIndex];
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
});

// CAROUSEL de depoimentos
const track = document.getElementById('carouselTrack');
const cards = track.querySelectorAll('.depo__card');
const dotsWrap = document.getElementById('carouselDots');
let current = 0;

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'carousel__dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  current = index;
  track.style.transform = `translateX(-${current * 100}%)`;
  dotsWrap.querySelectorAll('.carousel__dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

document.getElementById('carouselNext').addEventListener('click', () => {
  goTo((current + 1) % cards.length);
});
document.getElementById('carouselPrev').addEventListener('click', () => {
  goTo((current - 1 + cards.length) % cards.length);
});

// auto-play carousel
setInterval(() => goTo((current + 1) % cards.length), 5000);

// FORMULÁRIO → WhatsApp
document.getElementById('contatoForm').addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const servico = document.getElementById('servico').value;
  const mensagem = document.getElementById('mensagem').value.trim();

  let texto = `Olá! Me chamo *${nome}* e tenho interesse no serviço: *${servico}*.`;
  if (mensagem) texto += `\n\n${mensagem}`;

  const url = `https://wa.me/5567900000000?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
});

// SCROLL REVEAL simples
const observerOptions = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.card, .preco__card, .formato__card, .depo__card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
