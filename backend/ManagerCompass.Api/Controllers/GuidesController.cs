using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ManagerCompass.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GuidesController : ControllerBase
{
    private readonly IGuideService _guideService;

    public GuidesController(IGuideService guideService)
    {
        _guideService = guideService;
    }

    [HttpPost]
    public ActionResult<Guide> Create([FromBody] GuideRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.CategoryId) || string.IsNullOrWhiteSpace(request.Situation))
        {
            return BadRequest("categoryId and situation are required.");
        }

        var guide = _guideService.BuildGuide(request);
        if (guide is null)
        {
            return BadRequest($"Unknown categoryId '{request.CategoryId}'.");
        }

        return Ok(guide);
    }
}
