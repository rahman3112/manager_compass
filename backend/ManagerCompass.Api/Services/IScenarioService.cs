using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public interface IScenarioService
{
    IReadOnlyList<Scenario> GetAll();
}
