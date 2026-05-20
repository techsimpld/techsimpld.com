/* 
  Tech Simpld - Script
  Provides interactivity: mobile menu, forms validation, mock resources download.
  Author: Tech Simpld
*/

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');

  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.toggle('navbar-active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navbar.classList.contains('navbar-active')) {
        navbar.classList.remove('navbar-active');
      }
    });

    // Close menu when clicking a link
    const navLinks = navbar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('navbar-active');
      });
    });
  }

  // 2. Newsletter Signup Simulation
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('.form-input');
      const submitBtn = form.querySelector('.btn');
      const messageDiv = form.querySelector('.form-message') || document.createElement('div');
      
      if (!form.querySelector('.form-message')) {
        messageDiv.className = 'form-message';
        form.appendChild(messageDiv);
      }

      const email = emailInput.value.trim();

      // Simple email validation pattern
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!email) {
        showFeedback(messageDiv, 'Please enter your email address.', 'error');
        return;
      }

      if (!emailPattern.test(email)) {
        showFeedback(messageDiv, 'Please enter a valid email address.', 'error');
        return;
      }

      // Simulate API call
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Simplifying...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showFeedback(messageDiv, 'Success! Check your inbox to confirm your subscription.', 'success');
        emailInput.value = '';
      }, 1200);
    });
  });

  function showFeedback(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    
    // Auto-fade warning or errors, success stays
    if (type === 'error') {
      setTimeout(() => {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = '0';
        setTimeout(() => {
          element.textContent = '';
          element.className = 'form-message';
          element.style.opacity = '1';
        }, 500);
      }, 4000);
    }
  }

  // 3. Resource Download Simulation & Feedback
  const downloadButtons = document.querySelectorAll('.btn-download');
  const downloadCounter = document.getElementById('download-count');

  downloadButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If downloading an actual file is setup, let it flow. Here we mimic visual completion.
      const resourceName = btn.dataset.resource || 'Obsidian Starter Vault';
      
      // Update UI to show downloading progress
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.style.width = `${btn.offsetWidth}px`; // prevent sizing jump
      btn.innerHTML = `
        <svg style="animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="6"></line>
          <line x1="12" y1="18" x2="12" y2="22"></line>
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
        </svg> 
        Preparing Vault...
      `;

      // Inject standard keyframe spin inline if not in css
      if (!document.getElementById('spin-keyframe')) {
        const style = document.createElement('style');
        style.id = 'spin-keyframe';
        style.innerHTML = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
      }

      setTimeout(() => {
        // Increment visual counter
        if (downloadCounter) {
          let currentVal = parseInt(downloadCounter.textContent.replace(/,/g, ''), 10);
          if (!isNaN(currentVal)) {
            currentVal += 1;
            downloadCounter.textContent = currentVal.toLocaleString();
          }
        }

        // Complete state
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Downloading!
        `;
        
        // Show success notification badge
        createNotification(`Downloading ${resourceName}! Check your system downloads folder.`);

        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }, 3000);
      }, 1500);
    });
  });

  // Create temporary screen notification
  function createNotification(text) {
    let notifyContainer = document.querySelector('.notification-container');
    if (!notifyContainer) {
      notifyContainer = document.createElement('div');
      notifyContainer.className = 'notification-container';
      notifyContainer.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        pointer-events: none;
      `;
      document.body.appendChild(notifyContainer);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      background: var(--bg-tertiary);
      border: 1px solid var(--border-focus);
      border-left: 4px solid var(--accent-cyan);
      color: var(--text-primary);
      padding: 1rem 1.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.9rem;
      font-weight: 500;
      box-shadow: var(--shadow-md);
      transform: translateY(20px);
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    toast.textContent = text;
    notifyContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    // Remove notification after delay
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // 4. Simple Tag Filter (Interactive search simulation)
  const tagButtons = document.querySelectorAll('.tag-filter');
  const tutorialCards = document.querySelectorAll('.tutorials-grid .card');

  if (tagButtons.length > 0 && tutorialCards.length > 0) {
    tagButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active styling
        tagButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const selectedTag = btn.dataset.tag;

        tutorialCards.forEach(card => {
          const cardCategory = card.querySelector('.card-category').textContent.toLowerCase();
          
          if (selectedTag === 'all' || cardCategory === selectedTag.toLowerCase()) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 5. Cookie Consent Banner Injection & Logic
  const checkCookieConsent = () => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (hasConsented === 'true') return;

    // Create banner
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p class="cookie-text">
          We use cookies to analyze site traffic, optimize your template downloads, and support non-intrusive ads. By clicking "Accept", you agree to our use of cookies.
        </p>
        <div class="cookie-buttons">
          <button id="cookie-reject" class="btn btn-secondary btn-sm">Dismiss</button>
          <button id="cookie-accept" class="btn btn-primary btn-sm">Accept</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Slide in
    setTimeout(() => {
      banner.classList.add('show');
    }, 1000);

    // Event Listeners
    const acceptBtn = banner.querySelector('#cookie-accept');
    const rejectBtn = banner.querySelector('#cookie-reject');

    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'true');
      hideBanner(banner);
    });

    rejectBtn.addEventListener('click', () => {
      hideBanner(banner);
    });
  };

  const hideBanner = (bannerElement) => {
    bannerElement.classList.remove('show');
    setTimeout(() => {
      bannerElement.remove();
    }, 500);
  };

  checkCookieConsent();
});

