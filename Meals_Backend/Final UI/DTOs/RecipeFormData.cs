using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Final_UI.DTOs
{
    public class RecipeFormData
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Instructions { get; set; }
        public string Facts { get; set; }
        public string Cuisine { get; set; }
        public string CookTime { get; set; }

        public IFormFile ImageFile { get; set; }

        public List<ProfileIngredientsDto> Ingredients { get; set; }


    }
}
