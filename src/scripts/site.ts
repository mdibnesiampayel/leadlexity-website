const root = document.documentElement;
const themeToggle = document.querySelector<HTMLButtonElement>('#theme-toggle');
const themeMenu = document.querySelector<HTMLElement>('#theme-menu');
const themeOptions = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-value]')];
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
let preference = root.dataset.themePreference || 'system';

function applyTheme(value: string, persist = false) {
  preference = ['light', 'dark', 'system'].includes(value) ? value : 'system';
  const resolved = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
  root.dataset.theme = resolved;
  root.dataset.themePreference = preference;
  root.style.colorScheme = resolved;
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = resolved === 'dark' ? '#101813' : '#fbfcf9';
  });
  themeOptions.forEach((option) =>
    option.setAttribute('aria-checked', String(option.dataset.themeValue === preference)),
  );
  const name = preference.charAt(0).toUpperCase() + preference.slice(1);
  themeToggle?.setAttribute('aria-label', `Theme: ${name}. Change color theme`);
  if (persist) {
    try {
      localStorage.setItem('leadlexity-theme', preference);
    } catch {
      /* Theme still works without storage. */
    }
  }
}

function closeTheme(returnFocus = false) {
  if (themeMenu) themeMenu.hidden = true;
  themeToggle?.setAttribute('aria-expanded', 'false');
  if (returnFocus) themeToggle?.focus();
}
function openTheme() {
  if (!themeMenu) return;
  themeMenu.hidden = false;
  themeToggle?.setAttribute('aria-expanded', 'true');
  themeOptions.find((option) => option.dataset.themeValue === preference)?.focus();
}
applyTheme(preference);
systemTheme.addEventListener('change', () => applyTheme(preference));
window.addEventListener('storage', (event) => {
  if (event.key === 'leadlexity-theme') applyTheme(event.newValue || 'system');
});
themeToggle?.addEventListener('click', () => (themeMenu?.hidden ? openTheme() : closeTheme(true)));
themeToggle?.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
    event.preventDefault();
    openTheme();
  }
});
themeOptions.forEach((option) =>
  option.addEventListener('click', () => {
    applyTheme(option.dataset.themeValue || 'system', true);
    closeTheme(true);
  }),
);
themeMenu?.addEventListener('keydown', (event) => {
  const index = themeOptions.indexOf(document.activeElement as HTMLButtonElement);
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    closeTheme(true);
  } else if (event.key === 'Tab') closeTheme();
  else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? 2
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + 3) % 3;
    themeOptions[next]?.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!(event.target as Element).closest('.theme-switcher')) closeTheme();
});

const mobileToggle = document.querySelector<HTMLButtonElement>('#mobile-toggle');
const mobileNav = document.querySelector<HTMLElement>('#mobile-navigation');
const backdrop = document.querySelector<HTMLElement>('#nav-backdrop');
const header = document.querySelector<HTMLElement>('#site-header');
const main = document.querySelector<HTMLElement>('#main-content');
const footer = document.querySelector<HTMLElement>('#site-footer');
const desktopQuery = window.matchMedia('(min-width: 1081px)');

function closeNavigation(returnFocus = false) {
  if (mobileNav) mobileNav.hidden = true;
  if (backdrop) backdrop.hidden = true;
  mobileToggle?.setAttribute('aria-expanded', 'false');
  mobileToggle?.setAttribute('aria-label', 'Open navigation menu');
  document.body.classList.remove('navigation-open');
  if (main) main.inert = false;
  if (footer) footer.inert = false;
  if (returnFocus) mobileToggle?.focus();
}
function openNavigation() {
  if (!mobileNav || desktopQuery.matches) return;
  closeTheme();
  mobileNav.hidden = false;
  if (backdrop) backdrop.hidden = false;
  mobileToggle?.setAttribute('aria-expanded', 'true');
  mobileToggle?.setAttribute('aria-label', 'Close navigation menu');
  document.body.classList.add('navigation-open');
  if (main) main.inert = true;
  if (footer) footer.inert = true;
  mobileNav.querySelector<HTMLAnchorElement>('a')?.focus();
}
mobileToggle?.addEventListener('click', () =>
  mobileNav?.hidden ? openNavigation() : closeNavigation(true),
);
backdrop?.addEventListener('click', () => closeNavigation(true));
mobileNav
  ?.querySelectorAll('a')
  .forEach((link) => link.addEventListener('click', () => closeNavigation()));
desktopQuery.addEventListener('change', (event) => {
  if (event.matches) closeNavigation();
});
document.addEventListener('keydown', (event) => {
  if (mobileNav?.hidden !== false) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    closeTheme();
    closeNavigation(true);
  }
  if (event.key === 'Tab' && header) {
    const focusable = [
      ...header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ].filter((el) => el.offsetParent !== null && el.getAttribute('tabindex') !== '-1');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
  );
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    if (element.getBoundingClientRect().top > window.innerHeight - 24) {
      element.classList.add('will-reveal');
      observer.observe(element);
    }
  });
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      document.querySelectorAll('.will-reveal').forEach((el) => el.classList.add('is-visible'));
      observer.disconnect();
    }
  });
}

// Highlight the service currently being read; navigation stays native and usable without JS.
const serviceLinks = [...document.querySelectorAll<HTMLAnchorElement>('.service-nav a')];
if (serviceLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      serviceLinks.forEach((link) => {
        const active = link.hash === `#${visible.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    },
    { rootMargin: '-15% 0px -60% 0px', threshold: 0 },
  );
  document.querySelectorAll('.service-detail').forEach((section) => observer.observe(section));
}
