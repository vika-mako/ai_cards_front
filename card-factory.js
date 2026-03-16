import {
    TextAnswerCardUiModel,
    SingleChoiceCardUiModel,
    MultipleChoiceCardUiModel,
    BinaryChoiceCardUiModel,
  } from "../models/card-ui.models.js";
  
  function normalizeExplicitType(raw) {
    const explicitType = raw.kind || raw.type || raw.cardType || raw.__type || raw.className;
  
    switch (explicitType) {
      case "TextAnswerCard":
      case "text":
        return "text";
  
      case "SingleChoiceCard":
      case "single":
        return "single";
  
      case "MultipleChoiceCard":
      case "multiple":
        return "multiple";
  
      case "BinaryChoiceCard":
      case "binary":
        return "binary";
  
      default:
        return null;
    }
  }
  
  export function detectCardType(rawCard) {
    const explicitType = normalizeExplicitType(rawCard);
    if (explicitType) return explicitType;
  
    if (Array.isArray(rawCard.answerVariants) && Array.isArray(rawCard.answer)) {
      return "multiple";
    }
  
    if (Array.isArray(rawCard.answerVariants) && typeof rawCard.answer === "number") {
      return "single";
    }
  
    if (typeof rawCard.answer === "boolean") {
      return "binary";
    }
  
    if (typeof rawCard.answer === "string") {
      return "text";
    }
  
    throw new Error(`Cannot detect card type for payload: ${JSON.stringify(rawCard)}`);
  }
  
  export function mapRawCardToUiCard(rawCard, index = 0) {
    const id = rawCard.id || `api_card_${index}`;
    const type = detectCardType(rawCard);
  
    switch (type) {
      case "text":
        return new TextAnswerCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answer: rawCard.answer,
        });
  
      case "single":
        return new SingleChoiceCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answerVariants: rawCard.answerVariants,
          answer: rawCard.answer,
        });
  
      case "multiple":
        return new MultipleChoiceCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answerVariants: rawCard.answerVariants,
          answer: rawCard.answer,
        });
  
      case "binary":
        return new BinaryChoiceCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answer: rawCard.answer,
        });
  
      default:
        throw new Error(`Unsupported card type: ${type}`);
    }
  }
  
  export function mapRawCardsToUiCards(rawCards) {
    return rawCards.map((item, index) => mapRawCardToUiCard(item, index));
  }   
