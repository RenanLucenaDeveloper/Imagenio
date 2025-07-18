"use strict";

function initApp() {
    initHeaderEvents();
    initAccordionEvents();
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

// function initAccordionEvents() {
//     const accordionsArray = document.querySelectorAll('.custom-accordion');

//     accordionsArray.forEach((element) => {
//         const accordionHeader = element.querySelector('.accordion-header')
//         accordionHeader.addEventListener('click', handleAccordionClick)
//     })
    
//     function handleAccordionClick(event) {
//         if(event.target.classList.contains('custom-accordion')) {
//             toggleAccordion(event.target)
//             return
//         }
        
//         handleAccordionClick(event.target.parentElement)
//     }

//     function toggleAccordion(element) {
//         console.log(element)
//     }
// }

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