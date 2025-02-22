const state = {
  breweries: [],
  displayedBreweries: [],
  filter: {
    byType: {
      applied: false,
      value: '',
    },
    bySearch: {
      applied: false,
      value: '',
    },
    byState: {
      applied: false,
      value: '',
    },
    byCity: {
      applied: false,
      value: [],
    },
  },
};

const setState = (newState) => {
  Object.keys(newState).forEach((key) => {
    state[key] = newState[key];
  });
  render();
};

const setDisplayedBreweries = () => {
  if (state.filter.byType.applied) filterByType();
  else {
    const breweries = [...state.breweries];
    setState({ displayedBreweries: breweries });
  }
  if (state.filter.bySearch.applied) filterBySearch();
  if (state.filter.byState.applied) filterByState();
  if (state.filter.byCity.applied) filterByCity();
};

const getBreweries = () => {
  state.breweries = [];
  const breweryTypes = [
    'https://api.openbrewerydb.org/breweries?by_type=micro&per_page=50',
    'https://api.openbrewerydb.org/breweries?by_type=regional&per_page=50',
    'https://api.openbrewerydb.org/breweries?by_type=brewpub&per_page=50',
  ];
  breweryTypes.forEach((type) =>
    fetch(type)
      .then((res) => res.json())
      .then((data) => {
        state.breweries.push(data);
        state.breweries = state.breweries.flat();
        update();
      })
  );
};

const filterByTypeListener = () => {
  const filterForm = document.querySelector('#filter-by-type-form');
  filterForm.addEventListener('input', (e) => {
    const type = filterForm.filterByType.value;
    const newState = { ...state.filter };

    if (type === 'all') {
      newState.byType.applied = false;
      newState.byType.value = 'all';
    } else {
      newState.byType.applied = true;
      newState.byType.value = type;
    }

    setState({ filter: newState });
    setDisplayedBreweries();
  });
};

const searchBarListener = () => {
  const searchBar = document.querySelector('#search-breweries');
  searchBar.addEventListener('input', (e) => {
    const value = searchBar.value.toLowerCase();
    const newState = { ...state.filter };

    if (value.length > 0) {
      newState.bySearch.applied = true;
      newState.bySearch.value = value;
    } else {
      newState.bySearch.applied = false;
      newState.bySearch.value = value;
    }

    setState({ filter: newState });
    setDisplayedBreweries();
  });
};

const stateSearchFormListener = () => {
  const stateSearchForm = document.querySelector('#select-state-form');
  stateSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = stateSearchForm.selectState.value.toLowerCase();
    const newState = { ...state.filter };

    if (value.length > 0) {
      newState.byState.applied = true;
      newState.byState.value = value;
    } else {
      newState.byState.applied = false;
      newState.byState.value = value;
    }
    stateSearchForm.reset();
    setState({ filter: newState });
    setDisplayedBreweries();
  });
};

const filterByCityListener = () => {
  const filterByCityForm = document.querySelector('#filter-by-city-form');
  filterByCityForm.addEventListener('input', (e) => {
    const cityCheckboxes = document.querySelectorAll('.cityCheckbox');
    const cities = [];
    cityCheckboxes.forEach((box) => {
      if (box.checked) cities.push(box.value);
    });
    const newState = { ...state.filter };

    if (cities.length > 0) {
      newState.byCity.applied = true;
      newState.byCity.value = cities;
    } else {
      newState.byCity.applied = false;
      newState.byCity.value = [];
    }
    setState({ filter: newState });
    setDisplayedBreweries();
  });

  const clearAllBtn = document.querySelector('.clear-all-btn');
  clearAllBtn.addEventListener('click', () => {
    filterByCityForm.reset();
    const newState = { ...state.filter };
    newState.byCity.applied = false;
    newState.byCity.value = [];
    setState({ filter: newState });
    setDisplayedBreweries();
  });
};

const filterByType = () => {
  const breweryByType = state.breweries.filter(
    (brewery) => brewery.brewery_type === state.filter.byType.value
  );
  setState({ displayedBreweries: breweryByType });
};

const filterBySearch = () => {
  const breweries = [...state.displayedBreweries];
  const filtered = breweries.filter((brewery) =>
    brewery.name.toLowerCase().includes(state.filter.bySearch.value)
  );
  setState({ displayedBreweries: filtered });
};

const filterByState = () => {
  const breweries = [...state.displayedBreweries];
  const filtered = breweries.filter((brewery) => {
    if (brewery.state)
      return brewery.state.toLowerCase().includes(state.filter.byState.value);
  });
  setState({ displayedBreweries: filtered });
};

const filterByCity = () => {
  const breweries = [...state.displayedBreweries];
  const cities = state.filter.byCity.value;
  const filtered = breweries.filter((brewery) => {
    if (brewery.city) {
      for (let i = 0; i < cities.length; i++) {
        if (brewery.city.toLowerCase().includes(cities[i])) return true;
      }
      return false;
    }
  });
  setState({ displayedBreweries: filtered });
};

// const renderSearchBar = () => {
//   const breweriesARTICLE = document.querySelector('.breweries-search-bar');
//   breweriesARTICLE.innerHTML = '';
//   breweriesARTICLE.innerHTML = `
//     <header class="search-bar">
//       <form id="search-breweries-form" autocomplete="off">
//         <label for="search-breweries"><h2>Search breweries:</h2></label>
//         <input id="search-breweries" name="searchBreweries" type="text">
//       </form>
//     </header>
//   `;
// };
// TEST CODE
// TEST CODE
const renderBreweries = () => {
  const breweriesUL = document.querySelector('#breweries-list');
  breweriesUL.innerHTML = '';
  const breweries = state.displayedBreweries;
  breweries.forEach((brewery) => {
    breweriesUL.innerHTML += `
    <li>
      <h2>${brewery.name || 'N/A'}</h2>
      <div class="type">${brewery.brewery_type || 'N/A'}</div>
      <section class="address">
        <h3>Address:</h3>
        <p>${brewery.street || 'N/A'}</p>
        <p><strong>${brewery.state || 'N/A'}: ${brewery.city || 'N/A'}, ${
      brewery.postal_code || 'N/A'
    }</strong></p>
      </section>
      <section class="phone">
        <h3>Phone:</h3>
        <p>${brewery.phone || 'N/A'}</p>
      </section>
      <section class="link">
        <a href="${
          brewery.website_url || 'N/A'
        }" target="_blank">Visit Website</a>
      </section>
    </li>
      `;
  });
};

const render = () => {
  // renderSearchBar();
  renderBreweries();
};

const update = () => {
  setDisplayedBreweries();
  render();
};

const init = () => {
  stateSearchFormListener();
  filterByTypeListener();
  searchBarListener();
  filterByCityListener();
};

getBreweries();
init();
