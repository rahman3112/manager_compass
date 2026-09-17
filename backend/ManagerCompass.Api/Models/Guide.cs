namespace ManagerCompass.Api.Models;

public class GuideRequest
{
    public string CategoryId { get; set; } = string.Empty;
    public string Situation { get; set; } = string.Empty;
    public string? DesiredOutcome { get; set; }
}

public class Guide
{
    public string Title { get; set; } = string.Empty;
    public bool IsUrgentEscalation { get; set; }
    public string SituationSummary { get; set; } = string.Empty;
    public string? DesiredOutcome { get; set; }
    public List<string> Steps { get; set; } = new();
    public List<ResourceLink> RecommendedDocumentation { get; set; } = new();
    public List<Faq> RelevantFaqs { get; set; } = new();
    public List<LearningMaterial> LearningMaterials { get; set; } = new();
    public EscalationContact? Escalation { get; set; }
    public string GuardrailNote { get; set; } = string.Empty;
}
