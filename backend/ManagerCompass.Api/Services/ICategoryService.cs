using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public interface ICategoryService
{
    IReadOnlyList<Category> GetAll();
    Category? GetById(string id);
}
