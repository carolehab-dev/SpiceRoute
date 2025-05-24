namespace Final_UI.DTOs
{
    public class PlanDto
    {
        public required int UserId { get; set; }
        public required int RecipeId { get; set; }
        public required string Name { get; set; }
        public required DateTime Date { get; set; }
        public required string Category { get; set; }
    }
}
