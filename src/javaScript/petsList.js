import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import baseModal from './modal';
import animalDetail from './animalDetailsModal';

// VARIABLE----

const categoriesList = document.querySelector('.js-pet-list-categories');
const petsListCards = document.querySelector('.js-pets-list-cards');
const showMoreBtn = document.querySelector('.js-showmore-btn');
const loaderElem = document.querySelector('.js-loader');

let displayedCount = 0;
let currentPets = [];
let currentCategory = 'all';

// FETCHES----

async function getPetsCategorie() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/categories');
    renderCategories(res.data);
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

async function getPetsList({ category = 'all', page = 1 } = {}) {
  try {
    const params = {
      page,
      limit: 30,
    };

    if (category !== 'all') {
      params.categoryId = category;
    }

    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params,
    });

    return res.data.animals;
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
    return [];
  }
}

// RENDERS----
function renderCategories(categories) {
  const allButton = `<li class="pets-list-categories-item">
      <button class="category-btn active" type="button"
        data-category-id="all">Всі</button>
    </li>`;
  const markup = categories.map(renderCategorie).join('');
  categoriesList.innerHTML = allButton + markup;
}

function renderCategorie(category) {
  return `<li>
        <button class="category-btn" type="button" data-category-id="${category._id}">
          ${category.name}
        </button>
      </li>`;
}

function renderPetsList(pets) {
  petsListCards.innerHTML = '';
  displayedCount = 0;

  const limit = getRenderLimit();
  const petsToRender = pets.slice(0, limit);

  if (!petsToRender.length) {
    petsListCards.innerHTML =
      '<p>Нажаль наразі не має доступних хатніх тваринок 😞 </p>';
    hideShowBtn();
    return;
  }

  const markup = petsToRender.map(createPetCard).join('');
  petsListCards.insertAdjacentHTML('afterbegin', markup);

  displayedCount = petsToRender.length;
  checkShowBtn();
}

function createPetCard(pet) {
  return `<li class="petlist-pet-card" data-id="${pet._id}">
      <img
        class="pet-image"
        src="${pet.image || 'images/placeholder.jpg'}"
        alt="${pet.name}"
        loading="lazy"
      >

      <div class="petlist-pet-content">
        <div class="petlist-pet-content-about">
        <p class="petlist-pet-breed">${pet.species}</p>
            
            <h3 class="petlist-card-tag">${pet.name}</h3>

            <ul class="petlist-pet-categories">
    ${
      pet.categories?.length
        ? pet.categories
            .map(cat => `<li class="petlist-pet-category">${cat.name}</li>`)
            .join('')
        : '<li class="petlist-pet-category">No category</li>'
    }
  </ul>
            </div>
    
            <ul class="petlist-pet-meta">
              <li class="petlist-pet-meta-item">${pet.gender}</li>
              <li class="petlist-pet-meta-item">${pet.age}</li>
            </ul>
        </div>

        <p class="petlist-pet-description">
          ${pet.shortDescription}
        </p>

        <button class="pet-more-btn js-pet-more-btn" type="button">Дізнатися більше</button>
      </div>
    </li>`;
}

function renderMorePets(petArr) {
  const limit = getRenderLimit();
  const nextPart = currentPets.slice(displayedCount, displayedCount + limit);

  if (nextPart.length === 0) {
    hideShowBtn();
    return;
  }

  const markup = nextPart.map(createPetCard).join('');
  petsListCards.insertAdjacentHTML('beforeend', markup);

  displayedCount += nextPart.length;
  checkShowBtn();
}

// EVENTS----

document.addEventListener('DOMContentLoaded', async () => {
  showLoader();
  currentPets = await getPetsList();
  renderPetsList(currentPets);
  await getPetsCategorie();
  hideLoader();
});

categoriesList.addEventListener('click', async e => {
  e.preventDefault();

  const button = e.target.closest('.category-btn');
  if (!button) return;

  const categoryId = button.dataset.categoryId;
  if (!categoryId) return;

  if (categoryId === currentCategory) return;

  showLoader();
  petsListCards.innerHTML = '';
  currentCategory = categoryId;

  currentPets = await getPetsList({
    category: categoryId === 'all' ? 'all' : categoryId,
  });
  renderPetsList(currentPets);

  categoriesList
    .querySelectorAll('.category-btn')
    .forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  hideLoader();
});

showMoreBtn.addEventListener('click', renderMorePets);

petsListCards.addEventListener('click', e => {
  const btn = e.target.closest('.js-pet-more-btn');
  if (!btn) return;

  const card = btn.closest('.petlist-pet-card');
  const petId = card.dataset.id;

  const pet = currentPets.find(p => p._id === petId);
  if (!pet) return;

  animalDetail.animalId = petId;
  animalDetail.data = getPetById(petId);
  baseModal.openModal(animalDetail);
});

// FUNCTIONAL----
function getRenderLimit() {
  return window.innerWidth >= 1440 ? 9 : 8;
}

function checkShowBtn() {
  if (displayedCount < currentPets.length) {
    showMoreBtn.classList.remove('hidden');
  } else {
    showMoreBtn.classList.add('hidden');
  }
}

function hideLoader() {
  loaderElem.classList.add('hidden');
  checkShowBtn();
}

function showLoader() {
  loaderElem.classList.remove('hidden');
  hideShowBtn();
}

function hideShowBtn() {
  showMoreBtn.classList.add('hidden');
}

function getPetById(id) {
  for (const pet of currentPets) {
    if (pet['_id'] === id) return pet;
  }
}
