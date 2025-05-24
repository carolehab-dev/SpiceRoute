namespace Final_UI.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Amount { get; set; }
        public string Category { get; set; }
        public int RecipeId { get; set; }
        public Recipe Recipe { get; set; }
    }
}
