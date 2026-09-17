using ManagerCompass.Api.Models;
using ManagerCompass.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ManagerCompass.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public ActionResult<IReadOnlyList<Category>> GetAll() => Ok(_categoryService.GetAll());

    [HttpGet("{id}")]
    public ActionResult<Category> GetById(string id)
    {
        var category = _categoryService.GetById(id);
        if (category is null)
        {
            return NotFound();
        }

        return Ok(category);
    }
}
