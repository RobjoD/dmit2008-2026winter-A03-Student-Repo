// Here, we'll simply display data - when we're finished writing it, note how it contains *no* logic
// related to listening for / handling incoming events, etc. -- its job is ONLY to display stored data if that data exists!

const template = document.createElement('template');
// TODO: Update the template to support dynamic resource details
template.innerHTML = `
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <section class="h-100">
    <div class="card h-100">
      <div class="card-header">
        <strong>Details</strong>
      </div>

      <div class="card-body">
        <!-- details will be injected here, by selecting for <slot> element and appending child nodes -->
        <slot></slot>
      </div>

      <div class="card-footer d-flex gap-2">
        <button class="btn btn-outline-secondary" type="button">Copy email</button>
        <button class="btn btn-outline-primary" type="button">Open map</button>
      </div>
    </div>
  </section>`;

class ResourceDetails extends HTMLElement {
  #resource = null;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set resource(data) {
    this.#resource = data;
    this.render()
  }

  render() {
    // TODO: Render resource details if available

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('resource-details', ResourceDetails);