using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/plans")]
    public class PlansController : ControllerBase
    {
        private readonly PlanService _plans;
        private readonly TaskService _tasks;

        public PlansController(PlanService plans, TaskService tasks)
        {
            _plans = plans;
            _tasks = tasks;
        }

        [HttpGet("summary")]
        public ActionResult<DashboardSummary> GetSummary()
        {
            return Ok(_tasks.GetSummary(_plans.TotalCount()));
        }

        [HttpPost("{id}/feedback")]
        public ActionResult SubmitFeedback(string id, [FromBody] PlanFeedbackRequest request)
        {
            var updated = _plans.SubmitFeedback(id, request.WasHelpful, request.Comment);
            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
