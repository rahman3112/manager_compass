using System.Text.Json;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

/// <summary>File-backed CRUD for manager tasks, plus the dashboard summary tiles.</summary>
public class TaskService
{
    private readonly string _filePath;
    private readonly List<ManagerTask> _tasks;
    private readonly object _lock = new();

    public TaskService(IWebHostEnvironment env)
    {
        var dir = Path.Combine(env.ContentRootPath, "Assets", "processed");
        Directory.CreateDirectory(dir);
        _filePath = Path.Combine(dir, "tasks.json");
        _tasks = LoadFromDisk();
    }

    private List<ManagerTask> LoadFromDisk()
    {
        if (!File.Exists(_filePath))
        {
            return new();
        }

        try
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<ManagerTask>>(json) ?? new();
        }
        catch
        {
            return new();
        }
    }

    private void SaveToDisk()
    {
        var json = JsonSerializer.Serialize(_tasks, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(_filePath, json);
    }

    public List<ManagerTask> GetAll()
    {
        lock (_lock)
        {
            return _tasks.OrderByDescending(t => t.CreatedAt).ToList();
        }
    }

    public ManagerTask Create(TaskRequest request)
    {
        var task = new ManagerTask
        {
            Name = request.Name,
            CategoryId = request.CategoryId,
            Description = request.Description,
            DueDate = request.DueDate,
            Priority = request.Priority,
            Status = request.Status,
            Checklist = request.Checklist,
            SourcePlanId = request.SourcePlanId,
        };

        lock (_lock)
        {
            _tasks.Add(task);
            SaveToDisk();
        }

        return task;
    }

    public ManagerTask? Update(string id, TaskRequest request)
    {
        lock (_lock)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task is null)
            {
                return null;
            }

            task.Name = request.Name;
            task.CategoryId = request.CategoryId;
            task.Description = request.Description;
            task.DueDate = request.DueDate;
            task.Priority = request.Priority;
            task.Status = request.Status;
            task.Checklist = request.Checklist;
            SaveToDisk();
            return task;
        }
    }

    public DashboardSummary GetSummary(int totalPlans)
    {
        lock (_lock)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var open = _tasks.Where(t => t.Status != ManagerTaskStatus.Completed).ToList();

            return new DashboardSummary
            {
                OpenTasks = open.Count,
                Overdue = open.Count(t => t.DueDate.HasValue && t.DueDate.Value < today),
                DueWithinThreeDays = open.Count(t => t.DueDate.HasValue && t.DueDate.Value >= today && t.DueDate.Value <= today.AddDays(3)),
                TotalPlans = totalPlans,
            };
        }
    }
}
