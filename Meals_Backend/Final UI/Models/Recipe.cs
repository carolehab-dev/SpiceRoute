namespace Final_UI.Models
{
    public class Recipe
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public string NutritionalFacts { get; set; }
        public string ImageUrl { get; set; }
        public int CookingTime { get; set; }
        public string Cuisine { get; set; }
        public ICollection<Ingredient> Ingredients { get; set; } //navigation property
        public ICollection<Review> Reviews { get; set; }
        public ICollection<User> SavedByUsers { get; set; }
    }
}
