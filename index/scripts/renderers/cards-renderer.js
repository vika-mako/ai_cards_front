import { renderCardsPage } from "../layout/card-templates.js";

export class CardsRenderer {
  constructor(rootElement) {
    this.rootElement = rootElement;
    this.controller = null;
  }

  bind(controller) {
    this.controller = controller;

    this.rootElement.addEventListener("click", (event) => {
      const actionElement = event.target.closest("[data-action]");
      if (!actionElement) return;

      this.controller.handleAction(actionElement.dataset.action, actionElement.dataset);
    });
  }

  render(state) {
    this.rootElement.innerHTML = renderCardsPage(state);
  }
}
