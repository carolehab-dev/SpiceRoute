namespace Final_UI.DTOs
{
    //Carol
    public class ReviewDto
    {
        public int Id { get; set; }
        public int Rating { get; set; } // 1-5 stars
        public string Comment { get; set; }
        public int UserId { get; set; }
        public string? Username { get; set; }
        public int? RecipeId { get; set; }
    }
}
