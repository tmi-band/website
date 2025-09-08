// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            navMenu.classList.remove('active');
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Gallery Lightbox
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = item.src;
    });
});

closeBtn?.addEventListener('click', () => {
    lightbox.style.display = 'none';
});

lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
    }
});

// Load Events from AWS Lambda
async function loadEvents() {
    const upcomingContainer = document.getElementById('upcoming-events');
    const pastContainer = document.getElementById('past-events');
    
    try {
        const response = await fetch('https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/events', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const data = await response.json();
        const events = JSON.parse(data.body).events;
        
        const now = new Date();
        const upcoming = [];
        const past = [];
        
        events.forEach(event => {
            const eventDate = new Date(event.start);
            if (eventDate >= now) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });
        
        // Sort upcoming events by date (earliest first)
        upcoming.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        // Sort past events by date (most recent first)
        past.sort((a, b) => new Date(b.start) - new Date(a.start));
        
        // Display upcoming events
        if (upcoming.length > 0) {
            upcomingContainer.innerHTML = upcoming.map(event => createEventCard(event)).join('');
        } else {
            upcomingContainer.innerHTML = '<p class="no-events">No upcoming events scheduled. Check back soon!</p>';
        }
        
        // Display past events (limit to 10 most recent)
        if (past.length > 0) {
            pastContainer.innerHTML = past.slice(0, 10).map(event => createEventCard(event)).join('');
        } else {
            pastContainer.innerHTML = '<p class="no-events">No past events to display.</p>';
        }
        
    } catch (error) {
        console.error('Error loading events:', error);
        upcomingContainer.innerHTML = '<p class="error">Unable to load events. Please try again later.</p>';
        pastContainer.innerHTML = '';
    }
}

function createEventCard(event) {
    const eventDate = new Date(event.start);
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' });
    const day = eventDate.getDate();
    
    return `
        <div class="event-card">
            <div class="event-date">
                <div class="event-date-month">${month}</div>
                <div class="event-date-day">${day}</div>
            </div>
            <div class="event-details">
                <h4>${event.venue.name}</h4>
                <p>${event.venue.address}</p>
                <p class="event-time">${event.time} • ${event.cost}</p>
            </div>
        </div>
    `;
}

// Load Songs from AWS Lambda
async function loadSongs() {
    const songsContainer = document.getElementById('songs-list');
    
    try {
        const response = await fetch('https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/songs', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('Failed to fetch songs');
        
        const data = await response.json();
        const songs = JSON.parse(data.body).songs;
        
        if (songs.length > 0) {
            songsContainer.innerHTML = songs.map(song => `
                <div class="song-card">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
            `).join('');
        } else {
            songsContainer.innerHTML = '<p class="no-songs">Song list coming soon!</p>';
        }
        
    } catch (error) {
        console.error('Error loading songs:', error);
        songsContainer.innerHTML = '<p class="error">Unable to load songs. Please try again later.</p>';
    }
}

// Contact Form Handler
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: '', // Add phone field if needed
        desc: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('https://cpsb1m4cnk.execute-api.us-west-2.amazonaws.com/production/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('Sorry, there was an error sending your message. Please try again later or contact us directly.');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
    loadSongs();
});