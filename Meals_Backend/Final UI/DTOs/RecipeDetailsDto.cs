namespace Final_UI.DTOs
{
    //Carol
    public class RecipeDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public string NutritionalFacts { get; set; }
        public string ImageUrl { get; set; }
        public int CookingTime { get; set; }
        public string Cuisine { get; set; }
        public List<IngredientDto> Ingredients { get; set; }
        public List<ReviewDto> Reviews { get; set; }
    }
}
