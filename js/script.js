"use strict";

function initApp() {
    initHeaderEvents();
    initAccordionEvents();
    initCarrousselEvents();
}
initApp();


// ===========================================================
// Header

function initHeaderEvents() {
    const header = document.querySelector('header');

    function handleScroll() {
        const isScrolled = window.scrollY > 72;

        if(isScrolled) {
            header.classList.add('scrolled');
            return
        }
        
        header.classList.remove('scrolled');
    }
    handleScroll();
    
    document.addEventListener('scroll', handleScroll);
}

// ===========================================================
// Accordion

function initAccordionEvents() {
    const accordionsArray = document.querySelectorAll('.custom-accordion');

    accordionsArray.forEach((element) => {
        element.querySelector('.accordion-header').addEventListener('click', (event) => {
            handleAccordionClick(event.target);
        });
    });

    function handleAccordionClick(element) {
        if (element.classList && element.classList.contains('custom-accordion')) {
            toggleAccordion(element);
            return;
        }

        handleAccordionClick(element.parentElement);
    }

    function toggleAccordion(element) {
        element.classList.toggle('active')
    }
}

// ===========================================================
// Carroussel

function initCarrousselEvents() {
    const carrousselContainer = document.querySelector('.custom-carroussel-container');
    const backwardBtn = document.querySelector('[data-carroussel-btn-backward]');
    const forwarddBtn = document.querySelector('[data-carroussel-btn-forward]');

    backwardBtn.addEventListener('click', () => {
        handleBtnClick(false)
    })
    forwarddBtn.addEventListener('click', () => {
        handleBtnClick(true)
    })

    function handleBtnClick(positive) {
        const scrollInPixels = getActualCardWidth() + 16;

        carrousselContainer.scrollBy({
            top: 0,
            left: positive ? scrollInPixels : -scrollInPixels,
            behavior: 'smooth'
        })
    }

    function getActualCardWidth() {
        return carrousselContainer.firstElementChild.clientWidth
    }
}