namespace Final_UI.DTOs
{
    public class UpdateRecipeDto //Angela
    {
        public required string description { get; set; }
        public required string instructions { get; set; }
        public required string facts { get; set; }
        public required string cuisine { get; set; }
        public required int cook_time { get; set; }
        public List<ProfileIngredientsDto> Ingredients { get; set; } = new List<ProfileIngredientsDto>();
    }
}
