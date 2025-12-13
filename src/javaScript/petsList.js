import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// VARIABLE----

const categoriesList = document.querySelector('.js-pet-list-categories');
const petsListCards = document.querySelector('.js-pets-list-cards');

let ALLPETS = [];

// FETCHES----

async function getPetsCategorie() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/categories');

    const categories = res.data;

    renderCategories(categories);
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

async function getPetsList() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params: {
        page: 1,
        limit: 30,
      },
    });

    ALLPETS = res.data.animals;

    renderPetsList(ALLPETS);
  } catch (err) {
    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

// RENDERS----
function renderCategories(categories) {
  const markup = categories.map(renderCategorie).join('');
  categoriesList.innerHTML = markup;
}

function renderCategorie(category) {
  return `<li>
        <button class="category-btn" type="button" data-category="${category._id}" data-name="${category.name}">
          ${category.name}
        </button>
      </li>`;
}

function renderPetsList(pets) {
  petsListCards.innerHTML = '';

  const petsToRender = pets.slice(0, 8);

  if (!petsToRender.length) {
    petsListCards.innerHTML =
      '<p>Нажаль наразі не має доступних хатніх тваринок 😞 </p>';
    return;
  }

  const markup = petsToRender.map(createPetCard).join('');
  petsListCards.insertAdjacentHTML('afterbegin', markup);
}

function createPetCard(pet) {
  return `<li class="petlist-pet-card" data-id="${pet._id}">
      <img
        class="pet-image"
        src="${pet.image || 'images/placeholder.jpg'}"
        alt="${pet.name}"
      >

      <div class="petlist-pet-content">
        <div class="petlist-pet-content-about">
        <p class="petlist-pet-breed">${pet.species}</p>
            
            <h3 class="petlist-card-tag">${pet.name}</h3>

            <div class="petlist-pet-categories">
    ${
      pet.categories && pet.categories.length
        ? pet.categories
            .map(cat => `<span class="petlist-pet-category">${cat.name}</span>`)
            .join('')
        : '<span class="petlist-pet-category">No category</span>'
    }
  </div>
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

// FUNCTIONAL----

document.addEventListener('DOMContentLoaded', () => {
  getPetsList(), getPetsCategorie();
});

categoriesList.addEventListener('click', e => {
  if (e.target.classList.contains('category-btn')) {
    const selectedCategoryName = e.target.dataset.name;

    const filteredPets = ALLPETS.filter(pet =>
      pet.categories?.some(pet => pet && pet.name === selectedCategoryName)
    );

    renderPetsList(filteredPets);

    document
      .querySelectorAll('.category-btn')
      .forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
  }
});
