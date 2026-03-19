import { mapRawCardsToUiCards } from "../mappers/card.factory.js";

export class CardsController {
  constructor({ repository, store, renderer }) {
    this.repository = repository;
    this.store = store;
    this.renderer = renderer;

    this.store.subscribe((state) => {
      this.renderer.render(state);
    });
  }

  get currentCard() {
    return this.store.getCurrentCard();
  }

  async load(spec = {}) {
    this.store.patch({
      status: "loading",
      error: null,
    });

    try {
      const rawCards = await this.repository.queryCards(spec);
      const uiCards = mapRawCardsToUiCards(rawCards);

      this.store.setState({
        status: "ready",
        cards: uiCards,
        currentIndex: 0,
        error: null,
      });
    } catch (error) {
      this.store.setState({
        status: "error",
        cards: [],
        currentIndex: 0,
        error: error.message || "Не удалось загрузить карточки",
      });
    }
  }

  setRawCards(rawCards) {
    const uiCards = mapRawCardsToUiCards(rawCards);

    this.store.setState({
      status: "ready",
      cards: uiCards,
      currentIndex: 0,
      error: null,
    });
  }

  showAnswer() {
    const card = this.currentCard;
    if (!card || card.type !== "TextAnswerCard") return;

    card.revealAnswer();
    this.store.emit();
  }

  hideAnswer() {
    const card = this.currentCard;
    if (!card || card.type !== "TextAnswerCard") return;

    card.hideAnswer();
    this.store.emit();
  }

  selectSingle(index) {
    const card = this.currentCard;
    if (!card || card.type !== "SingleChoiceCard") return;

    card.select(index);
    this.store.emit();
  }

  toggleMultiple(index) {
    const card = this.currentCard;
    if (!card || card.type !== "MultipleChoiceCard") return;

    card.toggle(index);
    this.store.emit();
  }

  selectBinary(value) {
    const card = this.currentCard;
    if (!card || card.type !== "BinaryChoiceCard") return;

    card.select(value);
    this.store.emit();
  }

  resetCurrentCard() {
    const card = this.currentCard;
    if (!card) return;

    card.reset();
    this.store.emit();
  }

  nextCard() {
    const state = this.store.getState();
    const nextIndex = Math.min(state.currentIndex + 1, state.cards.length - 1);

    if (nextIndex === state.currentIndex) return;

    this.store.patch({
      currentIndex: nextIndex,
    });
  }

  prevCard() {
    const state = this.store.getState();
    const prevIndex = Math.max(state.currentIndex - 1, 0);

    if (prevIndex === state.currentIndex) return;

    this.store.patch({
      currentIndex: prevIndex,
    });
  }

  handleAction(action, payload = {}) {
    switch (action) {
      case "show-answer":
        this.showAnswer();
        break;

      case "hide-answer":
        this.hideAnswer();
        break;

      case "select-single":
        this.selectSingle(Number(payload.index));
        break;

      case "toggle-multiple":
        this.toggleMultiple(Number(payload.index));
        break;

      case "select-binary":
        this.selectBinary(payload.value);
        break;

      case "reset-card":
        this.resetCurrentCard();
        break;

      case "next-card":
        this.nextCard();
        break;

      case "prev-card":
        this.prevCard();
        break;

      default:
        break;
    }
  }
}
