using System.Text.RegularExpressions;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

/// <summary>
/// The guide-writer: organizes and presents category content that has already
/// been retrieved (<see cref="Category"/>) for the manager's situation. It never
/// decides HR policy and never invents a step, document, or contact.
///
/// The risk_flag keyword scan is a hard gate that runs before anything else —
/// it is enforced here in code, not left to whatever formats the output, so a
/// sensitive situation can never accidentally surface a self-serve guide.
/// </summary>
public class GuideService : IGuideService
{
    // Deliberately narrow and conservative: these are situations where the right move is
    // "stop and hand this to a human right now," not "here is a self-serve guide."
    private static readonly string[] UrgentEscalationKeywords =
    {
        "harass", "discriminat", "assault", "abuse", "violence", "weapon",
        "suicide", "self-harm", "self harm", "terminat", "fire her", "fire him",
        "lawsuit", "legal action", "sue us", "retaliat", "hostile work environment",
        "threat",
    };

    private readonly ICategoryService _categoryService;

    public GuideService(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    public Guide? BuildGuide(GuideRequest request)
    {
        var category = _categoryService.GetById(request.CategoryId);
        if (category is null)
        {
            return null;
        }

        var situation = request.Situation?.Trim() ?? string.Empty;
        var riskFlag = ContainsUrgentEscalationSignal(situation);

        if (riskFlag)
        {
            // risk_flag is true: retrieved_content is ignored entirely. No steps, no documents.
            return new Guide
            {
                Kind = GuideKind.Escalate,
                EscalationMessage = "This goes to Employee Relations, not a self-serve guide. Contact them right away. Don't investigate, promise an outcome, or discuss it further yourself.",
                Contact = new EscalationContact { Role = "Employee Relations", When = "Immediately." },
            };
        }

        var steps = BuildSteps(category);
        var hasAnyContent = category.Documentation.Count > 0
            || category.Faqs.Count > 0
            || category.LearningMaterials.Count > 0
            || category.Escalation is not null
            || steps.Count > 0;

        if (!hasAnyContent)
        {
            return new Guide
            {
                Kind = GuideKind.NoGuideFound,
                NoGuideMessage = $"There's no guide for this yet under {category.Name}.",
                Contact = category.Escalation,
            };
        }

        return new Guide
        {
            Kind = GuideKind.Guide,
            Situation = ReflectSituation(situation),
            FirstStep = steps.Count > 0 ? steps[0] : $"Talk to {category.Escalation?.Role ?? "HR"} before doing anything else.",
            PrepareSteps = steps,
            Documentation = category.Documentation,
            Faqs = SelectRelevantFaqs(category.Faqs, situation),
            LearningMaterials = category.LearningMaterials,
            Contact = category.Escalation,
        };
    }

    private static List<string> BuildSteps(Category category) => new()
    {
        "Separate what you've directly observed from assumptions — write down the specific, factual details.",
        $"Check {category.Name}'s approved documentation below before you say anything definitive to your team member.",
        "Compare your situation against the escalation guidance below — if it matches, loop in the right team before committing to an outcome.",
        "Document what was discussed and any next steps, even if the conversation was informal.",
    };

    private static bool ContainsUrgentEscalationSignal(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        var lowered = text.ToLowerInvariant();
        return UrgentEscalationKeywords.Any(keyword => lowered.Contains(keyword));
    }

    /// <summary>Cleans up the manager's own words rather than inventing a paraphrase.</summary>
    private static string ReflectSituation(string situation)
    {
        if (string.IsNullOrWhiteSpace(situation))
        {
            return situation;
        }

        var trimmed = situation.Trim();
        var capitalized = char.ToUpperInvariant(trimmed[0]) + trimmed[1..];
        return Regex.IsMatch(capitalized, @"[.!?]$") ? capitalized : capitalized + ".";
    }

    private static List<Faq> SelectRelevantFaqs(List<Faq> faqs, string situation)
    {
        var keywords = ExtractKeywords(situation);
        if (keywords.Count == 0)
        {
            return faqs;
        }

        var matches = faqs
            .Where(faq => keywords.Any(keyword =>
                faq.Question.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                faq.Answer.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return matches.Count > 0 ? matches : faqs;
    }

    private static List<string> ExtractKeywords(string text) =>
        Regex.Matches(text, @"[a-zA-Z]{4,}")
            .Select(m => m.Value)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
}
