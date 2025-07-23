"use strict";

function initApp() {
    initHeaderEvents();
    initAccordionEvents();
    initCarrousselReduceEvents();
    initCarrousselTransformEvents();
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
// Carroussel Reduce Cost

function initCarrousselReduceEvents() {
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
// Carroussel Transform The Way

function initCarrousselTransformEvents() {
    const carrousselContainer = document.querySelector('.custom-carroussel-transform-container');
    const backwardBtn = document.querySelector('[data-carroussel-transform-btn-backward]');
    const forwarddBtn = document.querySelector('[data-carroussel-transform-btn-forward]');

    backwardBtn.addEventListener('click', () => {
        handleBtnClick(false)
    })
    forwarddBtn.addEventListener('click', () => {
        handleBtnClick(true)
    })


    function handleBtnClick(positive) {
        const gapBetween = document.documentElement.clientWidth >= 1200 ? 32 : 16;
        const scrollInPixels = getActualCardWidth() + gapBetween;

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
        if(currentElementSelector === 'modal-send-info')
          closeSendInfoModal();
        else
          closeModal(currentElementSelector);
    }
}

function closeModal(elementSelector) {
    const element = document.querySelector(`[data-${elementSelector}]`)
    backdropModal.removeEventListener('click', handleClickOutside)
    
    backdropModal.classList.add('d-none')
    element.classList.add('d-none')
    currentElementSelector = null
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
const requiredInputs = form.querySelectorAll('input[required], textarea[required]');

const phoneInput = document.getElementById('phone');
const phonePattern = /^\(\d{2}\)\d{5}-\d{4}$/;

const emailInput = document.getElementById('email');
const emailError = document.getElementById('error-email');
const emailPattern = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

const submitBtn = document.getElementById('submitFormButton');
let isSubmitting = false;

inputs.forEach(input => {
  input.addEventListener('input', function () {
    if (this.value.trim() !== '') {
      this.classList.add('has-value');
    } else {
      this.classList.remove('has-value');
    }
  });
});

requiredInputs.forEach(input => {
  input.dataset.pristine = 'true';

  input.addEventListener('input', function () {
    input.dataset.pristine = 'false';
    validateInputs();
  });

  input.addEventListener('blur', function () {
    input.dataset.pristine = 'false';
    validateInputs();
  });
});

phoneInput.addEventListener('input', (event) => {
  if(event.inputType == 'deleteContentBackward') {
    phoneInput.value = phoneInput.value.slice(0, -1);
    return
  }

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

emailInput.addEventListener('invalid', function (event) {
  event.preventDefault();
  if (emailInput.validity.typeMismatch) {
    console.log('chegou')
    emailInput.setCustomValidity("Digite um e-mail válido, como exemplo@dominio.com.");
  } else {
    emailInput.setCustomValidity("");
  }
});

function validateInputs() {
  let valid = true;

  requiredInputs.forEach(input => {
    const errorMsg = document.getElementById(`error-${input.name}`);
    const isTouched = input.dataset.pristine === 'false';
    const value = input.value.trim();

    let campoValido = true;

    if (!value) {
      campoValido = false;
      emailError.textContent = "Este campo precisa ser preenchido"
    } else if (input.name === 'phone' && !phonePattern.test(value)) {
      campoValido = false;
    } else if (input.name === 'email' && !emailPattern.test(value)) {
      campoValido = false;
      emailError.textContent = "Insira um e-mail válido"
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
  if(isSubmitting) return

  inputs.forEach(input => input.dataset.pristine = 'false');
  validateInputs();

  if (!submitBtn.disabled) {
    handleFormSubmit()
  }
});

async function handleFormSubmit() {
  try {
    isSubmitting = true
    let name = form.elements['name'].value;
    let email = form.elements['email'].value;
    let company = form.elements['companyName'].value;
    let website = form.elements['website'].value;
    let phone = form.elements['phone'].value;
    let message = form.elements['message'].value;

    let body = {name, email, company, website, phone, message};

    let response;
    let json;

    response = await fetch("https://61u981rsk4.execute-api.us-east-1.amazonaws.com/Production/SendEmailBrevo", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    json = await response.json();

    if(response.ok === false) {
      throw new Error(json.message);
    }
    
    resetForm();
  } 
  catch(error) {
    json = null
    console.log(error.message)
  }
  finally {
    isSubmitting = false
  }
}

function resetForm() {
    transitionToConfirmation()
    form.reset();
    submitBtn.disabled = true;

    inputs.forEach(input => {
      input.dataset.pristine = 'true';
      const errorMsg = document.getElementById(`error-${input.name}`);
      input.classList.remove('error');
      errorMsg.style.opacity = '0';
    });
}

function closeSendInfoModal() {
    resetForm()
    const modal = document.querySelector('[data-modal-send-info]');
    modal.classList.remove('turned-into-confirmation')
    closeModal('modal-send-info')
}

function transitionToConfirmation() {
  const modal = document.querySelector('[data-modal-send-info]');
  modal.classList.add('turned-into-confirmation')
}

// ===========================================================
// Plans Toggle

let selectedPlan = 'mensal';
const containerElement = document.querySelector('.carroussel-box-bg');

function changePlan(plan) {
  if(plan === selectedPlan) {
    return
  }

  selectedPlan = plan
  containerElement.classList.remove(`${getOposite(plan)}-selected`)
  containerElement.classList.add(`${plan}-selected`)

  const planBtn = document.querySelector(`.${getOposite(plan)}-btn`);
  const opositeBtn = document.querySelector(`.${plan}-btn`);

  planBtn.classList.remove('selected');
  opositeBtn.classList.add('selected');
}

function getOposite(plan) {
  if(plan === 'mensal') return 'anual'
  return 'mensal'
}