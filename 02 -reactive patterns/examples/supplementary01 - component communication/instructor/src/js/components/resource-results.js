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
  #results = [];  // # makes a property or method privately scoped.
  // This means only methods/logic from the same instance (e.g. ResourceResults) can change it.
  // We're going to have a controlled process for writing the data, and we don't want outside logic to be able to bypass that.

  constructor() {
    super();
    // TODO: Bind the handleResultClick method to this instance

    this.attachShadow({ mode: 'open' });
  }

  set results(data) {
    // The setter method for our private array - similar to what you're learning in C# right now.
    this.#results = data;
    this.render();  // when data is set, call our render method (below) to fire the display logic.
  }

  // TODO: Add an event handler method for result selection

  connectedCallback() {
    // TODO: Add a click event listener to handle result selection
    
    this.render();
  }

  // TODO: Clean up event listener in disconnectedCallback

  

  render() {
    // TODO: Update to render from the private results field, if it's empty, show "No results found" message
    
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resource-results', ResourceResults);