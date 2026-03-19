import { CardsRepository } from "./scripts/data/cards-repository.js";
import { CardsStore } from "./scripts/state/cards-store.js";
import { CardsRenderer } from "./scripts/renderers/cards-renderer.js";
import { CardsController } from "./scripts/controllers/cards-controller.js";

const root = document.getElementById("app");

const repository = new CardsRepository({ baseUrl: "/api" });
const store = new CardsStore();
const renderer = new CardsRenderer(root);
const controller = new CardsController({ repository, store, renderer });

renderer.bind(controller);

controller.load({
  "prompt": "Физика",
  "config": {
    "textAnswerCardConfig": {
      "amount": 2
    },
    "singleChoiceCardConfig": {
      "variantsNumber": 0,
      "amount": 3
    },
    "multipleChoiceConfig": {
      "variantsNumber": 0,
      "amount": 0
    },
    "binaryChoiceCardConfig": {
      "amount": 0
    },
    "missingWordCardConfig": {
      "amount": 0
    }
  }
});
