document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('.zoomable-map');
    let scale = 1;
    const scaleStep = 0.1;
    const maxScale = 3;
    const minScale = 1;
    let isPanning = false;
    let startX, startY, translateX = 0, translateY = 0;

    map.addEventListener('wheel', (event) => {
        event.preventDefault();
        if (event.deltaY < 0) {
            // Zoom in
            scale = Math.min(scale + scaleStep, maxScale);
        } else {
            // Zoom out
            scale = Math.max(scale - scaleStep, minScale);
        }
        map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    });

    map.addEventListener('mousedown', (event) => {
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

    map.addEventListener('mouseleave', () => {
        isPanning = false;
        map.style.cursor = 'grab';
    });

    map.style.cursor = 'grab';
});