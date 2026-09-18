using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/scenarios")]
    public class ScenariosController : ControllerBase
    {
        private readonly SituationService _situations;

        public ScenariosController(SituationService situations)
        {
            _situations = situations;
        }

        [HttpGet]
        public ActionResult<List<Scenario>> Get([FromQuery] string? country)
        {
            return Ok(_situations.GetScenarios(country));
        }
    }
}
