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

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const togglePointStart = window.innerHeight * 1.1; // Ponto para o fundo preto
  const togglePointEnd = window.innerHeight * 11; // Ponto para voltar ao fundo original

  function checkScroll() {
    if (window.scrollY >= togglePointStart && window.scrollY < togglePointEnd) {
      wrapper.classList.add("dark-theme");
    } else {
      wrapper.classList.remove("dark-theme");
    }
  }

  window.addEventListener("scroll", checkScroll);
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



// Inicializar tudo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM carregado, iniciando...'); // Debug
  

  
  // Inicializar menu primeiro
  initMenu();
  
  // Inicializar outras funções
  initMarquee();
  addImageScaleAnimation();
  initScrollCounter();
  initServiceTabs();

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

// Funções das Tabs
function initServiceTabs() {
  const serviceTabs = document.querySelectorAll('.service-tab');
  
  serviceTabs.forEach((tab) => {
    const header = tab.querySelector('.service-header');
    const content = tab.querySelector('.service-tab-content');
    const toggle = tab.querySelector('.toggle');
    
    // Setup inicial do GSAP
    gsap.set(content, {
      height: 0,
      opacity: 0,
      display: 'none',
    });

    header.addEventListener('click', () => {
      const isActive = tab.classList.contains('active');

      // Fecha outras tabs abertas
      serviceTabs.forEach((otherTab) => {
        if (otherTab !== tab && otherTab.classList.contains('active')) {
          const otherContent = otherTab.querySelector('.service-tab-content');
          const otherToggle = otherTab.querySelector('.toggle');
          
          otherTab.classList.remove('active');

          gsap.to(otherToggle, { rotate: 0, duration: 0.15 });
          gsap.to(otherContent, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            onComplete: () => gsap.set(otherContent, { display: 'none' }),
          });
        }
      });

      if (!isActive) {
        // Abrindo a tab
        tab.classList.add('active');
        gsap.set(content, { display: 'block' });

        // Calcula a altura do conteúdo
        const targetHeight = content.scrollHeight;

        gsap.to(toggle, { rotate: 45, duration: 0.15 });
        gsap.to(content, {
          height: targetHeight,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => gsap.set(content, { height: 'auto' }),
        });
      } else {
        // Fechando a tab
        gsap.to(toggle, { rotate: 0, duration: 0.15 });
        gsap.to(content, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            tab.classList.remove('active');
            gsap.set(content, { display: 'none' });
          },
        });
      }
    });
  });
}

