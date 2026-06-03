// ==========================================================================
// PORTFOLIO LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Populate current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  initThemeSwitcher();
  initMobileMenu();
  initTypingAnimation();
  initProjectFiltering();
  initScrollSpy();
  initContactForm();
  initGridParallax();
});

// ==========================================================================
// GRID PARALLAX + CURSOR GLOW
// ==========================================================================
function initGridParallax() {
  const grid = document.querySelector('.bg-grid');

  // Inject cursor glow element
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  let glowX = 0, glowY = 0;
  let gridX = 0, gridY = 0;
  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Show glow on first move
    if (glow.style.opacity === '0' || glow.style.opacity === '') {
      glow.style.opacity = '1';
    }

    if (!ticking) {
      requestAnimationFrame(() => {
        // Parallax: grid moves slightly opposite to cursor (max ±20px)
        const xRatio = (mouseX / window.innerWidth - 0.5) * 2;
        const yRatio = (mouseY / window.innerHeight - 0.5) * 2;
        gridX = xRatio * 20;
        gridY = yRatio * 20;

        if (grid) {
          grid.style.transform = `translate(${gridX}px, ${gridY}px)`;
        }

        // Smooth glow follow with lerp
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = mouseX + 'px';
        glow.style.top  = mouseY + 'px';

        ticking = false;
      });
      ticking = true;
    }
  });

  // Hide glow when cursor leaves window
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    glow.style.opacity = '1';
  });
}

// ==========================================================================
// THEME SWITCHER
// ==========================================================================
function initThemeSwitcher() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const body = document.body;

  // Retrieve saved theme or detect system default
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    body.className = savedTheme;
  } else if (systemPrefersLight) {
    body.className = 'light-theme';
  } else {
    body.className = 'dark-theme';
  }

  // Toggle Event
  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
  });
}

// ==========================================================================
// MOBILE NAVIGATION MENU
// ==========================================================================
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const body = document.body;

  function toggleMenu() {
    mobileMenuBtn.classList.toggle('open');
    mobileNav.classList.toggle('open');
    
    // Toggle icon shapes
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    if (mobileNav.classList.contains('open')) {
      menuIcon.style.display = 'none';
      closeIcon.style.display = 'block';
      body.style.overflow = 'hidden'; // Stop background scrolling
    } else {
      menuIcon.style.display = 'block';
      closeIcon.style.display = 'none';
      body.style.overflow = 'auto';
    }
  }

  mobileMenuBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

// ==========================================================================
// TYPING ANIMATION (HERO SECTION)
// ==========================================================================
function initTypingAnimation() {
  const textElement = document.getElementById('typing-text');
  if (!textElement) return;

  const roles = [
    'Data Analytics Enthusiast',
    'ETL Pipeline Developer',
    'Database Developer',
    'Big Data Explorer',
    'SQL / BI Analyst'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting characters
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting is faster
    } else {
      // Typing characters
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    // Complete typing word
    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1500; // Pause at the end of the word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Loop to next word
      typingSpeed = 500; // Brief pause before starting next word
    }

    setTimeout(type, typingSpeed);
  }

  setTimeout(type, 1000); // Initial start delay
}

// ==========================================================================
// DYNAMIC PROJECT FILTERING
// ==========================================================================
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Toggle Active Button Class
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple scaling entrance animation when filtering
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        }, 300);
      });
    });
  });
}

// ==========================================================================
// SCROLL SPY & SCROLL HEADERS
// ==========================================================================
function initScrollSpy() {
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  // Handle header background shadow change on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Nav active tab highlight during scroll
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
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

  // Entry animations for elements using IntersectionObserver
  const revealElements = document.querySelectorAll('.glass-card, .timeline-item, .skill-card');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    // Add initial CSS hook states
    el.style.opacity = '0';
    el.style.transform = 'translateY(25px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
  });

  // CSS class helper for observer
  const style = document.createElement('style');
  style.innerHTML = `
    .revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
}

// ==========================================================================
// CONTACT FORM SUBMISSION HANDLER (SIMULATED)
// ==========================================================================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const responseMsg = document.getElementById('form-response');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual indicators for sending state
    submitBtn.disabled = true;
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

    const nameVal = document.getElementById('form-name').value;

    // Simulate Network Request
    setTimeout(() => {
      // Revert Button State
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show Success Message
      responseMsg.className = 'form-response success';
      responseMsg.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you, <strong>${nameVal}</strong>! Your message has been sent successfully. I will get back to you soon.`;
      responseMsg.style.display = 'block';

      // Reset Form fields
      contactForm.reset();

      // Clear response after 8 seconds
      setTimeout(() => {
        responseMsg.style.opacity = '0';
        setTimeout(() => {
          responseMsg.style.display = 'none';
          responseMsg.style.opacity = '1';
        }, 600);
      }, 8000);
    }, 1500);
  });
}
