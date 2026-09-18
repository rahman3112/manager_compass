using System.Text.Json;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

/// <summary>
/// Logs every plan Manager Compass generates (for the "total plans created" dashboard
/// tile) and stores the manager's helpfulness feedback against it. File-backed so
/// history survives across requests, not just in-memory for one process lifetime.
/// </summary>
public class PlanService
{
    private readonly string _filePath;
    private readonly List<PlanRecord> _plans;
    private readonly object _lock = new();

    public PlanService(IWebHostEnvironment env)
    {
        var dir = Path.Combine(env.ContentRootPath, "Assets", "processed");
        Directory.CreateDirectory(dir);
        _filePath = Path.Combine(dir, "plans.json");
        _plans = LoadFromDisk();
    }

    private List<PlanRecord> LoadFromDisk()
    {
        if (!File.Exists(_filePath))
        {
            return new();
        }

        try
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<PlanRecord>>(json) ?? new();
        }
        catch
        {
            return new();
        }
    }

    private void SaveToDisk()
    {
        var json = JsonSerializer.Serialize(_plans, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, json);
    }

    public PlanRecord Record(string categoryId, string situation, string firstStep)
    {
        var record = new PlanRecord { CategoryId = categoryId, Situation = situation, FirstStep = firstStep };
        lock (_lock)
        {
            _plans.Add(record);
            SaveToDisk();
        }

        return record;
    }

    public int TotalCount()
    {
        lock (_lock)
        {
            return _plans.Count;
        }
    }

    public bool SubmitFeedback(string planId, bool wasHelpful, string? comment)
    {
        lock (_lock)
        {
            var plan = _plans.FirstOrDefault(p => p.Id == planId);
            if (plan is null)
            {
                return false;
            }

            plan.WasHelpful = wasHelpful;
            plan.FeedbackComment = comment;
            SaveToDisk();
            return true;
        }
    }
}
