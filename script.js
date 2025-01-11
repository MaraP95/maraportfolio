// Configurações Globais
const ease = "power4.inOut";
let lastScrollPosition = 0;
let isReversed = false;

// Funções do Menu
function initMenu() {
    const menuOpen = document.getElementById('menu-toggle-open');
    const menuClose = document.getElementById('menu-toggle-close');
    const menu = document.querySelector('.menu');
    const overlay = document.querySelector('.overlay');

    console.log('Inicializando menu...', { menuOpen, menuClose, menu, overlay }); // Debug

    function openMenu() {
        console.log('Abrindo menu'); // Debug
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
        console.log('Fechando menu'); // Debug
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

// Se você quiser adicionar o relógio, pode colocá-lo aqui também
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const timeString = `${hours}:${minutes}:${seconds}`;
  document.getElementById('time').textContent = timeString;
}

setInterval(updateClock, 1000);
updateClock();
//transiçao de cor 
document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  
  function getTogglePoints() {
    // Check if device is mobile (you can adjust this breakpoint)
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      return {
        start: window.innerHeight * 0.9, // Earlier start on mobile
        end: window.innerHeight * 10.7 // Adjusted end point for mobile
      };
    } else {
      return {
        start: window.innerHeight * 0.9, // Original desktop start
        end: window.innerHeight * 11.5 // Original desktop end
      };
    }
  }

  function checkScroll() {
    const points = getTogglePoints();
    
    if (window.scrollY >= points.start && window.scrollY < points.end) {
      wrapper.classList.add("dark-theme");
    } else {
      wrapper.classList.remove("dark-theme");
    }
  }

  // Initial check
  checkScroll();
  
  // Add event listeners for both scroll and resize
  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);
});


  

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

// Alteração de cor do menu no scroll
gsap.to('#menu-toggle-open', {
    scrollTrigger: {
        trigger: '.headers',
        start: "top 80%",
        end: "bottom 80px",
        onEnter: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
        onLeave: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
        onEnterBack: () => document.getElementById('menu-toggle-open').classList.add('light-section'),
        onLeaveBack: () => document.getElementById('menu-toggle-open').classList.remove('light-section'),
    }
});

// Funções de Scroll
function initScrollCounter() {
  const counterElement = document.querySelector(".counter p");
  
  if (!counterElement) {
      console.error('Elemento do contador não encontrado');
      return;
  }

  function updateScrollPercentage() {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const scrolledPercentage = Math.min(100, Math.max(0, Math.round((scrollPosition / docHeight) * 100)));
      
      // Usar GSAP para animação suave
      gsap.to(counterElement, {
          innerText: scrolledPercentage,
          snap: "innerText",
          duration: 0.3,
          ease: "power2.out"
      });
  }

  // Atualizar no scroll
  window.addEventListener("scroll", updateScrollPercentage);
  
  // Atualizar no resize da janela
  window.addEventListener("resize", updateScrollPercentage);
  
  // Inicializar o contador
  updateScrollPercentage();
}

gsap.registerPlugin(ScrollTrigger);
function addImageScaleAnimation() {
  gsap.utils.toArray("section").forEach((section, index) => {
    const image = document.querySelector(`#preview-${index + 1} img`);

    const startCondition = index === 0 ? "top top" : "bottom bottom";

    gsap.to(image, {
      scrollTrigger: {
        trigger: section,
        start: startCondition,
        end: () => {
          const viewportHeight = window.innerHeight;
          const sectionBottom = section.offsetTop + section.offsetHeight;
          const additionalDistance = viewportHeight * 0.5;
          const endValue = sectionBottom - viewportHeight + additionalDistance;
          return `+=${endValue}`;
        },
        scrub: 1,
      },
      scale: 3,
      ease: "none",
    });
  });
}

addImageScaleAnimation();

function animateClipPath(
  sectionId,
  previewId,
  startClipPath,
  endClipPath,
  start = "top center",
  end = "bottom top"
) {
  let section = document.querySelector(sectionId);
  let preview = document.querySelector(previewId);

  ScrollTrigger.create({
    trigger: section,
    start: start,
    end: end,
    onEnter: () => {
      gsap.to(preview, {
        scrollTrigger: {
          trigger: section,
          start: start,
          end: end,
          scrub: 0.125,
        },
        clipPath: endClipPath,
        ease: "none",
      });
    },
  });
}

// Modifique a função initContactAnimation no seu script.js
function initContactAnimation() {
    // Animação do container
    gsap.fromTo(".contact-container",
        { 
            scale: 0.8,
            opacity: 0
        },
        {
            scale: 1,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: ".contact-section",
                start: "top center",
                end: "center center",
                scrub: 1
            }
        }
    );

    // Animação dos itens de contato
    gsap.utils.toArray('.contact-item').forEach((item, index) => {
        gsap.fromTo(item,
            { 
                y: 20,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".contact-container",
                    start: `top ${80 - (index * 5)}%`,
                    end: `top ${60 - (index * 5)}%`,
                    scrub: 1
                }
            }
        );
    });
}

// Inicializar tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, iniciando...'); // Debug
  

  
  // Inicializar menu primeiro
  initMenu();
  
  // Inicializar outras funções
 
  initMarquee();
  addImageScaleAnimation();
  initScrollCounter();

 // Adicione esta linha
 initContactAnimation();

animateClipPath(
  "#section-1",
  "#preview-1",
  "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
  "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
);

const totalSections = 7;

for (let i = 2; i <= totalSections; i++) {
  let currentSection = `#section-${i}`;
  let prevPreview = `#preview-${i - 1}`;
  let currentPreview = `#preview-${i}`;

  animateClipPath(
    currentSection,
    prevPreview,
    "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    "top bottom",
    "center center"
  );

  if (i < totalSections) {
    animateClipPath(
      currentSection,
      currentPreview,
      "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      "center center",
      "bottom top"
    );
  }
}

});


