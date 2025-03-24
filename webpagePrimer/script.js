document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('.zoomable-map');
    let scale = 1;
    const scaleStep = 0.1;
    const maxScale = 3;
    const minScale = 1;
    let isPanning = false;
    let startX, startY, translateX = 0, translateY = 0;

    if (map) {
        // Zoom functionality
        map.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                scale = Math.min(scale + scaleStep, maxScale);
            } else {
                scale = Math.max(scale - scaleStep, minScale);
            }
            map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        });

        // Panning functionality
        map.addEventListener('mousedown', (event) => {
            event.preventDefault(); // Prevents default dragging behavior
            isPanning = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
            map.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (event) => {
            if (!isPanning) return;
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
        });

        document.addEventListener('mouseup', () => {
            isPanning = false;
            map.style.cursor = 'grab';
        });

        // In case the cursor leaves the map area while dragging
        map.addEventListener('mouseleave', () => {
            isPanning = false;
            map.style.cursor = 'grab';
        });

        map.style.cursor = 'grab';

        // Touch start for mobile
        map.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                isPanning = true;
                const touch = event.touches[0];
                startX = touch.clientX - translateX;
                startY = touch.clientY - translateY;
            }
        });

        // Touch move for mobile
        map.addEventListener('touchmove', (event) => {
            if (!isPanning || event.touches.length !== 1) return;
            const touch = event.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
            event.preventDefault(); // Prevents scrolling
        }, { passive: false });

        // Touch end for mobile
        map.addEventListener('touchend', () => {
            isPanning = false;
        });
    }

    // Ashes animation
    const ashesContainer = document.getElementById('ashes-container');
    const numberOfAshes = 100;

    for (let i = 0; i < numberOfAshes; i++) {
        const ash = document.createElement('div');
        ash.classList.add('ash');
        ash.style.left = `${Math.random() * 100}vw`;
        ash.style.animationDuration = `${Math.random() * 5 + 5}s`;
        ash.style.animationDelay = `${Math.random() * 5}s`;
        ashesContainer.appendChild(ash);
    }

    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementsByClassName('close')[0];

    if (modal && modalImg && closeBtn) {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => {
                modal.style.display = 'block';
                modalImg.src = img.src;
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
