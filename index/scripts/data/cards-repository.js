export class CardsRepository {
    constructor({ baseUrl = "/api" } = {}) {
      this.baseUrl = baseUrl;
    }
  
    async queryCards(spec = {}) {
      const response = await fetch(`${this.baseUrl}/v1/requestCards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(spec),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to load cards: ${response.status}`);
      }
  
      return await response.json();
    }
  }
