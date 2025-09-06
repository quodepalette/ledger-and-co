// Dark mode detection and handling
if (
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
) {
  document.documentElement.classList.add('dark');
}
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (event) => {
    if (event.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', String(open));
  mobileMenu.setAttribute('aria-hidden', String(!open));
});

// Close mobile menu when clicking a link
mobileMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const targetId = a.getAttribute('href');
    if (targetId.length > 1) {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// Intersection reveal animations
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Animated counters
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = !Number.isInteger(target);
  let cur = 0;
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const p = Math.min(1, (now - start) / duration);
    const val = target * p + (isFloat ? 0 : 1);
    el.textContent = isFloat ? val.toFixed(1) : Math.floor(val);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

document.querySelectorAll('.count').forEach(animateCount);

// Back to top button
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 600) {
    toTop.classList.add('show');
  } else {
    toTop.classList.remove('show');
  }
});

// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// CTA button navigation
document.getElementById('bookBtn').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
});

// Enhanced scroll effects for navbar
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(10, 15, 28, 0.95)';
    nav.style.boxShadow = 'var(--shadow-sm)';
  } else {
    nav.style.background = 'rgba(10, 15, 28, 0.8)';
    nav.style.boxShadow = 'none';
  }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// Custom modal functions instead of alert/confirm
function showFormMessage(message, type = 'success') {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';

  setTimeout(() => {
    formStatus.style.display = 'none';
  }, 5000);
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get form data
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);

  // Basic validation
  if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }

  // Disable submit button
  const submitBtn = contactForm.querySelector('.form-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    // Simulate form submission (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showFormMessage(
      "Thank you for your message! We'll get back to you within 24 hours.",
      'success'
    );
    contactForm.reset();
  } catch (error) {
    showFormMessage(
      'Sorry, there was an error sending your message. Please try again or call us directly.',
      'error'
    );
  } finally {
    // Re-enable submit button
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// Improved touch handling for mobile
let touchStartY = 0;
document.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const diff = touchStartY - touchEndY;

  // Minimal swipe gesture for mobile navigation enhancement
  if (Math.abs(diff) > 50) {
    // Optional: Add swipe-based navigation if needed
  }
});

// Stats I
document.addEventListener('DOMContentLoaded', function () {
  // Initialize charts when they come into view
  const chartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const chartId = entry.target.querySelector('canvas').id;
          initChart(chartId);
          chartObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  // Observe all stat cards
  document.querySelectorAll('.stat-card').forEach((card) => {
    chartObserver.observe(card);
  });

  // Chart initialization function
  function initChart(chartId) {
    switch (chartId) {
      case 'clientGrowthChart':
        renderClientGrowthChart();
        break;
      case 'taxSavingsChart':
        renderTaxSavingsChart();
        break;
      case 'industryChart':
        renderIndustryChart();
        break;
      case 'efficiencyChart':
        renderEfficiencyChart();
        break;
    }
  }

  // Chart 1: Client Growth (Bar Chart)
  function renderClientGrowthChart() {
    const ctx = document.getElementById('clientGrowthChart').getContext('2d');

    // Chart data
    const data = {
      labels: ['2020', '2021', '2022', '2023'],
      datasets: [
        {
          label: 'Client Count',
          data: [120, 160, 190, 230],
          backgroundColor: [
            'rgba(59, 130, 246, 0.7)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(59, 130, 246, 1)',
          ],
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: 'rgba(6, 182, 212, 0.8)',
        },
      ],
    };

    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 22, 41, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    };

    // Create chart
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  // Chart 2: Tax Savings (Doughnut Chart)
  function renderTaxSavingsChart() {
    const ctx = document.getElementById('taxSavingsChart').getContext('2d');

    // Chart data
    const data = {
      labels: ['Tax Saved', 'Tax Paid'],
      datasets: [
        {
          data: [23, 77],
          backgroundColor: [
            'rgba(16, 185, 129, 0.8)',
            'rgba(59, 130, 246, 0.4)',
          ],
          borderColor: ['rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 0.7)'],
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };

    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)',
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 22, 41, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    };

    // Create chart
    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }

  // Chart 3: Industry Breakdown (Bar Chart)
  function renderIndustryChart() {
    const ctx = document.getElementById('industryChart').getContext('2d');

    // Chart data
    const data = {
      labels: [
        'Technology',
        'Retail',
        'Manufacturing',
        'Healthcare',
        'Real Estate',
      ],
      datasets: [
        {
          label: 'Client Distribution',
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
          ],
          borderColor: [
            'rgba(59, 130, 246, 1)',
            'rgba(6, 182, 212, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(139, 92, 246, 1)',
          ],
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    };

    // Chart options
    const options = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 22, 41, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}%`;
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
            callback: function (value) {
              return value + '%';
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        },
      },
    };

    // Create chart
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  // Chart 4: Efficiency Gains (Doughnut Chart)
  function renderEfficiencyChart() {
    const ctx = document.getElementById('efficiencyChart').getContext('2d');

    // Chart data
    const data = {
      labels: ['Time Saved', 'Remaining Process'],
      datasets: [
        {
          data: [65, 35],
          backgroundColor: [
            'rgba(245, 158, 11, 0.8)',
            'rgba(59, 130, 246, 0.4)',
          ],
          borderColor: ['rgba(245, 158, 11, 1)', 'rgba(59, 130, 246, 0.7)'],
          borderWidth: 1,
          hoverOffset: 10,
        },
      ],
    };

    // Chart options
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      animation: {
        duration: 2000,
        easing: 'easeOutQuart',
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: 'rgba(255, 255, 255, 0.7)',
            padding: 15,
            font: {
              size: 12,
            },
          },
        },
        tooltip: {
          backgroundColor: 'rgba(15, 22, 41, 0.9)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(59, 130, 246, 0.5)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}%`;
            },
          },
        },
      },
    };

    // Create chart
    new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options,
    });
  }
});

// Stats II
// Animate stats when visible
const statsSection = document.getElementById('stats-ii');
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        animateStats();
        statsAnimated = true;
      }
    });
  },
  { threshold: 0.3 }
);

if (statsSection) {
  statsObserver.observe(statsSection);
}

function animateStats() {
  const statsGrid = document.querySelector('.stats-grid');

  // Animate KPI numbers
  document.querySelectorAll('.kpi-number').forEach((el) => {
    animateKPICount(el);
  });

  // Animate circular progress
  setTimeout(() => {
    document.querySelectorAll('.circular-progress').forEach((progress) => {
      const percentage = progress.dataset.percentage;
      const circle = progress.querySelector('.progress-ring-progress');
      const numberElement = progress.querySelector('.progress-number');

      // Set CSS custom property for animation
      circle.style.setProperty('--percentage', percentage);

      // Animate the circle
      const circumference = 2 * Math.PI * 54;
      const offset = circumference - (percentage / 100) * circumference;
      circle.style.strokeDashoffset = offset;

      // Animate the number
      animateProgressNumber(numberElement, percentage);
    });
  }, 200);

  // Animate bar charts
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach((bar) => {
      const width = bar.dataset.width;
      bar.style.width = width + '%';
    });
  }, 400);

  // Animate industry bars
  setTimeout(() => {
    document.querySelectorAll('.industry-bar').forEach((bar) => {
      const width = bar.dataset.width;
      bar.style.width = width + '%';
    });
  }, 600);
}

function animateKPICount(el) {
  const target = parseFloat(el.dataset.target);
  const isFloat = target % 1 !== 0;
  let current = 0;
  const duration = 2000;
  const start = performance.now();

  function updateCount(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    current = target * easeOutCubic;

    if (isFloat) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current);
    }

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      el.textContent = isFloat ? target.toFixed(1) : target;
    }
  }

  requestAnimationFrame(updateCount);
}

function animateProgressNumber(el, target) {
  let current = 0;
  const duration = 1800;
  const start = performance.now();

  function updateNumber(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    current = target * easeOutCubic;

    el.textContent = Math.floor(current);

    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(updateNumber);
}
