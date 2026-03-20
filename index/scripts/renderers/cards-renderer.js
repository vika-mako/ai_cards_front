import { initCardsPage } from "../layout/card-templates.js";

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
    const studyModal = document.getElementById("studyModal");
    const container = document.getElementById("flashcardContainer");

    studyModal.classList.add("active");
    
    initCardsPage(container, state);
  }
}
