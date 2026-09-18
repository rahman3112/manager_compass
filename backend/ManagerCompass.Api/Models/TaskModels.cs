namespace ManagerCompass.Api.Models;

public enum TaskPriority
{
    Low,
    Medium,
    High,
    Critical,
}

public enum ManagerTaskStatus
{
    NotStarted,
    InProgress,
    Completed,
    Blocked,
}

public class ChecklistItem
{
    public string Text { get; set; } = string.Empty;
    public bool Done { get; set; }
}

public class ManagerTask
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Name { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly? DueDate { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public ManagerTaskStatus Status { get; set; } = ManagerTaskStatus.NotStarted;
    public List<ChecklistItem> Checklist { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Set when a task is created from a generated plan, for traceability. Not shown as its own field.
    public string? SourcePlanId { get; set; }
}

public class TaskRequest
{
    public string Name { get; set; } = string.Empty;
    public string CategoryId { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateOnly? DueDate { get; set; }
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public ManagerTaskStatus Status { get; set; } = ManagerTaskStatus.NotStarted;
    public List<ChecklistItem> Checklist { get; set; } = new();
    public string? SourcePlanId { get; set; }
}

public class DashboardSummary
{
    public int OpenTasks { get; set; }
    public int Overdue { get; set; }
    public int DueWithinThreeDays { get; set; }
    public int TotalPlans { get; set; }
}
