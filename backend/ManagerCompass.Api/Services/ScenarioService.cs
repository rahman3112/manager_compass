using ManagerCompass.Api.Data;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public class ScenarioService : IScenarioService
{
    public IReadOnlyList<Scenario> GetAll() => ScenarioSeedData.All;
}
