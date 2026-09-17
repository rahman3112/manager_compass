namespace ManagerCompass.Api.Models;

public class ResourceLink
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class LearningMaterial
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // e.g. "Course", "Video", "Guide"
}

public class Faq
{
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
}

public class EscalationContact
{
    public string Role { get; set; } = string.Empty;
    public string When { get; set; } = string.Empty;
}

public class Category
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DefaultSituation { get; set; } = string.Empty;
    public string DefaultDesiredOutcome { get; set; } = string.Empty;
    public List<ResourceLink> Documentation { get; set; } = new();
    public List<Faq> Faqs { get; set; } = new();
    public List<LearningMaterial> LearningMaterials { get; set; } = new();
    public EscalationContact? Escalation { get; set; }
}
