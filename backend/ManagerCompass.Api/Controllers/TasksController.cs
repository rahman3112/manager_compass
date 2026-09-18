using Microsoft.AspNetCore.Mvc;
using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;

namespace ManagerCompass.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TasksController : ControllerBase
    {
        private readonly TaskService _tasks;

        public TasksController(TaskService tasks)
        {
            _tasks = tasks;
        }

        [HttpGet]
        public ActionResult<List<ManagerTask>> Get()
        {
            return Ok(_tasks.GetAll());
        }

        [HttpPost]
        public ActionResult<ManagerTask> Create([FromBody] TaskRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.CategoryId))
            {
                return BadRequest("name and categoryId are required.");
            }

            return Ok(_tasks.Create(request));
        }

        [HttpPut("{id}")]
        public ActionResult<ManagerTask> Update(string id, [FromBody] TaskRequest request)
        {
            var updated = _tasks.Update(id, request);
            if (updated is null)
            {
                return NotFound();
            }

            return Ok(updated);
        }
    }
}
