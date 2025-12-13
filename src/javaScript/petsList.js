import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// FETCHES----

async function getPetsList() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/animals', {
      params: {
        page: 1,
        limit: 8,
      },
    });
    console.log(res.data);

    const pets = res.data.animals;

    renderPetsList(pets);
  } catch (err) {
    console.log('Error', err);

    iziToast.error({
      title: 'Помилка',
      message: err.response?.data?.message || 'Неможливо завантажити дані',
    });
  }
}

// RENDERS----
const petsListCards = document.querySelector('.js-pets-list-cards');

function renderPetsList(pets) {
  if (!pets.length) {
    petsListCards.innerHTML = '<p>Нажаль наразі не має доступних тварин</p>';
    return;
  }

  const markup = pets.map(createPetCard).join('');

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
            
    
            <h3 class="pet-name">${pet.name}</h3>
            <span class="petlist-pet-category">${
              pet.categories?.[0]?.name || 'no category'
            }</span>
    
            <p class="pet-meta">
              ${pet.gender} • ${pet.age}
            </p>
        </div>

        <p class="pet-description">
          ${pet.shortDescription}
        </p>

        <button class="pet-more-btn js-pet-more-btn" type="button">Дізнатися більше</button>
      </div>
    </li>`;
}

// FUNCTIONAL----
document.addEventListener('DOMContentLoaded', getPetsList);
