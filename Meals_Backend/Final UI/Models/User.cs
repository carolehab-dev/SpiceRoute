namespace Final_UI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; } //
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Recipe> SavedRecipes { get; set; }
    }
}
