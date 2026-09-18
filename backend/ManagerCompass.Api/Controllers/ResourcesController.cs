using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/resources")]
    public class ResourcesController : ControllerBase
    {
        private readonly ResourceLibraryService _library;

        public ResourcesController(ResourceLibraryService library)
        {
            _library = library;
        }

        [HttpGet]
        public ActionResult<List<ResourceNode>> Get()
        {
            return Ok(_library.GetTree());
        }
    }
}
