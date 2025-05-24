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
    public class PlanController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PlanController(ApplicationDbContext context)
        {
            _context = context;
        }
        //Nour
        [HttpPost]
        public IActionResult AddPlan(PlanDto planDto)
        {
            try
            {
                var planEntity = new Plan()
                {
                    UserId = planDto.UserId,
                    RecipeId = planDto.RecipeId,
                    Name = planDto.Name,
                    Date = planDto.Date,
                    Category = planDto.Category
                };

                _context.Plans.Add(planEntity);
                _context.SaveChanges();
                return Ok(planEntity);
            }

            catch (Exception ex)
            {
                ModelState.AddModelError("Plan", ex.Message);
                return BadRequest(ModelState);
            }

        }

        //Nour
        [HttpGet]
        [Route("{user_id}")]
        public IActionResult GetPlan(int user_id)
        {
            var plan = _context.Plans
            .Where(p => p.UserId == user_id)
            .ToList();
            if (plan is null)
            {
                return NotFound();
            }
            return Ok(plan);
        }


        //Nour
        [HttpGet]
        [Route("shopping-list/{user_id}")]
        public IActionResult GetShoppingList(int user_id)
        {
            var ingredients = _context.Plans
                .Where(p => p.UserId == user_id)
                .Join(_context.Recipes,
                      plan => plan.RecipeId,
                      recipe => recipe.Id,
                      (plan, recipe) => new { recipe })
                .SelectMany(x => x.recipe.Ingredients)
                .GroupBy(i => i.Category)
                .Select(g => new
                {
                    Category = g.Key,
                    Items = g.Select(i => new
                    {
                        i.Name,
                        i.Amount
                    }).ToList()
                }).ToList();

            return Ok(ingredients);
        }
        [HttpDelete("{id}")]
        public IActionResult DeletePlan(int id)
        {
            var plan = _context.Plans.Find(id);
            if (plan == null)
            {
                return NotFound(new { Message = $"Plan with ID {id} not found." });
            }

            _context.Plans.Remove(plan);
            _context.SaveChanges();

            return Ok(new { Message = $"Plan with ID {id} has been deleted." });
        }
    }
}
