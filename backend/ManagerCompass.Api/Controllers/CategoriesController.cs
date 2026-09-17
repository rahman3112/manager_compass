using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoriesController : ControllerBase
    {
        private readonly SituationService _situations;

        public CategoriesController(SituationService situations)
        {
            _situations = situations;
        }

        [HttpGet]
        public ActionResult<List<Category>> Get()
        {
            return Ok(_situations.GetCategories());
        }
    }
}
