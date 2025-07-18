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
        const isScrolled = window.scrollY > 25;

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

// ===========================================================
// Modal

const backdropModal = document.querySelector('.backdrop-modal');
let currentElementSelector = null;

function openModal(elementSelector) {
    const element = document.querySelector(`[data-${elementSelector}]`)
    currentElementSelector = elementSelector

    backdropModal.classList.remove('d-none')
    element.classList.remove('d-none')

    setTimeout(() => {
        backdropModal.addEventListener('click', handleClickOutside);
    }, 0)
}

function handleClickOutside(event) {
    if(event.target.classList.contains('backdrop-modal')) {
        closeModal(currentElementSelector);
    }
}

function closeModal(elementSelector) {
    const element = document.querySelector(`[data-${elementSelector}]`)
    
    backdropModal.removeEventListener('click', handleClickOutside)
    
    backdropModal.classList.add('d-none')
    element.classList.add('d-none')
}

// ===========================================================
// Scroll to

function scrollToElement(elementSelector) {
    const element = document.querySelector(elementSelector)
    window.scrollTo(0, element.offsetTop - 40)
}

// ===========================================================
// Form

const form = document.getElementById('send-info');
const inputs = form.querySelectorAll('input, textarea');

const phoneInput = document.getElementById('phone');
const phonePattern = /^\(\d{2}\)\d{5}-\d{4}$/;

const submitBtn = document.getElementById('submitFormButton');

// Marcar campos como "tocados"
inputs.forEach(input => {
  input.dataset.pristine = 'true';

  input.addEventListener('input', () => {
    input.dataset.pristine = 'false';
    validateInputs();
  });

  input.addEventListener('blur', () => {
    input.dataset.pristine = 'false';
    validateInputs();
  });
});

phoneInput.addEventListener('input', () => {
  let value = phoneInput.value.replace(/\D/g, '');

  if (value.length > 11) value = value.slice(0, 11);

  let formatted = '';
  if (value.length > 0) formatted += '(' + value.substring(0, 2);
  if (value.length >= 2) formatted += ')';
  if (value.length >= 7) {
    formatted += value.substring(2, 7) + '-' + value.substring(7);
  } else if (value.length > 2) {
    formatted += value.substring(2);
  }

  phoneInput.value = formatted;
});

function validateInputs() {
  let valid = true;

  inputs.forEach(input => {
    const errorMsg = document.getElementById(`error-${input.name}`);
    const isTouched = input.dataset.pristine === 'false';
    const value = input.value.trim();

    let campoValido = true;

    if (!value) {
      campoValido = false;
    } else if (input.name === 'phone' && !phonePattern.test(value)) {
      campoValido = false;
    }

    if (!campoValido) {
      if (isTouched) {
        input.classList.add('error');
        errorMsg.style.opacity = '1';
      }
      valid = false;
    } else {
      input.classList.remove('error');
      errorMsg.style.opacity = '0';
    }
  });

  submitBtn.disabled = !valid;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  inputs.forEach(input => input.dataset.pristine = 'false');
  validateInputs();

  if (!submitBtn.disabled) {
    closeModal('modal-send-info');
    openModal('modal-confirmation')
    form.reset();
    submitBtn.disabled = true;

    inputs.forEach(input => {
      input.dataset.pristine = 'true';
      const errorMsg = document.getElementById(`error-${input.name}`);
      input.classList.remove('error');
      errorMsg.style.opacity = '0';
    });
  }
});