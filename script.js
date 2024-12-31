// Configurações Globais
const ease = "power4.inOut";
let lastScrollPosition = 0;
let isReversed = false;

// Funções de Transição
function revealTransition() {
    return new Promise((resolve) => {
        gsap.set(".block", { scaleY: 1 });
        gsap.to(".block", {
            scaleY: 0,
            duration: 1,
            stagger: {
                each: 0.1,
                from: "start",
                grid: "auto",
                axis: "x",
            },
            ease: ease,
            onComplete: resolve,
        });
    });
}

function animateTransition() {
    return new Promise((resolve) => {
        gsap.set(".block", { visibility: "visible", scaleY: 0 });
        gsap.to(".block", {
            scaleY: 1,
            duration: 1,
            stagger: {
                each: 0.1,
                from: "start",
                grid: [2, 5],
                axis: "x"
            },
            ease: ease,
            onComplete: resolve,
        });
    });
}

// Funções do Menu
function initMenu() {
    const menuOpen = document.getElementById('menu-toggle-open');
    const menuClose = document.getElementById('menu-toggle-close');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.overlay');

    function openMenu() {
        gsap.to(menu, {
            duration: 0.6,
            x: "0%",
            ease: "power2.out"
        });
        gsap.to(overlay, {
            duration: 0.6,
            display: "block",
            opacity: 1,
            ease: "power2.out"
        });
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        gsap.to(menu, {
            duration: 0.6,
            x: "-100%",
            ease: "power2.in"
        });
        gsap.to(overlay, {
            duration: 0.6,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                overlay.style.display = 'none';
            }
        });
        document.body.style.overflow = '';
    }

    menuOpen.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    return { closeMenu }; // Retornar para uso em outras funções
}

// Funções da Galeria
function initGallery() {
    const bgColors = ["#ceba9c", "#ceba9c", "#ceba9c"];
    const bgColorElement = document.querySelector(".bg-color");

    function updateBackground(color) {
        gsap.to(bgColorElement, {
            background: `linear-gradient(0deg, ${color} 0%, rgba(252, 176, 69, 0) 100%)`,
            duration: 1,
            ease: "power1.out"
        });
    }

    gsap.utils.toArray(".item").forEach((item, index) => {
        const img = item.querySelector(".item-img img");
        
        gsap.set(img, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
            scale: 1.25
        });

        gsap.to(img, {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            ease: "power1.out",
            duration: 1.5,
            scrollTrigger: {
                trigger: item,
                start: "top center+=100",
                end: "bottom top",
                toggleActions: "play none none reverse",
                onEnter: () => updateBackground(bgColors[index]),
                onEnterBack: () => updateBackground(bgColors[index])
            }
        });
    });
}

// Funções de Scroll
function initScrollCounter() {
    const counterElement = document.querySelector(".counter p");
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    function updateScrollPercentage() {
        const scrollPosition = window.scrollY;
        const scrolledPercentage = Math.round((scrollPosition / docHeight) * 100);
        counterElement.textContent = `${scrolledPercentage}`;
    }

    window.addEventListener("scroll", updateScrollPercentage);
}

// Funções das Tabs
function initServiceTabs() {
    const serviceTabs = document.querySelectorAll('.service-tab');
    console.log('Inicializando tabs:', serviceTabs.length);

    serviceTabs.forEach((tab) => {
        const header = tab.querySelector('.service-header');
        const content = tab.querySelector('.service-tab-content'); // Atualizado para novo nome da classe
        const toggle = tab.querySelector('.toggle');
        
        // Estado inicial
        content.style.display = 'none';
        content.style.height = '0';
        content.style.opacity = '0';

        header.addEventListener('click', () => {
            const isActive = tab.classList.contains('active');
            console.log('Tab clicada, estado:', isActive);
            
            if (!isActive) {
                // Fechar outras tabs
                serviceTabs.forEach((otherTab) => {
                    if (otherTab !== tab && otherTab.classList.contains('active')) {
                        const otherContent = otherTab.querySelector('.service-tab-content');
                        const otherToggle = otherTab.querySelector('.toggle');
                        
                        otherTab.classList.remove('active');
                        gsap.to(otherToggle, {
                            rotation: 0,
                            duration: 0.3
                        });
                        
                        gsap.to(otherContent, {
                            height: 0,
                            opacity: 0,
                            duration: 0.3,
                            onComplete: () => {
                                otherContent.style.display = 'none';
                            }
                        });
                    }
                });

                // Abrir tab atual
                tab.classList.add('active');
                content.style.display = 'block';
                
                // Pegar altura real
                const height = content.scrollHeight;
                console.log('Altura do conteúdo:', height);
                
                // Animar abertura
                gsap.to(toggle, {
                    rotation: 45,
                    duration: 0.3
                });
                
                gsap.to(content, {
                    height: height,
                    opacity: 1,
                    duration: 0.3,
                    onComplete: () => {
                        content.style.height = 'auto';
                    }
                });
            } else {
                // Fechar tab
                gsap.to(content, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        tab.classList.remove('active');
                        content.style.display = 'none';
                    }
                });

                gsap.to(toggle, {
                    rotation: 0,
                    duration: 0.3
                });
            }
        });
    });
}

// Funções do Marquee
function initMarquee() {
    const marqueeContent = document.querySelector('.marquee-content');
    const marqueeItems = document.querySelectorAll('.marquee-item');
    
    marqueeItems.forEach(item => {
        const clone = item.cloneNode(true);
        marqueeContent.appendChild(clone);
    });

    window.addEventListener('scroll', function() {
        const st = window.scrollY || document.documentElement.scrollTop;
        
        if (st > lastScrollPosition) {
            if (isReversed) {
                marqueeContent.style.animation = 'marquee 27s linear infinite';
                isReversed = false;
            }
        } else {
            if (!isReversed) {
                marqueeContent.style.animation = 'marquee 27s linear infinite reverse';
                isReversed = true;
            }
        }
        
        lastScrollPosition = st <= 0 ? 0 : st;
    });
}

// Funções de Texto
function initTextAnimations() {
    const textElements = document.querySelectorAll('.main-title, .hero-description');
    textElements.forEach((element, index) => {
        const text = new SplitType(element, { types: 'chars', tagName: 'span' });
        gsap.from(text.chars, {
            opacity: 0,
            y: 50,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
            delay: 1.5 + (index * 0.3)
        });
    });
}

// Inicialização Principal
document.addEventListener('DOMContentLoaded', function() {
    // Iniciar transição
    revealTransition().then(() => {
        gsap.set(".block", { visibility: "hidden" });
    });

    // Setup de links
    document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");

            if (href && !href.startsWith("#") && href !== window.location.pathname) {
                animateTransition().then(() => {
                    window.location.href = href;
                });
            }
        });
    });

    // Inicializar componentes em ordem
    const { closeMenu } = initMenu();
    initGallery();
    initScrollCounter();
    initServiceTabs();
    initMarquee();
    initTextAnimations();

    // Setup do scroll suave
    document.querySelectorAll('.menu-items a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const offsetTop = document.querySelector(href).offsetTop;

            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: offsetTop,
                    autoKill: false
                },
                ease: "power2.inOut"
            });

            closeMenu();
        });
    });
});