namespace Final_UI.Models
{
    public class Plan
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public string Name { get; set; } = "";
        //public required string Date { get; set; }

        public DateTime Date { get; set; }
        public string Category { get; set; } = "";
    }
}
