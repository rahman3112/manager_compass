using ManagerCompass.Api.Data;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public class CategoryService : ICategoryService
{
    public IReadOnlyList<Category> GetAll() => CategorySeedData.All;

    public Category? GetById(string id) =>
        CategorySeedData.All.FirstOrDefault(c => c.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
}
