// VARIABLES
const steps = document.querySelectorAll(".steps");
const stepContents = document.querySelectorAll(".step-content");
const stepNumber = document.querySelectorAll(".step-number");
const stepOneInputs = document.querySelectorAll(".step-1-content input");
const subscriptions = document.querySelectorAll(".subscription");
const switcher = document.querySelector(".switcher");
const add_ons = document.querySelectorAll(".add-on");
const totalPrice = document.querySelector(".total-price");
const planPrice = document.querySelector(".plan-price");
const changeBtn = document.querySelector(".change-button");
const confirmBtn = document.querySelector(".confirm");
let time;
let currentStep = 1;
let currentStepNumber = 0;
const obj = {
  sub: null,
  frequency: null,
  price: null,
};

stepContents.forEach((stepContent) => {
  const nextBtn = stepContent.querySelector(".next-step");
  const prevBtn = stepContent.querySelector(".go-back");

  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      document
        .querySelector(`.step-${currentStep}-content`)
        .classList.add("hidden");
      currentStep--;
      document
        .querySelector(`.step-${currentStep}-content`)
        .classList.remove("hidden");
      stepNumber[currentStepNumber].classList.remove("active");
      currentStepNumber--;
      stepNumber[currentStepNumber].classList.add("active");
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      if (currentStep < 5 && validateForm()) {
        document
          .querySelector(`.step-${currentStep}-content`)
          .classList.add("hidden");
        currentStep = currentStep + 1;
        stepNumber[currentStepNumber].classList.remove("active");
        currentStepNumber = currentStepNumber + 1;
        document
          .querySelector(`.step-${currentStep}-content`)
          .classList.remove("hidden");
        stepNumber[currentStepNumber].classList.add("active");
        summary(obj);
        setTotal();
      }
    });
  }
});

function summary(obj) {
  const subType = document.querySelector(".plan-type");
  const subPrice = document.querySelector(".plan-price");
  subType.innerHTML = `${obj.sub.innerText} (${
    obj.frequency ? "Yearly" : "Monthly"
  })`;
  subPrice.innerHTML = `${obj.price.innerText}`;
}

function validateForm() {
  let valid = true;
  for (let i = 0; i < stepOneInputs.length; i++) {
    const input = stepOneInputs[i];
    const label = findLabel(input);

    if (!input.value && label && label.nextElementSibling) {
      valid = false;
      label.nextElementSibling.classList.add("error");
    } else if (label && label.nextElementSibling) {
      label.nextElementSibling.classList.remove("error");
    }
  }

  return valid;
}

function findLabel(input) {
  // Assuming `el` is an input element, find the associated label
  return document.querySelector('.label label[for="' + input.id + '"]');
}

subscriptions.forEach((subscription) => {
  subscription.addEventListener("click", (event) => {
    document.querySelector(".selected").classList.remove("selected");
    subscription.classList.add("selected");
    const subName = subscription.querySelector(".sub-type");
    const subPrice = subscription.querySelector(".sub-price");
    obj.price = subPrice;
    obj.sub = subName;
  });
});

switcher.addEventListener("click", (event) => {
  const val = switcher.querySelector("input").checked;
  if (val) {
    switcher.querySelector(".monthly").classList.remove("switch-active");
    switcher.querySelector(".yearly").classList.add("switch-active");
  } else {
    switcher.querySelector(".monthly").classList.add("switch-active");
    switcher.querySelector(".yearly").classList.remove("switch-active");
  }

  const addOnInputs = document.querySelectorAll(".add-on input");

  addOnInputs.forEach((input) => {
    let checkboxDiv = input.parentNode;
    let addOn = checkboxDiv.parentNode;
    input.checked = false;
    addOn.classList.remove("selected");
  });

  switchPrice(val);
  obj.frequency = val;
});

add_ons.forEach((add_on) => {
  add_on.addEventListener("click", (event) => {
    let add_onInput = add_on.querySelector("input");
    let ID = add_on.getAttribute("data-id");

    if (add_onInput.checked) {
      // Checkbox is unchecked
      add_onInput.checked = false;
      add_on.classList.remove("selected");
      showAddon(ID, false);
    } else {
      // Checkbox is checked
      add_onInput.checked = true;
      add_on.classList.add("selected");
      showAddon(add_on, true);
      event.preventDefault();
    }
  });
});

function switchPrice(checked) {
  const yearlyPrices = [90, 120, 150];
  const monthlyPrices = [9, 12, 15];
  const prices = document.querySelectorAll(".sub-price");
  const addOnPrices = document.querySelectorAll(".add-on-price span");
  const monthlyAddOnPrices = [1, 2, 2];
  const yearlyAddOnPrices = [10, 20, 20];

  if (checked) {
    prices[0].innerHTML = `$${yearlyPrices[0]}/yr`;
    prices[1].innerHTML = `$${yearlyPrices[1]}/yr`;
    prices[2].innerHTML = `$${yearlyPrices[2]}/yr`;

    addOnPrices[0].innerHTML = `$${yearlyAddOnPrices[0]}/yr`;
    addOnPrices[1].innerHTML = `$${yearlyAddOnPrices[1]}/yr`;
    addOnPrices[2].innerHTML = `$${yearlyAddOnPrices[2]}/yr`;
    setTime(true);
  } else {
    prices[0].innerHTML = `$${monthlyPrices[0]}/mo`;
    prices[1].innerHTML = `$${monthlyPrices[1]}/mo`;
    prices[2].innerHTML = `$${monthlyPrices[2]}/mo`;

    addOnPrices[0].innerHTML = `$${monthlyAddOnPrices[0]}/mo`;
    addOnPrices[1].innerHTML = `$${monthlyAddOnPrices[1]}/mo`;
    addOnPrices[2].innerHTML = `$${monthlyAddOnPrices[2]}/mo`;
    setTime(false);
  }
}

function showAddon(ad, val) {
  const template = document.getElementsByTagName("template")[0];
  const clone = template.content.cloneNode(true);
  const serviceName = clone.querySelector(".selected-add-on-type");
  const servicePrice = clone.querySelector(".selected-add-on-price");
  const serviceID = clone.querySelector(".selected-add-on");

  const services = clone.querySelectorAll(".selected-add-on");

  changeBtn.addEventListener("click", (event) => {
    services.forEach((service) => {
      service.remove();
    });
  });

  const prevBtn = document.querySelector(".go-back");

  prevBtn.addEventListener("click", (event) => {
    services.forEach((service) => {
      service.remove();

      const addOnInputs = document.querySelectorAll(".add-on input");

      addOnInputs.forEach((input) => {
        let checkboxDiv = input.parentNode;
        let addOn = checkboxDiv.parentNode;
        input.checked = false;
        addOn.classList.remove("selected");
      });
    });
  });

  switcher.addEventListener("click", (event) => {
    services.forEach((service) => {
      service.remove();
    });
  });

  if (ad && val) {
    serviceName.innerText = ad.querySelector(
      ".add-on-description div"
    ).innerText;
    servicePrice.innerText = ad.querySelector(".add-on-price span").innerText;
    serviceID.setAttribute("data-id", ad.dataset.id);
    serviceID.style.display = "flex";
    serviceID.style.width = "100%";
    serviceID.style.justifyContent = "space-between";
    document.querySelector(".selected-add-ons").appendChild(clone);
  } else {
    const add_ons = document.querySelectorAll(".selected-add-on");
    add_ons.forEach((add_on) => {
      const attr = add_on.getAttribute("data-id");
      if (attr == ad) {
        add_on.remove();
      }
    });
  }
}

function setTotal() {
  const totalText = document.querySelector(".total .total-text");
  let str = planPrice.innerHTML;
  let res = str.replace(/\D/g, "");
  let add_onPrices = document.querySelectorAll(
    ".selected-add-on .selected-add-on-price"
  );
  let val = 0;
  for (let i = 0; i < add_onPrices.length; i++) {
    const str = add_onPrices[i].innerHTML;
    const res = str.replace(/\D/g, "");
    val += Number(res);
  }
  totalPrice.innerHTML = `$${val + Number(res)}/${time ? "yr" : "mo"}`;
  totalText.innerHTML = `Total (per ${time ? "year" : "month"})`;
}

function setTime(t) {
  return (time = t);
}

changeBtn.addEventListener("click", (event) => {
  const addOnInputs = document.querySelectorAll(".add-on input");

  addOnInputs.forEach((input) => {
    let checkboxDiv = input.parentNode;
    let addOn = checkboxDiv.parentNode;
    input.checked = false;
    addOn.classList.remove("selected");
  });

  document
    .querySelector(`.step-${currentStep}-content`)
    .classList.add("hidden");
  currentStep = 2;
  document
    .querySelector(`.step-${currentStep}-content`)
    .classList.remove("hidden");
  stepNumber[currentStepNumber].classList.remove("active");
  currentStepNumber = 1;
  stepNumber[currentStepNumber].classList.add("active");
});

confirmBtn.addEventListener("click", (event) => {
  document
    .querySelector(`.step-${currentStep}-content`)
    .classList.add("hidden");
  currentStep = 5;
  document
    .querySelector(`.step-${currentStep}-content`)
    .classList.remove("hidden");
});
