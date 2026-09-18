using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/guides")]
    public class GuideController : ControllerBase
    {
        private readonly SituationService _situations;
        private readonly GuardrailService _guardrail;
        private readonly PlanService _plans;

        public GuideController(SituationService situations, GuardrailService guardrail, PlanService plans)
        {
            _situations = situations;
            _guardrail = guardrail;
            _plans = plans;
        }

        [HttpPost]
        public ActionResult<Guide> GetGuide([FromBody] GuideRequest request)
        {
            var escalation = _guardrail.CheckHighRisk(request.Situation);
            if (escalation != null)
                return Ok(escalation);

            var guide = _situations.BuildGuide(request.CategoryId, request.Situation, request.ScenarioIds);

            if (guide.Kind == GuideKind.Guide)
            {
                var record = _plans.Record(request.CategoryId, request.Situation, guide.FirstStep ?? "");
                guide.PlanId = record.Id;
            }

            return Ok(guide);
        }
    }
}