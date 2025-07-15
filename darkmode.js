document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleDark');
    const apply = () => {
        if (localStorage.getItem('dark-mode') === 'true') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    };
    apply();
    if (toggle) {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const current = localStorage.getItem('dark-mode') === 'true';
            localStorage.setItem('dark-mode', !current);
            apply();
        });
    }
});
