export class Meal {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public facts: string,
        public instructions: string,
        public imageUrl: string,
        public cookingTime:string,
        public cuisine :string,
        public ingredients: Ingredient[] = []

      ) {}
}

export class Ingredient {
    constructor(
      public name: string,
      public amount: string,
      public category: string
    ) {}
  }
