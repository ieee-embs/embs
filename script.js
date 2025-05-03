document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link on mobile
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Background carousel functionality
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Initialize first slide
    showSlide(currentSlide);

    // Auto-advance carousel every 5 seconds
    setInterval(nextSlide, 5000);

    // Scrollspy functionality
    const sections = document.querySelectorAll("section, .carousel");
    const navLinksItems = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - 50) {
                current = section.getAttribute("id");
            }
        });

        navLinksItems.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").includes(current)) {
                link.classList.add("active");
            }
        });
    });

    // Number Ticker for Stats
    const tickers = document.querySelectorAll('.stat-ticker');

    const animateTicker = (ticker) => {
        const target = parseInt(ticker.getAttribute('data-target'));
        let count = 0;
        const increment = target / 50; // Adjust speed of animation
        const updateTicker = () => {
            count += increment;
            if (count >= target) {
                ticker.textContent = Math.floor(target);
                return;
            }
            ticker.textContent = Math.floor(count);
            requestAnimationFrame(updateTicker);
        };
        updateTicker();
    };

    // Intersection Observer to trigger ticker animation when section is in view
    const aboutSection = document.querySelector('#about');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tickers.forEach(ticker => {
                    if (!ticker.classList.contains('animated')) {
                        animateTicker(ticker);
                        ticker.classList.add('animated');
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(aboutSection);

    // Orbital Team Section Interaction
    document.querySelectorAll('.planet').forEach(planet => {
        planet.addEventListener('mouseenter', () => {
            // Pause the orbit of the current ring
            planet.closest('.orbit-ring').style.animationPlayState = 'paused';
            planet.style.animationPlayState = 'paused';
        });

        planet.addEventListener('mouseleave', () => {
            // Resume the orbit of the current ring
            planet.closest('.orbit-ring').style.animationPlayState = 'running';
            planet.style.animationPlayState = 'running';
        });
    });

    // Intersection Observer for Event Card Reveal
    const eventCards = document.querySelectorAll('.event-card');
    const eventObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    eventCards.forEach(card => {
        eventObserver.observe(card);
    });
});