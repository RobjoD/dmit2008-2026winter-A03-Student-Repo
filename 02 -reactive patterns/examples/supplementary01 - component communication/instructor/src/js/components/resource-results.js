// Here, we'll define a custom event for when an item is selected from the result component,
// and handle emitting it. We'll also highlight the selected item so the UI reacts to the user's actions.

const template = document.createElement('template');
// TODO: Update the template to support dynamic results (NOTE: we are not altering the badge count at this time)
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

class ResourceResults extends HTMLElement {
  #results = [];

  constructor() {
    super();
    // WTF is this and why do we need to do it? -> https://dev.to/aman_singh/why-do-we-need-to-bind-methods-inside-our-class-component-s-constructor-45bn
    // If you read to the end, you'll know we could've just used an arrow function... but this illustrates class vs. instance behavioural differences 
    this._handleResultClick = this._handleResultClick.bind(this);
    this.attachShadow({ mode: 'open' });
  }

  set results(data) {
    this.#results = data;
    this.render();
  }

  _handleResultClick(event) {
    const button = event.target.closest('button[data-id]');
    if (button) {
      // snipe for the specific result row that got clicked.
      // -> this is why we always implement a unique identifier for each element in a series!
      const resultID = button.getAttribute('data-id');
      const result = this.#results.find(r => r.id === resultID);  // note that we're finding the data object from the array, not the UI row!

      // cook up a custom event. docs: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/
      const resultSelectedEvent = new CustomEvent(
        'resource-selected',  // *we* get to decide the event name!
        {
          detail: { result },  // don't pre-filter the data item. Send the *whole* object; let the receiving component decide what's relevant. 
          bubbles: true,       // if true, parent node / document can listen for event without knowing about & wiring together sender and receiever components
          composed: true,      // if true, events can cross shadow DOM boundary
        }
      );
      
        // broadcast the event to the current target (in this case, a ResourceResults component instance)
        this.dispatchEvent(selectedEvent);
      
    }
  }

  connectedCallback() {  // <- when the component loads/attaches into the DOM...
    this.shadowRoot.addEventListener('click', this._handleResultClick);
    
    this.render();
  }

  disconnectedCallback () {  // <- when the component is unloaded/removed from the DOM...
    // ... then clean up your unused event listeners!
    this.shadowRoot.removeEventListener('click', this._handleResultClick);
  }
  

  render() {
    const content = template.content.cloneNode(true)
    const listGroup = content.querySelector('.list-group');


    if (this.#results.length) {
      const resultsHTML = this.#results.map(
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

      listGroup.innerHTML = resultsHTML.join('');

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