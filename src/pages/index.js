import "./index.css";
import {
  enableValidation,
  settings,
  resetValidation,
  disableButton,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "2ae992f4-b289-40b2-ab1e-0f1571242ca9",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    cards.forEach((item) => {
      const cardEl = getCardElement(item);
      cardList.append(cardEl);
    });
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;
  })
  .catch(console.error);

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");

const avatarModal = document.querySelector("#avatar-modal");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarProfileForm = avatarModal.querySelector(".modal__form");
const avatarInput = avatarModal.querySelector("#avatar-input");

const newPostBtn = document.querySelector(".profile__new-post-btn");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostProfileForm = newPostModal.querySelector(".modal__form");

const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const previewCaptionEl = previewModal.querySelector(".modal__caption");

const deleteModal = document.querySelector("#delete-modal");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");

const cardList = document.querySelector(".cards__list");
const cardSubmitBtn = editProfileModal.querySelector(".modal__submit-btn");
const postSubmitBtn = newPostModal.querySelector(".modal__submit-btn");

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-btn_active");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtn.addEventListener("click", () => {
    openModal(deleteModal);
    cardElement.remove();
  });

  cardImageEl.addEventListener("click", () => {
    previewImageEl.src = data.link;
    previewImageEl.alt = data.name;
    previewCaptionEl.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

previewModalCloseBtn.addEventListener("click", function () {
  closeModal(previewModal);
});

const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const newPostImageInput = newPostModal.querySelector("#card-link-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("click", handleClick);
  document.addEventListener("keydown", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}
const handleEscape = (event) => {
  const modal = document.querySelector(".modal_is-opened");
  if (event.key === "Escape") closeModal(modal);
};

const handleClick = (event) => {
  const modal = document.querySelector(".modal_is-opened");
  if (event.target.classList.contains("modal")) closeModal(modal);
};

editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings
  );
});

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

avatarModalBtn.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarCloseBtn.addEventListener("click", function () {
  closeModal(avatarModal);
});

function handleEditProfileSubmit(evt) {
  evt.preventDefault();
  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
      evt.target.reset();
    })
    .catch(console.error);
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleNewPostProfileSubmit(evt) {
  evt.preventDefault();
  api
    .addNewCard({
      link: newPostImageInput.value,
      name: newPostCaptionInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardList.prepend(cardElement);
      evt.target.reset();
      disableButton(postSubmitBtn, settings);
      closeModal(newPostModal);
    })
    .catch(console.error);
}
newPostProfileForm.addEventListener("submit", handleNewPostProfileSubmit);

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  api
    .editAvatarInfo({ avatar: avatarInput.value })
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      closeModal(avatarModal);
    })
    .catch(console.error);
}
avatarProfileForm.addEventListener("submit", handleAvatarSubmit);

const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

enableValidation(settings);
