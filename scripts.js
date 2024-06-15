document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach((button, index) => {
        button.dataset.active = 'false';
        button.addEventListener('click', () => {
            const isActive = button.dataset.active === 'true';
            if (isActive) {
                button.classList.remove('active');
                button.dataset.active = 'false';
                console.log(`Button ${index + 1} deactivated`);
            } else {
                button.classList.add('active');
                button.dataset.active = 'true';
                console.log(`Button ${index + 1} activated`);
            }
        });
    });
});


