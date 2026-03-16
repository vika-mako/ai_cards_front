import { CardsStore } from "./scripts/state/cards-store.js";
import { CardsRenderer } from "./scripts/renderers/cards-renderer.js";
import { CardsController } from "./scripts/controllers/cards-controller.js";

const rootElement = document.getElementById("app");

const store = new CardsStore();
const renderer = new CardsRenderer(rootElement);
const controller = new CardsController({ store, renderer });

renderer.bind(controller);

controller.setRawCards([
  {
    title: "Кинетическая энергия",
    task: "Определите формулу для расчёта кинетической энергии тела.",
    answer: "Формула кинетической энергии: E_k = 0.5 * m * v^2",
  },
  {
    title: "Закон Инерции",
    task: "Какой закон описывает принцип инерции?",
    answerVariants: [
      "Закон сохранения импульса",
      "Первый закон Ньютона",
      "Третий закон Кеплера",
      "Закон Ома",
    ],
    answer: 1,
  },
  {
    title: "Основы законов Ньютона",
    task: "Выберите все правильные утверждения.",
    answerVariants: [
      "Первый закон Ньютона объясняет инерцию.",
      "Второй закон Ньютона связывает силу, массу и ускорение.",
      "Третий закон Ньютона говорит о действии и противодействии.",
      "Законы Ньютона применимы только на квантовом уровне.",
    ],
    answer: [0, 1, 2],
  },
  {
    title: "Передача звука",
    task: "Может ли звук распространяться в вакууме?",
    answer: false,
  },
]);
