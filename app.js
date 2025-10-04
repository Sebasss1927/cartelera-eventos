let allEvents = [];

async function loadEvents() {
  const res = await fetch('./data/events.json');
  const events = await res.json();
  allEvents = events;
  handleRouting();
}

function renderEvents(events) {
  const container = document.getElementById('main-content');
  const html = `
    <section id="filters">
      <select id="filter-category">
        <option value="">Todas las categorías</option>
        <option value="musica">Música</option>
        <option value="teatro">Teatro</option>
        <option value="standup">Stand-Up</option>
        <option value="festival">Festival</option>
        <option value="otros">Otros</option>
      </select>
      <select id="sort">
        <option value="">Ordenar por...</option>
        <option value="date_asc">Fecha ↑</option>
        <option value="date_desc">Fecha ↓</option>
        <option value="price_asc">Precio ↑</option>
        <option value="price_desc">Precio ↓</option>
        <option value="popularity">Popularidad</option>
      </select>
    </section>
    <section id="event-list">
      ${events.map(evt => `
        <div class="event-card" onclick="location.hash='event/${evt.id}'">
          <img src="${evt.images[0]}" alt="${evt.title}">
          <div class="event-card-content">
            <h3>${evt.title}</h3>
            <p>${evt.city} — ${new Date(evt.datetime).toLocaleDateString()}</p>
            <p class="price">Desde ${evt.currency} ${evt.priceFrom}</p>
          </div>
        </div>
      `).join('')}
    </section>
  `;
  container.innerHTML = html;

  // Eventos de búsqueda, filtros y orden
  document.getElementById('search').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    const filtered = allEvents.filter(evt =>
      evt.title.toLowerCase().includes(query) ||
      evt.city.toLowerCase().includes(query) ||
      evt.artists.join(' ').toLowerCase().includes(query)
    );
    renderEvents(filtered);
  });

  document.getElementById('filter-category').addEventListener('change', e => {
    const cat = e.target.value;
    const filtered = cat ? allEvents.filter(evt => evt.category === cat) : allEvents;
    renderEvents(filtered);
  });

  document.getElementById('sort').addEventListener('change', e => {
    const val = e.target.value;
    let sorted = [...allEvents];
    switch(val) {
      case 'date_asc': sorted.sort((a,b) => new Date(a.datetime) - new Date(b.datetime)); break;
      case 'date_desc': sorted.sort((a,b) => new Date(b.datetime) - new Date(a.datetime)); break;
      case 'price_asc': sorted.sort((a,b) => a.priceFrom - b.priceFrom); break;
      case 'price_desc': sorted.sort((a,b) => b.priceFrom - a.priceFrom); break;
      case 'popularity': sorted.sort((a,b) => b.popularity - a.popularity); break;
    }
    renderEvents(sorted);
  });
}

function renderDetail(id) {
  const evt = allEvents.find(e => e.id === id);
  const container = document.getElementById('main-content');

  container.innerHTML = `
    <section id="event-detail">
      <button id="back-btn" onclick="location.hash=''">← Volver</button>
      <img src="${evt.images[0]}" alt="${evt.title}">
      <h2>${evt.title}</h2>
      <p><strong>Ciudad:</strong> ${evt.city}</p>
      <p><strong>Lugar:</strong> ${evt.venue}</p>
      <p><strong>Fecha:</strong> ${new Date(evt.datetime).toLocaleString()}</p>
      <p><strong>Precio desde:</strong> ${evt.currency} ${evt.priceFrom}</p>
      <p><strong>Edad:</strong> ${evt.policies.age}</p>
      <p><strong>Reembolso:</strong> ${evt.policies.refund}</p>
      <p><strong>Descripción:</strong> ${evt.description}</p>
      <p><strong>Artistas:</strong> ${evt.artists.join(', ')}</p>
    </section>
  `;
}

window.addEventListener('hashchange', handleRouting);
loadEvents();
