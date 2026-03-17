function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }
  
  function renderTextCard(card) {
    return `
      <div class="card__body">
        <div class="card__actions">
          ${
            card.isAnswerVisible
              ? `<button class="btn" data-action="hide-answer">Скрыть ответ</button>`
              : `<button class="btn" data-action="show-answer">Показать ответ</button>`
          }
        </div>
  
        ${
          card.isAnswerVisible
            ? `<div class="card__answer">${escapeHtml(card.answer)}</div>`
            : ""
        }
      </div>
    `;
  }
  
  function renderSingleChoiceCard(card) {
    return `
      <div class="card__body">
        <div class="card__variants">
          ${card.answerVariants
            .map(
              (variant, index) => `
                <button
                  class="card__variant ${card.userSelection === index ? "is-selected" : ""}"
                  data-action="select-single"
                  data-index="${index}"
                >
                  ${escapeHtml(variant)}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  
  function renderMultipleChoiceCard(card) {
    return `
      <div class="card__body">
        <div class="card__variants">
          ${card.answerVariants
            .map(
              (variant, index) => `
                <button
                  class="card__variant ${card.userSelection.includes(index) ? "is-selected" : ""}"
                  data-action="toggle-multiple"
                  data-index="${index}"
                >
                  ${escapeHtml(variant)}
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  }
  
  function renderBinaryChoiceCard(card) {
    return `
      <div class="card__body">
        <div class="card__variants">
          <button
            class="card__variant ${card.userSelection === true ? "is-selected" : ""}"
            data-action="select-binary"
            data-value="true"
          >
            Да
          </button>
  
          <button
            class="card__variant ${card.userSelection === false ? "is-selected" : ""}"
            data-action="select-binary"
            data-value="false"
          >
            Нет
          </button>
        </div>
      </div>
    `;
  }
  
  function renderCardContent(card) {
    switch (card.type) {
      case "text":
        return renderTextCard(card);
      case "single":
        return renderSingleChoiceCard(card);
      case "multiple":
        return renderMultipleChoiceCard(card);
      case "binary":
        return renderBinaryChoiceCard(card);
      default:
        return `<div>Неизвестный тип карточки</div>`;
    }
  }
  
  export function renderCardsPage(state) {
    if (state.status === "loading") {
      return `<div class="screen">Загрузка карточек...</div>`;
    }
  
    if (state.status === "error") {
      return `<div class="screen">${escapeHtml(state.error || "Ошибка")}</div>`;
    }
  
    const card = state.cards[state.currentIndex];
    if (!card) {
      return `<div class="screen">Карточек нет</div>`;
    }
  
    return `
      <section class="screen">
        <div class="cards-meta">
          Карточка ${state.currentIndex + 1} / ${state.cards.length}
        </div>
  
        <article class="card">
          <header class="card__header">
            <h2 class="card__title">${escapeHtml(card.title)}</h2>
            <p class="card__task">${escapeHtml(card.task)}</p>
          </header>
  
          ${renderCardContent(card)}
  
          <footer class="card__footer">
            <button class="btn" data-action="prev-card">Назад</button>
            <button class="btn" data-action="reset-card">Сбросить</button>
            <button class="btn" data-action="next-card">Вперёд</button>
          </footer>
        </article>
      </section>
    `;
  }
  