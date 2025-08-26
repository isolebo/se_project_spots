const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

const showInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMesgEl = formEl.querySelector(`#${inputEl.id}-error`);
  const errorMesgElCap = formEl.querySelector(
    `#${inputEl.id}card-caption-input-error`
  );
  const errorMesgElName = formEl.querySelector(
    `#${inputEl.id}profile-name-input-error`
  );
  const errorMesgElDes = formEl.querySelector(
    `#${inputEl.id}profile-description-input-error`
  );
  errorMesgEl.textContent = errorMsg;

  inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl, errorMsg, config) => {
  const errorMesgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMesgEl.textContent = "";
  inputEl.classList.remove(config.inputErrorClass);
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl, config.errorClass);
  }
};

const setEventListeners = (formEl, config) => {
  const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
  const buttonElement = formEl.querySelector(config.submitButtonSelector);

  const hasInvalidInput = (inputList) => {
    return inputList.some((input) => {
      return !input.validity.valid;
    });
  };

  const toggleButtonState = (inputList, buttonEl, config) => {
    if (hasInvalidInput(inputList)) {
      disableButton(buttonEl, config.inactiveButtonClass);
    } else {
      buttonEl.disabled = false;
    }
  };

  const disableButton = (buttonEl) => {
    buttonEl.disabled = true;
  };

  // const resetValidation = (formel, inputList) => {
  //   inputList.forEach((input) => {
  //     hideInputError(formEl, input);
  //   });
  // };

  toggleButtonState(inputList, buttonElement, config);
  inputList.frEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formEl, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

enableValidation(settings);
