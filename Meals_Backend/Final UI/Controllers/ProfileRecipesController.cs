using Final_UI.Data;
using Final_UI.DTOs;
using Final_UI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;

namespace Final_UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileRecipesController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        private readonly ApplicationDbContext _context;

        public ProfileRecipesController(ApplicationDbContext dbContext, IWebHostEnvironment env)
        {
            this._env = env;

            this._context = dbContext;
        }

        [HttpGet]
        [Route("specificUser/{id:int}")]
        public IActionResult GetAllRecipes(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";

            var userRecipes = _context.Recipes
                .Where(r => r.UserId == id)
                .Select(r => new ProfileAllRecipesDto
                {
                    Id = r.Id,
                    image = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                    //image = r.image,

                    Name = r.Name,
                    description = r.Description
                }).ToList();

            return Ok(userRecipes);
        }

        [HttpGet]
        [Route("oneRecipe/{id:int}/user/{userId:int}")]     //idenitfy recipe id
        public IActionResult GetOneRecipe(int id, int userId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var recipeWithIngredients = _context.Recipes
            .Include(r => r.Ingredients)
            .Where(r => r.Id == id)
            .Select(r => new ProfileRecipeIdDto
            {
                Id = r.Id,
                Name = r.Name,
                image = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                description = r.Description,
                instructions = r.Instructions,
                facts = r.NutritionalFacts,
                cuisine = r.Cuisine,
                cook_time = r.CookingTime,
                Ingredients = r.Ingredients.Select(i => new ProfileIngredientsDto
                {
                    Name = i.Name,
                    amount = i.Amount,
                    category = i.Category
                }).ToList()
            })
            .FirstOrDefault();

            if (recipeWithIngredients == null)
            {
                return NotFound();
            }

            return Ok(recipeWithIngredients);
        }

        //[HttpPost]
        //[Route("addRecipe/{userId:int}")]
        //public async Task<IActionResult> AddRecipe([FromForm] RecipeFormData addRecipe, int userId)
        //{
        //    string imageFileName = null;

        //    if (addRecipe.ImageFile != null && addRecipe.ImageFile.Length > 0)
        //    {
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        //        Directory.CreateDirectory(uploadsFolder);

        //        imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(addRecipe.ImageFile.FileName);
        //        var filePath = Path.Combine(uploadsFolder, imageFileName);

        //        using var stream = new FileStream(filePath, FileMode.Create);
        //        await addRecipe.ImageFile.CopyToAsync(stream);
        //    }


        //    var recipeEntity = new Recipe()
        //    {
        //        UserId = userId,
        //        Name = addRecipe.Name,
        //        ImageUrl = imageFileName,
        //        Description = addRecipe.Description,
        //        Instructions = addRecipe.Instructions,
        //        NutritionalFacts = addRecipe.Facts,
        //        Cuisine = addRecipe.Cuisine,
        //        CookingTime = int.Parse(addRecipe.CookTime),
        //        Ingredients = addRecipe.Ingredients.Select(i => new Ingredient
        //        {
        //            Name = i.Name,
        //            Amount = i.amount,
        //            Category = i.category
        //        }).ToList()
        //    };

        //    _context.Recipes.Add(recipeEntity);
        //    _context.SaveChanges();      //to add all things manually
        //                                 //to return recipe back with id if the request success
        //    return Ok(new
        //    {
        //        message = "Recipe added successfully"
        //    });

        //}
        [HttpPost]
        public async Task<IActionResult> AddRecipe([FromForm] RecipeFormData addRecipe, int userId)
        {
            // Manually get the ingredients JSON string from form data
            var ingredientsJson = Request.Form["Ingredients"].ToString();

            List<ProfileIngredientsDto> ingredients = null;
            if (!string.IsNullOrEmpty(ingredientsJson))
            {
                ingredients = JsonConvert.DeserializeObject<List<ProfileIngredientsDto>>(ingredientsJson);
            }

            // Handle image upload
            string imageFileName = null;
            if (addRecipe.ImageFile != null && addRecipe.ImageFile.Length > 0)
            {
                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
                Directory.CreateDirectory(uploadsFolder);

                imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(addRecipe.ImageFile.FileName);
                var filePath = Path.Combine(uploadsFolder, imageFileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await addRecipe.ImageFile.CopyToAsync(stream);
            }

            // Now build recipe entity with deserialized ingredients
            var recipeEntity = new Recipe()
            {
                UserId = userId,
                Name = addRecipe.Name,
                ImageUrl = imageFileName,
                Description = addRecipe.Description,
                Instructions = addRecipe.Instructions,
                NutritionalFacts = addRecipe.Facts,
                Cuisine = addRecipe.Cuisine,
                CookingTime = int.Parse(addRecipe.CookTime),
                Ingredients = ingredients?.Select(i => new Ingredient
                {
                    Name = i.Name,
                    Amount = i.amount,
                    Category = i.category
                }).ToList() ?? new List<Ingredient>()
            };

            _context.Recipes.Add(recipeEntity);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Recipe added successfully",
                recipeId = recipeEntity.Id // returning newly created recipe ID
            });
        }


        //[HttpPost]
        //[Route("addRecipe/{userId:int}")]
        //public async Task<IActionResult> AddRecipe([FromForm] RecipeFormData addRecipe, int userId)
        //{
        //    string imageFileName = null;

        //    // Save image if provided
        //    if (addRecipe.ImageFile != null && addRecipe.ImageFile.Length > 0)
        //    {
        //        var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");
        //        Directory.CreateDirectory(uploadsFolder);

        //        imageFileName = Guid.NewGuid().ToString() + Path.GetExtension(addRecipe.ImageFile.FileName);
        //        var filePath = Path.Combine(uploadsFolder, imageFileName);

        //        using var stream = new FileStream(filePath, FileMode.Create);
        //        await addRecipe.ImageFile.CopyToAsync(stream);
        //    }

        //    // Create recipe entity
        //    var recipeEntity = new Recipe
        //    {
        //        UserId = userId,
        //        Name = addRecipe.Name,
        //        ImageUrl = imageFileName,
        //        Description = addRecipe.Description,
        //        Instructions = addRecipe.Instructions,
        //        NutritionalFacts = addRecipe.Facts,
        //        Cuisine = addRecipe.Cuisine,
        //        CookingTime = int.Parse(addRecipe.CookTime),
        //        Ingredients = addRecipe.Ingredients?.Select(i => new Ingredient
        //        {
        //            Name = i.Name,
        //            Amount = i.amount,
        //            Category = i.category
        //        }).ToList() ?? new List<Ingredient>()
        //    };

        //    // Save to DB
        //    _context.Recipes.Add(recipeEntity);
        //    await _context.SaveChangesAsync();

        //    // Return response
        //    return Ok(new
        //    {
        //        message = "Recipe added successfully",
        //        recipeId = recipeEntity.Id
        //    });
        //}


        [HttpPut]
        [Route("{id:int}/user/{userId:int}")]
        public IActionResult updateRecipe(int id, UpdateRecipeDto upRecipe, int userId)
        {
            var recipe = _context.Recipes
                .Include(r => r.Ingredients)
                .FirstOrDefault(r => r.Id == id && r.UserId == userId);

            if (recipe == null)
            {
                return NotFound();
            }

            recipe.Description = upRecipe.description;
            recipe.Instructions = upRecipe.instructions;
            recipe.NutritionalFacts = upRecipe.facts;
            recipe.Cuisine = upRecipe.cuisine;
            recipe.CookingTime = upRecipe.cook_time;

            // Clear old ingredients as can cause duplicate ing.
            _context.Ingredients.RemoveRange(recipe.Ingredients);

            recipe.Ingredients = upRecipe.Ingredients.Select(i => new Ingredient
            {
                Name = i.Name,
                Amount = i.amount,
                Category = i.category
            }).ToList();

            _context.SaveChanges();
            return Ok(new ProfileRecipeDto
            {
                Name = recipe.Name,
                image = recipe.ImageUrl,
                description = recipe.Description,
                instructions = recipe.Instructions,
                facts = recipe.NutritionalFacts,
                cuisine = recipe.Cuisine,
                cook_time = recipe.CookingTime,
                Ingredients = recipe.Ingredients.Select(i => new ProfileIngredientsDto
                {
                    Name = i.Name,
                    amount = i.Amount,
                    category = i.Category
                }).ToList()
            });
        }
        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult deleteRecipe(int id)
        {
            //will remove ingrediets based on cascad in dbcontext
            var recipe = _context.Recipes.Find(id);

            if (recipe == null)
            {
                return NotFound();
            }
            _context.Recipes.Remove(recipe);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("usersall/{currentUserId}")]
        //get with specific path as recipes/users instead of recipes only
        //as it cause conflict bec. two functions with the same path
        public IActionResult GetAllUsers(int currentUserId)
        {
            var users = _context.Users
                .Where(u => u.Id != currentUserId)     //to get all users except dah
                .Select(u => new UserProfileDto
                {
                    Id = u.Id,
                    Name = u.Username
                })
                .ToList();

            return Ok(users);
        }

        //el nas ely ana h3melhaa
        [HttpGet("followingIDs/{userId}")]
        public IActionResult GetFollowingIDs(int userId)
        {
            var following = _context.Followers
                .Where(f => f.UserId == userId)
                .Select(f => f.FollowedUserId)
                .ToList();


            return Ok(following);
        }

        [HttpGet("following/{userId}")]
        public IActionResult GetFollowing(int userId)
        {
            var following = _context.Followers
                .Where(f => f.UserId == userId)
                .Join(_context.Users,
                    follower => follower.FollowedUserId,
                    user => user.Id,
                    (follower, user) => new
                    {
                        UserId = user.Id,
                        UserName = user.Username,
                    })
                .ToList();

            return Ok(following);
        }

        //el nas ely ht follow me
        [HttpGet("followers/{userId}")]
        public IActionResult GetFollowers(int userId)
        {

            var followers = _context.Followers
                .Where(f => f.FollowedUserId == userId)
                .Join(_context.Users,
                    follower => follower.UserId,
                    user => user.Id,
                    (follower, user) => new
                    {
                        UserId = user.Id,
                        UserName = user.Username,
                    })
                .ToList();

            return Ok(followers);
        }
        //follow button
        [HttpPost("follow")]
        public IActionResult FollowUser([FromBody] Followers model)
        {
            _context.Followers.Add(model);
            _context.SaveChanges();
            return Ok();
        }

        //unfollow button
        [HttpDelete("unfollow")]
        //find() for search only but FirstOrDefault() for link conditions
        public IActionResult UnfollowUser(int userId, int followedUserId)
        {
            var user = _context.Followers.FirstOrDefault(u => u.UserId == userId && u.FollowedUserId == followedUserId);

            if (user == null)
            {
                return NotFound();
            }
            _context.Followers.Remove(user);
            _context.SaveChanges();
            return Ok();

        }

        [HttpGet("recipesOfUser/{targetUserId:int}/viewer/{viewerId:int}")]
        public IActionResult GetRecipesIfFollowing(int targetUserId, int viewerId)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            bool isFollowing = _context.Followers.Any(f =>
                f.UserId == viewerId && f.FollowedUserId == targetUserId);

            if (!isFollowing)
                //return StatusCode(403, new
                //{
                //    Message = "You must follow this user to view their recipes"
                //});
            return Forbid("You are not following this user");

            var recipes = _context.Recipes
                .Where(r => r.UserId == targetUserId)
                .Select(r => new ProfileAllRecipesDto
                {
                    Id = r.Id,
                   image = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                    Name = r.Name,
                    description = r.Description
                }).ToList();

            return Ok(recipes);
        }


        [HttpGet]
        [Route("displayOnlyRecipe/{id:int}")]
        public IActionResult GetOneRecipe(int id)
        {
            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var recipeWithIngredients = _context.Recipes
                .Include(r => r.Ingredients)
                .Where(r => r.Id == id).Select(r => new ProfileRecipeIdDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    image = string.IsNullOrEmpty(r.ImageUrl) ? null : $"{baseUrl}/images/{r.ImageUrl}",
                    description = r.Description,
                    instructions = r.Instructions,
                    facts = r.NutritionalFacts,
                    cuisine = r.Cuisine,
                    cook_time = r.CookingTime,
                    Ingredients = r.Ingredients.Select(i => new ProfileIngredientsDto
                    {
                        Name = i.Name,
                        amount = i.Amount,
                        category = i.Category
                    }).ToList()
                })
                .FirstOrDefault();

            if (recipeWithIngredients == null)
            {
                return NotFound();
            }

            return Ok(recipeWithIngredients);
        }
    }
}
