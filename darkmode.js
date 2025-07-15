document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('toggleDark');
    const apply = () => {
        const enabled = localStorage.getItem('dark-mode') === 'true';
        if (enabled) {
            document.body.classList.add('dark');
            document.body.style.backgroundColor = '#222';
        } else {
            document.body.classList.remove('dark');
            document.body.style.backgroundColor = 'azure';
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
