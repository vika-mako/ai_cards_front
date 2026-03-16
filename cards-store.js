export class CardsStore {
    constructor() {
      this.state = {
        status: "idle",
        cards: [],
        currentIndex: 0,
        error: null,
      };
  
      this.listeners = new Set();
    }
  
    getState() {
      return this.state;
    }
  
    getCurrentCard() {
      return this.state.cards[this.state.currentIndex] || null;
    }
  
    setState(nextState) {
      this.state = nextState;
      this.emit();
    }
  
    patch(patchObject) {
      this.state = {
        ...this.state,
        ...patchObject,
      };
      this.emit();
    }
  
    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }
  
    emit() {
      for (const listener of this.listeners) {
        listener(this.state);
      }
    }
  }
  
