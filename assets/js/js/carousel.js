class Carousel {
    constructor() {
        this.container = document.querySelector('.carousel-container');
        this.slides = document.querySelectorAll('.carousel-slide');
        this.dotsContainer = document.querySelector('.carousel-dots');
        this.prevButton = document.querySelector('.carousel-button.prev');
        this.nextButton = document.querySelector('.carousel-button.next');
        this.currentSlide = 0;
        
        this.init();
    }

    init() {
        // Create dots
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });

        // Add event listeners
        this.prevButton.addEventListener('click', () => this.prev());
        this.nextButton.addEventListener('click', () => this.next());

        // Start auto advance
        this.startAutoAdvance();
    }

    updateSlide() {
        this.container.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlide();
    }

    prev() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
    }

    next() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlide();
    }

    startAutoAdvance() {
        setInterval(() => this.next(), 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => new Carousel()); 