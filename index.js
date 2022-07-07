const state = {
  breweries: [],
  filterType: null,
  filteredBreweries: [],
};

const breweryTypes = [
  'https://api.openbrewerydb.org/breweries?by_type=micro&per_page=50',
  'https://api.openbrewerydb.org/breweries?by_type=regional&per_page=50',
  'https://api.openbrewerydb.org/breweries?by_type=brewpub&per_page=50',
];
breweryTypes.forEach((type) =>
  fetch(type)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      state.breweries.push(data);
      state.breweries = state.breweries.flat();
      render();
    })
);

const render = () => {
  const breweriesUL = document.querySelector('#breweries-list');
  breweriesUL.innerHTML = '';
  state.breweries.forEach((brewery) => {
    breweriesUL.innerHTML += `
    <li>
      <h2>${brewery.name || 'N/A'}</h2>
      <div class="type">${brewery.brewery_type || 'N/A'}</div>
      <section class="address">
        <h3>Address:</h3>
        <p>${brewery.street || 'N/A'}</p>
        <p><strong>${brewery.state || 'N/A'}, ${
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
