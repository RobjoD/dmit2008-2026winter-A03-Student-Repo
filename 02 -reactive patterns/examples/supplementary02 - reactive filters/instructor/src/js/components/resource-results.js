const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <section class="h-100">
    <div class="card h-100">
      <div class="card-header d-flex justify-content-between align-items-center">
        <strong>Results</strong>
        <span class="badge text-bg-secondary">4</span>
      </div>

      <div class="list-group list-group-flush">

        <!-- results will be injected here, by selecting for .list-group and embedding inner HTML -->

      </div>
    </div>
  </section>`;

// Step 3: ResourceResults should react to received filter state
class ResourceResults extends HTMLElement {
  #results = [];
  #filteredResults = [];
  #filters = {
    // We could've added default values earlier, since we knew the data shape,
    // but I chose to wait until I wrote the event & its payload in case any surprises came up.
    searchQuery: '',
    category: 'all',
    openNow: false,
    virtual: false,
  };

  constructor() {
    super();
    this._handleResultClick = this._handleResultClick.bind(this); 
    this.attachShadow({ mode: 'open' });
  }

  set results(data) {
    this.#results = data;  // This is now just a data container for *all* results. We don't mutate it anymore.

    // SUPER IMPORTANT: We're rendering from filtered results now, and our initial state is unfiltered.
    // Spreading out '[...data]'' just to wrap it back in a list (instead of just passing 'data' again) *looks* stupid, BUT
    //  doing this creates a shallow copy. If we just passed data, both array variables would point to the same reference,
    //  so modifying #filteredResults would also affect #results!
    this.#filteredResults = [...data];
    this.render();
  }

  set filters(incomingFilters) {
    this.#filters = incomingFilters;
    // Setting the filters is easy now that I know that in this example's case, we'll receive complete data every time.
    
    // After I set/store the incoming filter inputs, I know I need to apply them.
    this.#applyFilters()
  }

  #applyFilters() {
    // Now that I'm sure of the data shape, I can prepare work on this.
    const { searchQuery, category, openNow, virtual } = this.#filters;  // if this is new to you, look up "destructuring"!

    // We'll complete the logic that actually filters from the results array in the next commit, but I can plan this out now.
    //   1. If I have any user-written string inputs in the filters, I'll want to clean those up first. (I do! It's searchQuery).
    //      The rest of the terms are either booleans or predefined strings the user doesn't have access to, so I don't need to sanitise them.
    //   2. There are lots of ways of writing filtering/matching logic; my preference would be
    this.#filteredResults = this.#results.filter(
      (r) => {
        // 3. someArray.filter() creates a new array containing *only* elements that pass conditional logic in this block.
        //    See main.js if you need a refresher on the shape of result data. I'll need to check:
        //      - if we got a searchQuery, check it against result's summary or location (optionally, category too)
        //      - if category was selected, and it wasn't 'All', check it against the result's category
        //      - if openNow was selected, check the result's openNow (boolean)
        //      - if virtual was selected, check the result's virtual (boolean)
      }
    );
    
    this.render(); // I already know I'll need to re-render, because I'm changing the data displayed by the UI
  }

  _handleResultClick(event) {
    const button = event.target.closest('button[data-id]');
    if (button) {
      this.shadowRoot.querySelector('button.active')?.classList.remove('active');
      button.classList.add('active');

      const resultID = button.getAttribute('data-id');
      const result = this.#results.find(r => r.id === resultID);  // note that we're finding the data object from the array, not the UI row!

      const resultSelectedEvent = new CustomEvent(
        'resource-selected',
        {
          detail: { result },
          bubbles: true,
          composed: true,
        }
      );

      this.dispatchEvent(resultSelectedEvent);
    }
  }

  connectedCallback() {
    this.shadowRoot.addEventListener('click', this._handleResultClick);
    this.render();
  }

  disconnectedCallback () {
    this.shadowRoot.removeEventListener('click', this._handleResultClick);
  }
  
  render() {
    const content = template.content.cloneNode(true)
    const listGroup = content.querySelector('.list-group');

    // Now that we're set up to render from #filteredResults instead, let's reflect that here:
    if (this.#filteredResults.length) {
      const resultsHTML = this.#filteredResults.map(
        result => `
        <button type="button" class="list-group-item list-group-item-action" data-id="${result.id}">
          <div class="d-flex w-100 justify-content-between">
            <h2 class="h6 mb-1">${result.title}</h2>
            <small>${result.category}</small>
          </div>
          <p class="mb-1 small text-body-secondary">${result.summary}</p>
          <small class="text-body-secondary">${result.location}</small>
        </button>`
      ); 

      listGroup.innerHTML = resultsHTML.join(''); // resultsHTML is an array, so combine each HTML blob back-to-back into a string

    } else {
      listGroup.innerHTML = `
        <div class="list-group-item">
          <p class="mb-0">No results found.</p>
        </div>`;
    }

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(content);
  }
}

customElements.define('resource-results', ResourceResults);