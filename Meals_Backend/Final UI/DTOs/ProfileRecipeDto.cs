namespace Final_UI.DTOs
{
    public class ProfileRecipeDto //RecipeDto Angela
    {
        public required string Name { get; set; }
        public required string image { get; set; }
        public required string description { get; set; }
        public required string instructions { get; set; }
        public required string facts { get; set; }
        public required string cuisine { get; set; }
        public required int cook_time { get; set; }
        public List<ProfileIngredientsDto> Ingredients { get; set; } = new List<ProfileIngredientsDto>();
    }
}
