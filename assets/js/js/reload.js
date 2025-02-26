// Simple reload functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create reload button
    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'reload-button';
    reloadBtn.textContent = '🔄 Reload';
    document.querySelector('.conference-container').appendChild(reloadBtn);

    // Handle reload
    reloadBtn.addEventListener('click', () => {
        window.location.reload();
    });
}); 