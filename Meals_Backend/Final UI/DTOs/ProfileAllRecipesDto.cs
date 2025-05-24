namespace Final_UI.DTOs
{
    public class ProfileAllRecipesDto
    {
        public int UserId { get; set; }
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string image { get; set; }
        public required string description { get; set; }
    }
}
