/* script.js – FoodRescue interactions */

// ── Dark Mode Toggle ──────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');

// Persist preference
if (localStorage.getItem('fr-dark') === 'true') {
  document.body.classList.add('dark');
  darkToggle.textContent = '☀️';
}

darkToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  darkToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('fr-dark', isDark);
});

// ── Sticky nav shadow on scroll ───────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 10
    ? '0 4px 20px rgba(0,0,0,0.1)'
    : 'none';
});

// ── Smooth scroll for anchor nav links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CTA button alerts (placeholder for real auth flow) ────────────
document.getElementById('btnDonate').addEventListener('click', () => {
  document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('btnSignUp').addEventListener('click', () => {
  alert('Sign Up coming soon! 🌱');
});
document.getElementById('btnSignIn').addEventListener('click', () => {
  alert('Sign In coming soon! 🌿');
});

// ── Scroll-reveal for .step, .stat, .card ─────────────────────────
const revealEls = document.querySelectorAll('.step, .stat, .card');

// Set initial hidden state
revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
});

const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = [...entry.target.parentElement.children];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 100);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach(el => observer.observe(el));

// ── Animated counter for stats ────────────────────────────────────
function animateCounter(el, target, suffix) {
  let start = 0;
  const duration = 1400;
  const step = 16;
  const increment = target / (duration / step);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start) + suffix;
  }, step);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numEl = entry.target.querySelector('.stat-num');
      const text = numEl.textContent.trim();          // e.g. "2K+"
      const isK = text.includes('K');
      const rawNum = parseFloat(text.replace(/[^0-9.]/g, ''));
      const suffix = isK ? 'K+' : text.replace(/[0-9.]/g, '');

      numEl.innerHTML = '';                           // clear content
      const spanNum = document.createElement('span');
      spanNum.className = 'counter-val';
      numEl.appendChild(spanNum);

      // Recreate the colored suffix span
      const spanSuf = document.createElement('span');
      spanSuf.style.color = 'var(--orange)';
      numEl.appendChild(spanSuf);

      let count = 0;
      const duration = 1400;
      const step = 16;
      const increment = rawNum / (duration / step);

      const timer = setInterval(() => {
        count += increment;
        if (count >= rawNum) { count = rawNum; clearInterval(timer); }
        spanNum.textContent = Math.floor(count) + (isK ? 'K' : '');
        spanSuf.textContent = '+';
      }, step);

      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat').forEach(el => statObserver.observe(el));
