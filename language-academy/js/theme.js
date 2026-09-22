document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  themeBtn.setAttribute('aria-pressed', currentTheme === 'dark' ? 'true' : 'false');
  themeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nextTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    themeBtn.setAttribute('aria-pressed', !isDark ? 'true' : 'false');
  });
});