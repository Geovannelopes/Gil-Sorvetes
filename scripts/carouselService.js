export async function iniciarCarrossel() {
    const items = document.querySelectorAll('.destaque');
    const indicators = document.querySelectorAll('.indicator');
    
    if (items.length === 0) return;

    let active = 0;
    const total = items.length;
    let timer;

    function update(direction) {
        // Remove classe active do item atual
        document.querySelector('.destaque.active')?.classList.remove('active');
        document.querySelector('.indicator.active')?.classList.remove('active');

        if (direction > 0) {
            active = active + 1;
            if (active == total) {
                active = 0;
            }
        } else if (direction < 0) {
            active = active - 1;
            if (active < 0) {
                active = total - 1;
            }
        }

        // Adiciona classe active ao novo item
        items[active].classList.add('active');
        if (indicators[active]) {
            indicators[active].classList.add('active');
        }
    }

    function goToSlide(index) {
        document.querySelector('.destaque.active')?.classList.remove('active');
        document.querySelector('.indicator.active')?.classList.remove('active');
        
        active = index;
        items[active].classList.add('active');
        if (indicators[active]) {
            indicators[active].classList.add('active');
        }
        
        // Reiniciar timer
        clearInterval(timer);
        startTimer();
    }

    function startTimer() {
        timer = setInterval(() => {
            update(1);
        }, 5000);
    }

    // Adicionar event listeners aos indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Iniciar o timer
    startTimer();

    // Pausar no hover (opcional)
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(timer);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startTimer();
        });
    }
}