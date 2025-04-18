document.addEventListener('DOMContentLoaded', () => {
    const map = document.querySelector('.zoomable-map');
    let scale = 1;
    const scaleStep = 0.1;
    const maxScalePC = 3;
    const maxScaleMobile = 8.25;
    const minScale = 1;
    let isPanning = false;
    let startX, startY, translateX = 0, translateY = 0;
    let lastTranslateX = 0, lastTranslateY = 0;

    const constrainTranslate = () => {
        const rect = map.getBoundingClientRect();
        const mapWidth = rect.width;
        const mapHeight = rect.height;
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        // Constrain translation
        translateX = Math.min(Math.max(translateX, containerWidth / 2 - mapWidth), containerWidth / 2);
        translateY = Math.min(Math.max(translateY, containerHeight - mapHeight), containerHeight / 1.75);
    };

    const updateTransform = () => {
        map.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    };

    // Re-centering the map on initial load for smaller screens
    const recenterMapOnLoad = () => {
        const rect = map.getBoundingClientRect();
        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;

        // Center the map
        translateX = (containerWidth - rect.width) / 2;
        translateY = (containerHeight - rect.height) / 2;

        updateTransform();
    };

    // Run the recenterMapOnLoad function only once on page load
    window.addEventListener('load', () => {
        if (window.innerWidth < 768) {
            recenterMapOnLoad();
        }
    });

    if (map) {
        // Zoom functionality
        map.addEventListener('wheel', (event) => {
            event.preventDefault();
            if (event.deltaY < 0) {
                scale = Math.min(scale + scaleStep, maxScalePC);
            } else {
                scale = Math.max(scale - scaleStep, minScale);
            }
            updateTransform();
        });

        // Panning functionality
        map.addEventListener('mousedown', (event) => {
            event.preventDefault();
            isPanning = true;
            startX = event.clientX - translateX;
            startY = event.clientY - translateY;
            map.style.cursor = 'grabbing';
            map.classList.add('panning');
        });

        document.addEventListener('mousemove', (event) => {
            if (!isPanning) return;
            translateX = event.clientX - startX;
            translateY = event.clientY - startY;
            constrainTranslate();
            updateTransform();
        });

        document.addEventListener('mouseup', () => {
            isPanning = false;
            map.style.cursor = 'grab';
            map.classList.remove('panning');
        });

        map.addEventListener('mouseleave', () => {
            isPanning = false;
            map.style.cursor = 'grab';
            map.classList.remove('panning');
        });

        map.style.cursor = 'grab';

        // Touch start for mobile
        map.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                isPanning = true;
                const touch = event.touches[0];
                startX = touch.clientX - (translateX/2);
                startY = touch.clientY - (translateY/2);
                map.classList.add('panning');
            }
        });

        map.addEventListener('touchmove', (event) => {
            if (!isPanning || event.touches.length !== 1) return;
            const touch = event.touches[0];
            translateX = touch.clientX - startX;
            translateY = touch.clientY - startY;
            constrainTranslate();
            updateTransform();
            event.preventDefault();
        }, { passive: false });

        map.addEventListener('touchend', () => {
            isPanning = false;
            map.classList.remove('panning');
        });

        // Pinch zoom functionality
        let initialDistance = 0;
        let initialScale = scale;

        map.addEventListener('touchmove', (event) => {
            if (event.touches.length === 2) {
                const touch1 = event.touches[0];
                const touch2 = event.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (initialDistance === 0) {
                    initialDistance = currentDistance;
                    initialScale = scale;
                } else {
                    const scaleChange = currentDistance / initialDistance;
                    scale = Math.min(Math.max(initialScale * scaleChange, minScale), maxScaleMobile);
                    updateTransform();
                }

                event.preventDefault();
            }
        }, { passive: false });

        map.addEventListener('touchend', (event) => {
            if (event.touches.length < 2) {
                initialDistance = 0;
            }
        });
    }

    // Check if the current page is the one where the ash animation should run
    const isHomePage = document.getElementById('homePage');

    if (isHomePage) {
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

    // Hamburger menu for smaller screens
    const toggleMenu = () => {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('active');
    };

    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleMenu);
    }
});
