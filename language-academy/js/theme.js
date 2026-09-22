document.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('theme-btn');
  if (!themeBtn) return;
  const savedTheme = localStorage.getItem('app-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeBtn.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('app-theme', nextTheme);
    themeBtn.setAttribute('aria-pressed', nextTheme === 'dark' ? 'true' : 'false');
  });
});