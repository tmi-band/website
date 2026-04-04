// ===== Mobile Navigation =====
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop - 80;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollY >= top && scrollY < bottom) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + id) {
          a.classList.add('active');
        }
      });
    }
  });
});

// ===== Load Songs from API =====
const SONGS_URL = 'https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/songs';

fetch(SONGS_URL)
  .then(res => res.json())
  .then(data => {
    const songs = JSON.parse(data.body).songs;
    const tbody = document.querySelector('#song-table tbody');
    const loading = document.getElementById('songs-loading');

    songs.forEach(song => {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' + escapeHtml(song.title) + '</td>' +
        '<td>' + escapeHtml(song.artist) + '</td>';
      tbody.appendChild(row);
    });

    loading.style.display = 'none';
  })
  .catch(() => {
    document.getElementById('songs-loading').textContent =
      'Unable to load songs. Please try again later.';
  });

// ===== Load Events from API =====
const EVENTS_URL = 'https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/events';

fetch(EVENTS_URL)
  .then(res => res.json())
  .then(data => {
    const events = JSON.parse(data.body).events;
    const now = Date.now();

    const upcoming = events.filter(e => Date.parse(e.start) >= now);
    const past = events.filter(e => Date.parse(e.start) < now).reverse();

    const upcomingContainer = document.getElementById('upcoming-events');
    const pastContainer = document.getElementById('past-events');
    const loadingEl = document.getElementById('events-loading');

    loadingEl.style.display = 'none';

    if (upcoming.length === 0) {
      document.getElementById('no-upcoming').style.display = 'block';
    }

    upcoming.forEach(e => upcomingContainer.appendChild(createEventCard(e)));
    past.forEach(e => pastContainer.appendChild(createEventCard(e)));
  })
  .catch(() => {
    document.getElementById('events-loading').textContent =
      'Unable to load events. Please try again later.';
  });

function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';
  card.innerHTML =
    '<div class="event-date">' + escapeHtml(event.date) + '</div>' +
    '<div>' +
      '<div class="event-venue">' + escapeHtml(event.venue.name) + '</div>' +
      '<div class="event-address">' + escapeHtml(event.venue.address) + '</div>' +
    '</div>' +
    '<div class="event-details">' +
      '<div class="event-time">' + escapeHtml(event.time) + '</div>' +
      '<div class="event-cost">' + escapeHtml(event.cost) + '</div>' +
    '</div>';
  return card;
}

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');
const CONTACT_URL = 'https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/contact';

contactForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  if (name.length < 2) {
    alert('Please enter your name (at least 2 characters).');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  const phoneRegex = /[0-9]{10}/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid 10-digit phone number.');
    return;
  }

  const data = { name, phone, email, desc: message };

  fetch(CONTACT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(() => {
      contactForm.reset();
      document.getElementById('contact-success').style.display = 'block';
      setTimeout(() => {
        document.getElementById('contact-success').style.display = 'none';
      }, 5000);
    })
    .catch(() => {
      alert('There was a problem sending your message. Please try again.');
    });
});

// ===== Mailing List Form =====
const mlForm = document.getElementById('mailing-list-form');

mlForm.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('ml-name').value.trim();
  const email = document.getElementById('ml-email').value.trim();

  if (!name || !email) return;

  // Placeholder: wire this up to your mailing list backend
  mlForm.reset();
  document.getElementById('ml-success').style.display = 'block';
  setTimeout(() => {
    document.getElementById('ml-success').style.display = 'none';
  }, 5000);
});

// ===== Gallery Lightbox =====
const galleryImages = document.querySelectorAll('.gallery-grid img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxPrev = lightbox.querySelector('.lightbox-prev');
const lightboxNext = lightbox.querySelector('.lightbox-next');
let currentImageIndex = 0;

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    currentImageIndex = index;
    openLightbox();
  });
});

function openLightbox() {
  lightboxImg.src = galleryImages[currentImageIndex].src;
  lightboxImg.alt = galleryImages[currentImageIndex].alt;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.style.display = 'none';
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  openLightbox();
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  openLightbox();
});

document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'none') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext.click();
});

// ===== Utility =====
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
