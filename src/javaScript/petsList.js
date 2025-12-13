// FETCHES----

async function getPetsList() {
  try {
    const res = await axios.get('https://paw-hut.b.goit.study/api/animals');

    if (!Array.isArray(res.data)) {
      throw new Error('Not a JSON');
    }

    renderPetsList(res.data);
  } catch (err) {
    iziToast.err({
      title: 'Помилка',
      message: error.res?.data?.message || 'Не можливо завантажити дані',
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

  petsListCards.insertAdjacentElement = markup;
}

function createPetCard(pet) {
  return `<li class="pet-card" data-id="${pet.id}">
      <img
        class="pet-image"
        src="${pet.image || 'images/placeholder.jpg'}"
        alt="${pet.name}"
      >

      <div class="pet-content">
        <span class="pet-category">${pet.category}</span>

        <h3 class="pet-name">${pet.name}</h3>
        <p class="pet-breed">${pet.breed}</p>

        <p class="pet-meta">
          ${pet.gender} • ${pet.age}
        </p>

        <p class="pet-description">
          ${pet.shortDescription}
        </p>
      </div>
    </li>`;
}

// FUNCTIONAL----
document.addEventListener('DOMContentLoaded', getPetsList);
