function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isCollectState(card) {
  return (
    card.state === "CollectAnswer" ||
    card.state === "CollectingAnswer" ||
    !card.state
  );
}

function isResultState(card) {
  return !isCollectState(card);
}

function getSingleChoiceCorrectIndex(card) {
  return typeof card.correctIndex === "number" ? card.correctIndex : card.answer;
}

function getMultipleChoiceCorrectIndexes(card) {
  if (Array.isArray(card.correctIndexes)) return card.correctIndexes;
  if (Array.isArray(card.answer)) return card.answer;
  return [];
}

function getBinaryCorrectValue(card) {
  return typeof card.correctValue === "boolean" ? card.correctValue : card.answer;
}

function getCurrentCard(state) {
  return state.cards?.[state.currentIndex] ?? null;
}

function clampIndex(state) {
  if (!Array.isArray(state.cards) || state.cards.length === 0) {
    state.currentIndex = 0;
    return;
  }

  if (typeof state.currentIndex !== "number") {
    state.currentIndex = 0;
  }

  if (state.currentIndex < 0) {
    state.currentIndex = 0;
  }

  if (state.currentIndex > state.cards.length - 1) {
    state.currentIndex = state.cards.length - 1;
  }
}

export function prepareCards(rawCards) {
  return (rawCards || []).map((card) => ({
    ...card,
    state: card.state ?? "CollectAnswer",
    showCorrectAnswer: card.showCorrectAnswer ?? false,
    userAnswer: card.userAnswer ?? "",
    userSelection:
      card.userSelection ??
      (card.type === "MultipleChoiceCard" ? [] : null),
  }));
}

export function isCardCorrect(card) {
  switch (card.type) {
    case "TextAnswerCard":
      return normalizeText(card.userAnswer) === normalizeText(card.answer);

    case "SingleChoiceCard":
      return card.userSelection === getSingleChoiceCorrectIndex(card);

    case "MultipleChoiceCard": {
      const selected = [...(card.userSelection || [])].sort((a, b) => a - b);
      const correct = [...getMultipleChoiceCorrectIndexes(card)].sort((a, b) => a - b);

      return (
        selected.length === correct.length &&
        selected.every((value, index) => value === correct[index])
      );
    }

    case "BinaryChoiceCard":
      return card.userSelection === getBinaryCorrectValue(card);

    default:
      return false;
  }
}

function getCorrectAnswerHtml(card) {
  switch (card.type) {
    case "TextAnswerCard":
      return `<div class="correct-answer__text">${escapeHtml(card.answer)}</div>`;

    case "SingleChoiceCard": {
      const correctIndex = getSingleChoiceCorrectIndex(card);
      return `<div class="correct-answer__text">${escapeHtml(
        card.answerVariants?.[correctIndex] ?? ""
      )}</div>`;
    }

    case "MultipleChoiceCard": {
      const correctIndexes = getMultipleChoiceCorrectIndexes(card);
      return `
        <ul class="correct-answer__list">
          ${correctIndexes
            .map(
              (index) =>
                `<li>${escapeHtml(card.answerVariants?.[index] ?? "")}</li>`
            )
            .join("")}
        </ul>
      `;
    }

    case "BinaryChoiceCard":
      return `<div class="correct-answer__text">${
        getBinaryCorrectValue(card) ? "Да" : "Нет"
      }</div>`;

    default:
      return `<div class="correct-answer__text">Ответ недоступен</div>`;
  }
}

function renderTextCard(card) {
  return `
    <div class="card__body">
      <label class="card__label" for="textAnswer-${escapeHtml(card.id)}">Ваш ответ</label>
      <textarea
        id="textAnswer-${escapeHtml(card.id)}"
        class="card__text-input"
        rows="4"
        data-role="text-answer-input"
        placeholder="Введите ответ..."
      >${escapeHtml(card.userAnswer || "")}</textarea>
    </div>
  `;
}

function renderSingleChoiceCard(card) {
  return `
    <div class="card__body">
      <div class="card__variants">
        ${(card.answerVariants || [])
          .map(
            (variant, index) => `
              <button
                type="button"
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
        ${(card.answerVariants || [])
          .map(
            (variant, index) => `
              <button
                type="button"
                class="card__variant ${(card.userSelection || []).includes(index) ? "is-selected" : ""}"
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
      <div class="card__variants card__variants--binary">
        <button
          type="button"
          class="card__variant ${card.userSelection === true ? "is-selected" : ""}"
          data-action="select-binary"
          data-value="true"
        >
          Да
        </button>

        <button
          type="button"
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
    case "TextAnswerCard":
      return renderTextCard(card);

    case "SingleChoiceCard":
      return renderSingleChoiceCard(card);

    case "MultipleChoiceCard":
      return renderMultipleChoiceCard(card);

    case "BinaryChoiceCard":
      return renderBinaryChoiceCard(card);

    default:
      return `<div>Неизвестный тип карточки</div>`;
  }
}

function renderResultSide(card) {
  const correct = isCardCorrect(card);

  return `
    <div class="result-card">
      <div class="result-card__badge ${correct ? "is-correct" : "is-wrong"}">
        ${correct ? "✓ Верно" : "✕ Неверно"}
      </div>

      <h3 class="result-card__title">
        ${correct ? "Отлично!" : "Пока не так"}
      </h3>

      <p class="result-card__subtitle">
        ${
          correct
            ? "Ответ засчитан. Можно двигаться дальше."
            : "Посмотри правильный ответ и попробуй снова."
        }
      </p>

      <div class="result-card__actions">
        <button type="button" class="btn btn--primary" data-action="toggle-correct-answer">
          ${card.showCorrectAnswer ? "Скрыть правильный ответ" : "Показать правильный ответ"}
        </button>

        <button type="button" class="btn btn--ghost" data-action="flip-back">
          Вернуться к карточке
        </button>
      </div>

      <div class="correct-answer ${card.showCorrectAnswer ? "is-open" : ""}">
        <div class="correct-answer__inner">
          <div class="correct-answer__label">Правильный ответ</div>
          ${getCorrectAnswerHtml(card)}
        </div>
      </div>
    </div>
  `;
}

export function renderCardsPage(state) {
  if (state.status === "loading") {
    return `<div class="screen">Загрузка карточек...</div>`;
  }

  if (state.status === "error") {
    return `<div class="screen">${escapeHtml(state.error || "Ошибка")}</div>`;
  }

  const card = state.cards?.[state.currentIndex];
  if (!card) {
    return `<div class="screen">Карточек нет</div>`;
  }

  return `
    <section class="screen">
      <div class="cards-meta">
        Карточка ${state.currentIndex + 1} / ${state.cards.length}
      </div>

      <article class="flashcard ${isResultState(card) ? "is-flipped" : ""}">
        <div class="flashcard__inner">

          <div class="flashcard__face flashcard__face--front">
            <header class="card__header">
              <h2 class="card__title">${escapeHtml(card.title)}</h2>
              <p class="card__task">${escapeHtml(card.task)}</p>
            </header>

            ${renderCardContent(card)}

            <footer class="card__footer">
              <button type="button" class="btn btn--ghost" data-action="prev-card">Назад</button>
              <button type="button" class="btn btn--ghost" data-action="reset-card">Сбросить</button>
              <button type="button" class="btn btn--primary" data-action="check-answer">Проверить</button>
              <button type="button" class="btn btn--ghost" data-action="next-card">Вперёд</button>
            </footer>
          </div>

          <div class="flashcard__face flashcard__face--back">
            ${renderResultSide(card)}
          </div>

        </div>
      </article>
    </section>
  `;
}

export function updateTextAnswer(state, value) {
  const card = getCurrentCard(state);
  if (!card || card.type !== "TextAnswerCard") return;

  card.userAnswer = value;
}

export function checkCurrentCard(state) {
  const card = getCurrentCard(state);
  if (!card) return;

  card.showCorrectAnswer = false;
  card.state = "ShowResult";
}

export function flipBackCurrentCard(state) {
  const card = getCurrentCard(state);
  if (!card) return;

  card.state = "CollectAnswer";
}

export function toggleCorrectAnswer(state) {
  const card = getCurrentCard(state);
  if (!card) return;

  card.showCorrectAnswer = !card.showCorrectAnswer;
}

export function resetCurrentCard(state) {
  const card = getCurrentCard(state);
  if (!card) return;

  card.state = "CollectAnswer";
  card.showCorrectAnswer = false;

  if (card.type === "TextAnswerCard") {
    card.userAnswer = "";
  }

  if (card.type === "SingleChoiceCard" || card.type === "BinaryChoiceCard") {
    card.userSelection = null;
  }

  if (card.type === "MultipleChoiceCard") {
    card.userSelection = [];
  }
}

export function goToNextCard(state) {
  if (!Array.isArray(state.cards) || state.cards.length === 0) return;

  state.currentIndex = Math.min(state.currentIndex + 1, state.cards.length - 1);
}

export function goToPrevCard(state) {
  if (!Array.isArray(state.cards) || state.cards.length === 0) return;

  state.currentIndex = Math.max(state.currentIndex - 1, 0);
}

export function selectSingleAnswer(state, index) {
  const card = getCurrentCard(state);
  if (!card || card.type !== "SingleChoiceCard") return;

  card.userSelection = index;
}

export function toggleMultipleAnswer(state, index) {
  const card = getCurrentCard(state);
  if (!card || card.type !== "MultipleChoiceCard") return;

  const current = Array.isArray(card.userSelection) ? [...card.userSelection] : [];
  const existingIndex = current.indexOf(index);

  if (existingIndex >= 0) {
    current.splice(existingIndex, 1);
  } else {
    current.push(index);
  }

  card.userSelection = current;
}

export function selectBinaryAnswer(state, value) {
  const card = getCurrentCard(state);
  if (!card || card.type !== "BinaryChoiceCard") return;

  card.userSelection = value;
}

export function createCardsPageStore(rawCards) {
  return {
    status: "ready",
    currentIndex: 0,
    cards: prepareCards(rawCards),
  };
}

export function initCardsPage(container, state) {
  if (!container) {
    throw new Error("Container не передан в initCardsPage");
  }

  if (!state || typeof state !== "object") {
    throw new Error("State не передан в initCardsPage");
  }

  // удалить предыдущий экземпляр, если он уже был
  if (typeof container.__cardsPageDestroy === "function") {
    container.__cardsPageDestroy();
  }

  state.status = state.status ?? "ready";
  state.currentIndex = state.currentIndex ?? 0;
  state.cards = prepareCards(state.cards ?? []);

  clampIndex(state);

  function render() {
    clampIndex(state);
    container.innerHTML = renderCardsPage(state);
  }

  function handleAction(action, element) {
    switch (action) {
      case "prev-card":
        goToPrevCard(state);
        render();
        return;

      case "next-card":
        goToNextCard(state);
        render();
        return;

      case "reset-card":
        resetCurrentCard(state);
        render();
        return;

      case "check-answer":
        checkCurrentCard(state);
        render();
        return;

      case "flip-back":
        flipBackCurrentCard(state);
        render();
        return;

      case "toggle-correct-answer":
        toggleCorrectAnswer(state);
        render();
        return;

      case "select-single": {
        const index = Number(element.dataset.index);
        selectSingleAnswer(state, index);
        render();
        return;
      }

      case "toggle-multiple": {
        const index = Number(element.dataset.index);
        toggleMultipleAnswer(state, index);
        render();
        return;
      }

      case "select-binary": {
        const value = element.dataset.value === "true";
        selectBinaryAnswer(state, value);
        render();
        return;
      }

      default:
        return;
    }
  }

  function onClick(event) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const actionElement = target.closest("[data-action]");
    if (!actionElement || !container.contains(actionElement)) return;

    const action = actionElement.dataset.action;
    if (!action) return;

    handleAction(action, actionElement);
  }

  function onInput(event) {
    const target = event.target;
    if (!(target instanceof HTMLTextAreaElement)) return;
    if (!container.contains(target)) return;
    if (target.dataset.role !== "text-answer-input") return;

    updateTextAnswer(state, target.value);
  }

  container.addEventListener("click", onClick);
  container.addEventListener("input", onInput);

  function destroy() {
    container.removeEventListener("click", onClick);
    container.removeEventListener("input", onInput);

    if (container.__cardsPageDestroy === destroy) {
      delete container.__cardsPageDestroy;
    }
  }

  container.__cardsPageDestroy = destroy;

  render();

  return {
    state,
    render,
    destroy,
  };
}