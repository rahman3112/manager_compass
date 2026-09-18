namespace ManagerCompass.Api.Models;

public class PlanRecord
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string CategoryId { get; set; } = string.Empty;
    public string Situation { get; set; } = string.Empty;
    public string FirstStep { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool? WasHelpful { get; set; }
    public string? FeedbackComment { get; set; }
}

public class PlanFeedbackRequest
{
    public bool WasHelpful { get; set; }
    public string? Comment { get; set; }
}
