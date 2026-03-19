export const CardUiState = {
    COLLECT_ANSWER: "CollectAnswer",
    REVEALED: "Revealed",
  };
  
  function createId() {
    return `card_${Math.random().toString(36).slice(2, 10)}`;
  }
  
  class BaseCardUiModel {
    constructor({ id, type, title, task }) {
      this.id = id || createId();
      this.type = type;
      this.title = title;
      this.task = task;
      this.state = CardUiState.COLLECT_ANSWER;
    }
  
    reset() {
      this.state = CardUiState.COLLECT_ANSWER;
    }
  }
  
  export class TextAnswerCardUiModel extends BaseCardUiModel {
    constructor({ id, title, task, answer }) {
      super({ id, type: "text", title, task });
      this.answer = answer;
      this.isAnswerVisible = false;
    }
  
    revealAnswer() {
      this.isAnswerVisible = true;
      this.state = CardUiState.REVEALED;
    }
  
    hideAnswer() {
      this.isAnswerVisible = false;
      this.state = CardUiState.COLLECT_ANSWER;
    }
  
    reset() {
      super.reset();
      this.isAnswerVisible = false;
    }
  }
  
  export class SingleChoiceCardUiModel extends BaseCardUiModel {
    constructor({ id, title, task, answerVariants, answer }) {
      super({ id, type: "single", title, task });
      this.answerVariants = [...answerVariants];
      this.answer = Number(answer);
      this.userSelection = null;
    }
  
    select(index) {
      this.userSelection = Number(index);
    }
  
    reset() {
      super.reset();
      this.userSelection = null;
    }
  }
