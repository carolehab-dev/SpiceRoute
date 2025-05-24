using Final_UI.Data;
using Final_UI.DTOs;
using Final_UI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Final_UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ApplicationDbContext _context;

        public RecipeController(ApplicationDbContext context,  IWebHostEnvironment env)
        {
        
            _context = context;  
            _env = env;
        }

        // GET: api/recipe  //carol
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var recipes = await _context.Recipes
                .Select(r => new RecipeCardDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    ImageUrl = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                    CookingTime = r.CookingTime,
                    Cuisine = r.Cuisine
                })
                .ToListAsync();

            return Ok(recipes);
        }

        //Carol
        [HttpGet("filter")]
        public async Task<IActionResult> GetByFilters(
          [FromQuery] string? cuisine,
          [FromQuery] int? maxTime,
          [FromQuery] string? search)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var query = _context.Recipes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(cuisine))
            {   
                query = query.Where(r => r.Cuisine.ToLower().Contains( cuisine.ToLower()));
            }

            if (maxTime.HasValue && maxTime.Value > 0)
            {
                query = query.Where(r => r.CookingTime <= maxTime.Value);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var loweredSearch = search.ToLower();
                query = query.Where(r => r.Name.ToLower().Contains(loweredSearch));
            }

            var recipes = await query
                .Select(r => new RecipeCardDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    ImageUrl = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                    CookingTime = r.CookingTime,
                    Cuisine = r.Cuisine
                })
                .ToListAsync();

            return Ok(recipes);
        }

        //Carol
        [HttpPost("{id}/add-review")]
        public async Task<IActionResult> AddReview(int id, [FromBody] ReviewDto reviewDto)
        {
            if (reviewDto == null || reviewDto.Rating < 1 || reviewDto.Rating > 5 || string.IsNullOrWhiteSpace(reviewDto.Comment))
                return BadRequest("Invalid review data.");

            var recipe = await _context.Recipes.FindAsync(id);
            if (recipe == null)
                return NotFound($"Recipe with ID {id} not found.");

            var user = await _context.Users.FindAsync(reviewDto.UserId);
            if (user == null)
                return NotFound($"User with ID {reviewDto.UserId} not found.");

            var review = new Review
            {
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                RecipeId = id,
                UserId = reviewDto.UserId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            // return the created review with username
            reviewDto.Id = review.Id;
            reviewDto.Username = user.Username;
            reviewDto.RecipeId = id;

            return Ok(reviewDto);
        }

        //Carol
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var recipe = await _context.Recipes
                .Include(r => r.Ingredients)
                .Include(r => r.Reviews)
                    .ThenInclude(rv => rv.User)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recipe == null) return NotFound();

            var recipeDetailsDto = new RecipeDetailsDto
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                Instructions = recipe.Instructions,
                NutritionalFacts = recipe.NutritionalFacts,
                ImageUrl = string.IsNullOrEmpty(recipe.ImageUrl) ? null : $"{baseUrl}/images/{recipe.ImageUrl}",
                CookingTime = recipe.CookingTime,
                Cuisine = recipe.Cuisine,
                Ingredients = recipe.Ingredients.Select(i => new IngredientDto
                {
                    Id = i.Id,
                    Name = i.Name,
                    Amount = i.Amount,
                    Category = i.Category
                }).ToList(),
                Reviews = recipe.Reviews.Select(rv => new ReviewDto
                {
                    Id = rv.Id,
                    Rating = rv.Rating,
                    Comment = rv.Comment,
                    UserId = rv.UserId,
                    Username = rv.User?.Username,
                    RecipeId = rv.RecipeId
                }).ToList()
            };

            return Ok(recipeDetailsDto);
        }
        
        //Carol
        [HttpPost("save")]
        public async Task<IActionResult> SaveRecipe([FromBody] SaveRecipeDto dto)
        {
            var user = await _context.Users
                .Include(u => u.SavedRecipes)
                .FirstOrDefaultAsync(u => u.Id == dto.UserId);
            if (user == null)
                return NotFound("User not found.");

            var recipe = await _context.Recipes.FindAsync(dto.RecipeId);
            if (recipe == null)
                return NotFound("Recipe not found.");

            if (user.SavedRecipes.Any(r => r.Id == dto.RecipeId))
                return BadRequest("Recipe already saved.");

            user.SavedRecipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok("Recipe saved.");
        }

        //Carol
        [HttpPost("unsave")]
        public IActionResult UnsaveRecipe([FromBody] SaveRecipeDto dto)
        {
            var user = _context.Users.Include(u => u.SavedRecipes).FirstOrDefault(u => u.Id == dto.UserId);
            var recipe = _context.Recipes.Find(dto.RecipeId);

            if (user == null || recipe == null)
                return NotFound("User or Recipe not found");

            var existing = user.SavedRecipes.FirstOrDefault(r => r.Id == recipe.Id);
            if (existing != null)
            {
                user.SavedRecipes.Remove(existing);
                _context.SaveChanges();
                return Ok("Recipe unsaved.");
            }

            return Ok("Recipe unsaved."); // Return OK regardless of whether it was previously saved
        }

        //Carol
        [HttpGet("saved/{userId}")]
        public async Task<IActionResult> GetSavedRecipes(int userId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var user = await _context.Users
                .Include(u => u.SavedRecipes)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return NotFound("User not found.");

            var savedRecipes = user.SavedRecipes.Select(r => new RecipeCardDto
            {
                Id = r.Id,
                Name = r.Name,
                ImageUrl = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                CookingTime = r.CookingTime,
                Cuisine = r.Cuisine
            }).ToList();

            return Ok(savedRecipes);
        }
    }
}
