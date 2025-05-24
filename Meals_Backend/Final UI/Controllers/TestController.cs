using Final_UI.Data;
using Final_UI.DTOs;
using Final_UI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Final_UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public TestController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Carol
        [HttpPost("add-user")]
        public async Task<IActionResult> AddUser([FromBody] UserDto userDto)
        {
            if (userDto == null || string.IsNullOrWhiteSpace(userDto.Username))
                return BadRequest("Invalid user data.");

            var user = new User
            {
                Username = userDto.Username
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new UserDto { Id = user.Id, Username = user.Username });
        }

        //Carol
        [HttpPost("add-recipe")]
        public async Task<IActionResult> AddRecipe([FromBody] RecipeDto recipeDto)
        {
            if (recipeDto == null || string.IsNullOrWhiteSpace(recipeDto.Name))
                return BadRequest("Invalid recipe data.");

            var recipe = new Recipe
            {
                Name = recipeDto.Name,
                Description = recipeDto.Description,
                Instructions = recipeDto.Instructions,
                NutritionalFacts = recipeDto.NutritionalFacts,
                ImageUrl = recipeDto.ImageUrl,
                CookingTime = recipeDto.CookingTime,
                Cuisine = recipeDto.Cuisine,
                Ingredients = recipeDto.Ingredients?.Select(i => new Ingredient
                {
                    Name = i.Name,
                    Amount = i.Amount,
                    Category = i.Category
                }).ToList()
            };

            _context.Recipes.Add(recipe);
            await _context.SaveChangesAsync();

            return Ok(new { recipe.Id, recipe.Name });
        }

    }
}
