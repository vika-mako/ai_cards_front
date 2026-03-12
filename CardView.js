export class CardView {
    constructor(card, container, stateManager) {
        this.card = card;
        this.container = container;
        this.stateManager = stateManager;
    }

    render() {
        throw new Error('Method render must be implemented in child class');
    }

    showResult(isCorrect) {
        const resultClass = isCorrect ? 'correct' : 'incorrect';
        const message = isCorrect ? 'Правильно!' : 'Неправильно. Попробуй еще!';
        
        const resultDiv = document.createElement('div');
        resultDiv.className = `result-message ${resultClass}`;
        resultDiv.textContent = message;
        
        return resultDiv;
    }

    createButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `card-button ${className}`;
        button.addEventListener('click', onClick);
        return button;
    }
}

import { CardView } from './CardView.js';

export class SingleChoiceView extends CardView {
    render() {
        this.container.innerHTML = '';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = `card card-single ${this.card.state.toLowerCase()}`;
        
        const title = document.createElement('h3');
        title.textContent = this.card.title;
        cardDiv.appendChild(title);

        const task = document.createElement('p');
        task.textContent = this.card.task;
        cardDiv.appendChild(task);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        this.card.variants.forEach((variant, index) => {
            const option = document.createElement('div');
            option.className = `option ${this.card.userSelection === index ? 'selected' : ''}`;
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'answer';
            radio.value = index;
            radio.checked = this.card.userSelection === index;
            radio.disabled = this.card.state !== 'CollectAnswer';
            radio.addEventListener('change', () => {
                this.card.selectAnswer(index);
                this.render();
            });
            
            const label = document.createElement('label');
            label.textContent = variant;
            
            option.appendChild(radio);
            option.appendChild(label);
            optionsDiv.appendChild(option);
        });
        
        cardDiv.appendChild(optionsDiv);
        
        if (this.card.state === 'CollectAnswer') {
            const checkButton = this.createButton('Проверить', () => {
                const isCorrect = this.stateManager.checkCurrentAnswer();
                this.render();
            });
            cardDiv.appendChild(checkButton);
        }
        
        if (this.card.state !== 'CollectAnswer' && this.card.isCorrect !== null) {
            cardDiv.appendChild(this.showResult(this.card.isCorrect));
            
            if (!this.card.isCorrect && this.card.state === 'AnswerChecked') {
                const tryAgainButton = this.createButton('Попробовать снова', () => {
                    this.stateManager.resetCurrentCard();
                    this.render();
                });
                cardDiv.appendChild(tryAgainButton);
            }
            
            if (this.card.isCorrect) {
                const nextButton = this.createButton('Далее →', () => {
                    this.stateManager.nextCard();
                });
                cardDiv.appendChild(nextButton);
            }
        }
        
        this.container.appendChild(cardDiv);
    }
}

import { CardView } from './CardView.js';

export class MultipleChoiceView extends CardView {
    render() {
        this.container.innerHTML = '';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = `card card-multiple ${this.card.state.toLowerCase()}`;
        
        const title = document.createElement('h3');
        title.textContent = this.card.title;
        cardDiv.appendChild(title);
        
        const task = document.createElement('p');
        task.textContent = this.card.task;
        cardDiv.appendChild(task);
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'options';
        
        this.card.variants.forEach((variant, index) => {
            const option = document.createElement('div');
            option.className = `option ${this.card.userSelections.includes(index) ? 'selected' : ''}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = index;
            checkbox.checked = this.card.userSelections.includes(index);
            checkbox.disabled = this.card.state !== 'CollectAnswer';
            checkbox.addEventListener('change', () => {
                this.card.toggleSelection(index);
                this.render();
            });
            
            const label = document.createElement('label');
            label.textContent = variant;
            
            option.appendChild(checkbox);
            option.appendChild(label);
            optionsDiv.appendChild(option);
        });
        
        cardDiv.appendChild(optionsDiv);
        
        if (this.card.state === 'CollectAnswer') {
            const checkButton = this.createButton('Проверить', () => {
                const isCorrect = this.stateManager.checkCurrentAnswer();
                this.render();
            });
            cardDiv.appendChild(checkButton);
        }
        
        if (this.card.state !== 'CollectAnswer' && this.card.isCorrect !== null) {
            cardDiv.appendChild(this.showResult(this.card.isCorrect));
            
            if (!this.card.isCorrect && this.card.state === 'AnswerChecked') {
                const tryAgainButton = this.createButton('Попробовать снова', () => {
                    this.stateManager.resetCurrentCard();
                    this.render();
                });
                cardDiv.appendChild(tryAgainButton);
            }
            
            if (this.card.isCorrect) {
                const nextButton = this.createButton('Далее →', () => {
                    this.stateManager.nextCard();
                });
                cardDiv.appendChild(nextButton);
            }
        }
        
        this.container.appendChild(cardDiv);
    }
}


import { CardView } from './CardView.js';

export class TextAnswerView extends CardView {
    render() {
        this.container.innerHTML = '';
        
        const cardDiv = document.createElement('div');
        cardDiv.className = `card card-text ${this.card.state.toLowerCase()}`;
        
        const title = document.createElement('h3');
        title.textContent = this.card.title;
        cardDiv.appendChild(title);
        
        const task = document.createElement('p');
        task.textContent = this.card.task;
        cardDiv.appendChild(task);
        
        if (this.card.state === 'CollectAnswer') {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Введите ответ...';
            input.value = this.card.userAnswer || '';
            input.addEventListener('input', (e) => {
                this.card.userAnswer = e.target.value;
            });
            cardDiv.appendChild(input);
            
            const checkButton = this.createButton('Проверить', () => {
                const isCorrect = this.stateManager.checkCurrentAnswer();
                this.render();
            });
            cardDiv.appendChild(checkButton);
        }
        
        if (this.card.state !== 'CollectAnswer' && this.card.isCorrect !== null) {
            cardDiv.appendChild(this.showResult(this.card.isCorrect));
            
            if (!this.card.isCorrect && this.card.state === 'AnswerChecked') {
                const tryAgainButton = this.createButton('Попробовать снова', () => {
                    this.stateManager.resetCurrentCard();
                    this.render();
                });
                cardDiv.appendChild(tryAgainButton);
            }
            
            if (this.card.isCorrect) {
                const correctDiv = document.createElement('div');
                correctDiv.className = 'correct-answer';
                correctDiv.innerHTML = `<strong>Правильный ответ:</strong> ${this.card.correctAnswer}`;
                cardDiv.appendChild(correctDiv);
                
                const nextButton = this.createButton('Далее →', () => {
                    this.stateManager.nextCard();
                });
                cardDiv.appendChild(nextButton);
            }
        }
        
        this.container.appendChild(cardDiv);
    }
}
