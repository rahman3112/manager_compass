using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GuideController : ControllerBase
    {
        private readonly SituationService _situations;
        private readonly GuardrailService _guardrail;

        public GuideController(SituationService situations, GuardrailService guardrail)
        {
            _situations = situations;
            _guardrail = guardrail;
        }

        [HttpPost]
        public ActionResult<Guide> GetGuide([FromBody] GuideRequest request)
        {
            var escalation = _guardrail.CheckHighRisk(request.Situation);
            if (escalation != null)
                return Ok(escalation);

            var guide = _situations.BuildGuide(request.CategoryId, request.Situation);
            return Ok(guide);
        }
    }
}