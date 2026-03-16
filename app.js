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
  subject: "physics",
  limit: 10,
});
