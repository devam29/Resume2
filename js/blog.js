/* Shared behaviour for posts/*.html — theme toggle synced with the main site
   (same localStorage key: 'theme'), nothing else. No i18n: posts are English-only. */
(() => {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked */ }
    if (saved === 'light') body.classList.add('light-theme');

    const label = () => {
        if (!btn) return;
        btn.innerHTML = body.classList.contains('light-theme')
            ? '<i class="fas fa-moon"></i><span>Dark</span>'
            : '<i class="fas fa-sun"></i><span>Light</span>';
    };
    label();
    if (btn) btn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        label();
        try { localStorage.setItem('theme', body.classList.contains('light-theme') ? 'light' : 'dark'); } catch (e) { /* ignore */ }
    });
})();
