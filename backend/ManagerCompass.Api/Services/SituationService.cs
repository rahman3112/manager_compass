using System.Text.Json;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services
{
    // Internal shapes matching situations.json exactly — never exposed outside this file
    internal class RawDocRef
    {
        public string Title { get; set; } = "";
        public string File { get; set; } = "";
    }

    internal class RawFaq
    {
        public string Q { get; set; } = "";
        public string A { get; set; } = "";
    }

    internal class RawSituation
    {
        public string Category { get; set; } = "";
        public List<string> CheckboxTags { get; set; } = new();
        public List<string> Keywords { get; set; } = new();
        public List<string> Steps { get; set; } = new();
        public List<RawDocRef> Docs { get; set; } = new();
        public List<RawFaq> Faqs { get; set; } = new();
        public List<RawDocRef> Learning { get; set; } = new();
        public string? EscalationContact { get; set; }
        public string Status { get; set; } = "ready";
        public string? StatusNote { get; set; }
    }

    internal class RawCategoryContacts
    {
        public string? CategoryContact { get; set; }
        public Dictionary<string, string> Situations { get; set; } = new();
    }

    public class SituationService
    {
        private readonly Dictionary<string, RawSituation> _situations;
        private readonly Dictionary<string, List<string>> _keywords;
        private readonly Dictionary<string, RawCategoryContacts> _contacts;

        public Dictionary<string, List<string>> Keywords => _keywords;

        public SituationService(IWebHostEnvironment env)
        {
            var basePath = Path.Combine(env.ContentRootPath, "Assets", "processed");
            var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            _situations = JsonSerializer.Deserialize<Dictionary<string, RawSituation>>(
                File.ReadAllText(Path.Combine(basePath, "situations.json")), opts) ?? new();

            _keywords = JsonSerializer.Deserialize<Dictionary<string, List<string>>>(
                File.ReadAllText(Path.Combine(basePath, "keywords.json")), opts) ?? new();

            _contacts = JsonSerializer.Deserialize<Dictionary<string, RawCategoryContacts>>(
                File.ReadAllText(Path.Combine(basePath, "contacts.json")), opts) ?? new();
        }

        // Finds the best-matching situation inside a category by scoring keyword overlap
        // against the manager's free-text description.
        private string? FindBestSituationId(string categoryId, string description)
{
    var lowered = description.ToLowerInvariant();

    var candidates = _situations
        .Where(kv => kv.Value.Category.Equals(categoryId, StringComparison.OrdinalIgnoreCase))
        .Select(kv => new
        {
            Id = kv.Key,
            Data = kv.Value,
            Score = kv.Value.Keywords.Count(k => lowered.Contains(k.ToLowerInvariant()))
        })
        .Where(x => x.Data.Status != "no_content_available")
        .OrderByDescending(x => x.Score)
        .ToList();

    var best = candidates.FirstOrDefault(x => x.Score > 0);

    // No keyword matched anything in this category — don't guess, return null
    return best?.Id;
}

        public Guide BuildGuide(string categoryId, string description)
        {
            var situationId = FindBestSituationId(categoryId, description);

    if (situationId == null)
    {
        var fallbackContact = _contacts.TryGetValue(categoryId, out var cc) ? cc.CategoryContact : null;
        return new Guide
        {
            Kind = GuideKind.NoGuideFound,
            NoGuideMessage = "We couldn't confidently match this to a specific guide. Could you add a bit more detail, or reach out directly for help?",
            Contact = new EscalationContact
            {
                Role = fallbackContact ?? "your HRBP",
                When = "For help with this"
            }
        };
    }

    if (!_situations.TryGetValue(situationId, out var s) || s.Status == "no_content_available")
    {
        var fallbackContact = _contacts.TryGetValue(categoryId, out var c) ? c.CategoryContact : null;
        return new Guide
        {
            Kind = GuideKind.NoGuideFound,
            NoGuideMessage = "We don't have a guide for this yet.",
            Contact = new EscalationContact
            {
                Role = fallbackContact ?? "your HRBP",
                When = "For help with this right now"
            }
        };
    }

            return new Guide
            {
                Kind = GuideKind.Guide,
                Situation = description,
                FirstStep = s.Steps.FirstOrDefault() ?? "",
                PrepareSteps = s.Steps.Skip(1).ToList(),
                Documentation = s.Docs.Select(d => new ResourceLink { Title = d.Title, Url = d.File }).ToList(),
                Faqs = s.Faqs.Select(f => new Faq { Question = f.Q, Answer = f.A }).ToList(),
                LearningMaterials = s.Learning.Select(l => new LearningMaterial
                {
                    Title = l.Title,
                    Url = l.File,
                    Type = "Guide"
                }).ToList(),
                Contact = new EscalationContact
                {
                    Role = s.EscalationContact ?? "your HRBP",
                    When = "If you need more support"
                }
            };
        }
    }
}