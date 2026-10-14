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

    // Close menu on Escape key press (keyboard accessibility)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('navbar-active')) {
        navbar.classList.remove('navbar-active');
        menuToggle.focus();
      }
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

  // 4b. Smooth Scroll & Focus for Waitlist Signups
  const scrollElements = document.querySelectorAll('.scroll-to-signup');
  scrollElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Locate the first available newsletter form and its input
      const targetForm = document.getElementById('heroNewsletterForm') || document.querySelector('.newsletter-form');
      const emailInput = targetForm ? targetForm.querySelector('.form-input') : null;
      
      if (targetForm && emailInput) {
        targetForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Focus and spotlight animation after scrolling finishes
        setTimeout(() => {
          emailInput.focus();
          // Add temporary glow effect to card or sidebar widget
          const container = targetForm.closest('.newsletter-card') || targetForm.closest('.sidebar-widget');
          if (container) {
            container.style.transition = 'box-shadow 0.3s ease';
            container.style.boxShadow = '0 0 40px rgba(6, 182, 212, 0.4)';
            setTimeout(() => {
              container.style.boxShadow = '';
            }, 1500);
          }
        }, 650);
      }
    });
  });

  // 4b. Category Filter & Live Search for Posts Grid
  const filterButtons = document.querySelectorAll('.filter-btn');
  const postCards = document.querySelectorAll('.tutorials-grid .card');
  const searchInput = document.getElementById('postsSearch');
  const tutorialsGrid = document.querySelector('.tutorials-grid');

  let currentCategory = 'all';
  let currentSearchQuery = '';

  const applyPostsFilter = () => {
    if (!postCards.length) return;
    let visibleCount = 0;

    postCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.card-title') || {}).textContent || '';
      const excerpt = (card.querySelector('.card-excerpt') || {}).textContent || '';
      const textToMatch = `${title} ${excerpt} ${category}`.toLowerCase();

      const matchesCategory = (currentCategory === 'all' || category.includes(currentCategory));
      const matchesSearch = (!currentSearchQuery || textToMatch.includes(currentSearchQuery));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('filter-hidden');
        visibleCount++;
      } else {
        card.classList.add('filter-hidden');
      }
    });

    let noResultsEl = document.getElementById('noSearchResults');
    if (visibleCount === 0) {
      if (!noResultsEl && tutorialsGrid) {
        noResultsEl = document.createElement('div');
        noResultsEl.id = 'noSearchResults';
        noResultsEl.className = 'search-no-results';
        noResultsEl.textContent = 'No tutorials found matching your search. Try another keyword.';
        tutorialsGrid.parentNode.insertBefore(noResultsEl, tutorialsGrid.nextSibling);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  };

  if (filterButtons.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter') || 'all';
        applyPostsFilter();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      applyPostsFilter();
    });
  }

  // 5. Cookie Consent Banner Injection & Logic
  const checkCookieConsent = () => {
    const hasConsented = localStorage.getItem('cookie_consent');
    if (hasConsented !== null) return;

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
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
      initGoogleAnalytics();
      hideBanner(banner);
    });

    rejectBtn.addEventListener('click', () => {
      localStorage.setItem('cookie_consent', 'false');
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      hideBanner(banner);
    });
  };

  const hideBanner = (bannerElement) => {
    bannerElement.classList.remove('show');
    setTimeout(() => {
      bannerElement.remove();
    }, 500);
  };

  const initGoogleAnalytics = () => {
    if (localStorage.getItem('cookie_consent') !== 'true') return;
    if (document.querySelector('script[src*="G-1KFGHVDB66"]')) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-1KFGHVDB66';
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }

    window.gtag('js', new Date());
    window.gtag('config', 'G-1KFGHVDB66');
  };

  checkCookieConsent();
  initGoogleAnalytics();

  // 6. Reading Progress Bar for Article Posts
  const proseElement = document.querySelector('.prose');
  if (proseElement) {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const rect = proseElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      const progress = Math.min(
        100,
        Math.max(0, ((-rect.top) / (totalHeight - windowHeight + 200)) * 100)
      );
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 7. Dynamic Table of Contents for Long Articles
  if (proseElement) {
    const headings = proseElement.querySelectorAll('h2');
    const sidebar = document.querySelector('.blog-sidebar');

    if (headings.length >= 3 && sidebar) {
      const tocWidget = document.createElement('div');
      tocWidget.className = 'sidebar-widget toc-widget';
      tocWidget.innerHTML = `
        <h4 class="widget-title toc-title">On This Page</h4>
        <ul class="toc-list"></ul>
      `;
      const tocList = tocWidget.querySelector('.toc-list');

      headings.forEach((heading, idx) => {
        if (!heading.id) {
          heading.id = `section-${idx + 1}-${heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
        }
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        link.addEventListener('click', (e) => {
          e.preventDefault();
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, `#${heading.id}`);
        });
        li.appendChild(link);
        tocList.appendChild(li);
      });

      sidebar.insertBefore(tocWidget, sidebar.firstChild);
    }

    // 8. Social Share Buttons at End of Prose
    const shareBar = document.createElement('div');
    shareBar.className = 'social-share-bar';
    const postTitle = document.title.split('|')[0].trim();
    const currentUrl = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(postTitle);

    shareBar.innerHTML = `
      <span class="share-label">Share Guide:</span>
      <button class="share-btn" id="copyShareBtn">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Link
      </button>
      <a class="share-btn" href="https://twitter.com/intent/tweet?url=${currentUrl}&text=${encodedTitle}" target="_blank" rel="noopener noreferrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X
      </a>
      <a class="share-btn" href="https://www.reddit.com/submit?url=${currentUrl}&title=${encodedTitle}" target="_blank" rel="noopener noreferrer">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          <path d="M8 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"/>
          <path d="M9 15c1 1 3 1 4 0" fill="none" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Reddit
      </a>
    `;

    const copyBtn = shareBar.querySelector('#copyShareBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          createNotification('Tutorial link copied to clipboard!');
        }).catch(() => {
          createNotification('Link: ' + window.location.href);
        });
      });
    }

    proseElement.appendChild(shareBar);
  }
});

