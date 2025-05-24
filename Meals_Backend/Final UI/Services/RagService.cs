using Microsoft.EntityFrameworkCore;
using Final_UI.Data;
using Final_UI.Models;

namespace Final_UI.Services
{
    public class RagService : IRagService
    {
        private readonly ApplicationDbContext _db;

        public RagService(ApplicationDbContext db)
        {
            _db = db;
        }

        public async Task<string> GetRelevantMealsContextAsync(string userMessage)
        {
            var keywords = ExtractKeywords(userMessage);

            var query = _db.Recipes
                .Include(r => r.Ingredients)
                .AsQueryable();

            if (keywords.Any())
            {
                query = query.Where(recipe =>
                    keywords.Any(keyword =>
                        recipe.Name.ToLower().Contains(keyword) ||
                        recipe.Cuisine.ToLower().Contains(keyword) ||
                        recipe.NutritionalFacts.ToLower().Contains(keyword) ||
                        recipe.Description.ToLower().Contains(keyword) ||
                        recipe.Ingredients.Any(i => i.Name.ToLower().Contains(keyword))
                    )
                );
            }

            var recipes = await query
                .OrderByDescending(r => r.CookingTime)
                .Take(5)
                .ToListAsync();

            if (!recipes.Any())
            {
                recipes = await _db.Recipes
                    .Include(r => r.Ingredients)
                    .OrderByDescending(r => r.Id)
                    .Take(5)
                    .ToListAsync();
            }

            if (!recipes.Any())
                return "No recipes found in the database.";

            var context = string.Join("\n\n", recipes.Select(recipe =>
                $"- Name: {recipe.Name}\n" +
                $"  Cuisine: {recipe.Cuisine}\n" +
                $"  Cooking Time: {recipe.CookingTime} min\n" +
                $"  Nutritional Facts: {recipe.NutritionalFacts}\n" +
                $"  Ingredients: {string.Join(", ", recipe.Ingredients.Select(i => i.Name))}\n" +
                $"  Description: {recipe.Description}"
            ));

            return context;
        }

        private static List<string> ExtractKeywords(string message)
        {
            return message
                .ToLower()
                .Split(' ', StringSplitOptions.RemoveEmptyEntries)
                .Where(w => w.Length > 3)
                .Distinct()
                .ToList();
        }
    }
}
