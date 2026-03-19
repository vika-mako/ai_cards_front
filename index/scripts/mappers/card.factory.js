import {
    TextAnswerCardUiModel,
    SingleChoiceCardUiModel,
    //MultipleChoiceCardUiModel,
    //BinaryChoiceCardUiModel,
  } from "../models/card-ui.models.js";
  
  export function detectCardType(rawCard) {
    return rawCard.type;
  }
  
  export function mapRawCardToUiCard(rawCard, index = 0) {
    const id = rawCard.id || `api_card_${index}`;
    const type = detectCardType(rawCard);
  
    switch (type) {
      case "TextAnswerCard":
        return new TextAnswerCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answer: rawCard.answer,
        });
  
      case "SingleChoiceCard":
        return new SingleChoiceCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answerVariants: rawCard.answerVariants,
          answer: rawCard.answer,
        });
  
      case "MultipleChoiceCard":
        return new MultipleChoiceCardUiModel({
          id,
          title: rawCard.title,
          task: rawCard.task,
          answerVariants: rawCard.answerVariants,
          answer: rawCard.answer,
        });
  
      case "BinaryChoiceCard":
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
