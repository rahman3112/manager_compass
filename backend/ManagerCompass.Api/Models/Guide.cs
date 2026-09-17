namespace ManagerCompass.Api.Models;

public class GuideRequest
{
    public string CategoryId { get; set; } = string.Empty;
    public string Situation { get; set; } = string.Empty;
    public List<string> ScenarioIds { get; set; } = new();   

}

public enum GuideKind
{
    Guide,
    Escalate,
    NoGuideFound,
}

/// <summary>
/// Output of the guide-writer: organizes and presents already-retrieved category
/// content (<see cref="Category"/>) plus the manager's description. Never invents
/// a step, document, or contact — everything here traces back to category data.
/// </summary>
public class Guide
{
    public GuideKind Kind { get; set; }

    // Kind == Escalate
    public string? EscalationMessage { get; set; }

    // Kind == NoGuideFound
    public string? NoGuideMessage { get; set; }

    // Kind == Guide
    public string? Situation { get; set; }
    public string? FirstStep { get; set; }
    public List<string> PrepareSteps { get; set; } = new();
    public List<ResourceLink> Documentation { get; set; } = new();
    public List<Faq> Faqs { get; set; } = new();
    public List<LearningMaterial> LearningMaterials { get; set; } = new();

    // Kind == Guide or NoGuideFound — "still stuck? talk to a person"
    public EscalationContact? Contact { get; set; }
}
