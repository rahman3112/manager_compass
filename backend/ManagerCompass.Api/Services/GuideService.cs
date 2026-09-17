using System.Text.RegularExpressions;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public class GuideService : IGuideService
{
    private const string GuardrailNoteText =
        "Manager Compass points you to approved resources and a suggested structure. " +
        "It does not give legal advice, make pay or disciplinary decisions, or set new policy — those calls stay with HR.";

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

        if (ContainsUrgentEscalationSignal(situation) || ContainsUrgentEscalationSignal(request.DesiredOutcome ?? string.Empty))
        {
            return new Guide
            {
                Title = "This needs to go to a human — now",
                IsUrgentEscalation = true,
                SituationSummary = situation,
                DesiredOutcome = request.DesiredOutcome,
                Steps = new List<string>
                {
                    "Stop — don't investigate, promise an outcome, or discuss this further with anyone involved yourself.",
                    "Contact Employee Relations (or your HRBP) right away and describe only what you directly observed or were told.",
                    "Write down the facts as you know them so far, kept factual and free of assumptions, in case they're needed later.",
                },
                RecommendedDocumentation = new List<ResourceLink>(),
                RelevantFaqs = new List<Faq>(),
                LearningMaterials = new List<LearningMaterial>(),
                Escalation = new EscalationContact
                {
                    Role = "Employee Relations",
                    When = "Immediately — this description matches a category Manager Compass always routes to a person, not a self-serve guide.",
                },
                GuardrailNote = GuardrailNoteText,
            };
        }

        var relevantFaqs = SelectRelevantFaqs(category.Faqs, situation, request.DesiredOutcome);

        return new Guide
        {
            Title = $"Guide: {category.Name} — {Truncate(situation, 60)}",
            IsUrgentEscalation = false,
            SituationSummary = situation,
            DesiredOutcome = request.DesiredOutcome,
            Steps = new List<string>
            {
                "Separate what you've directly observed from assumptions — write down the specific, factual details.",
                $"Check {category.Name}'s approved documentation below before you say anything definitive to your team member.",
                "Compare your situation against the escalation guidance below — if it matches, loop in the right team before committing to an outcome.",
                "Document what was discussed and any next steps, even if the conversation was informal.",
            },
            RecommendedDocumentation = category.Documentation.Take(3).ToList(),
            RelevantFaqs = relevantFaqs,
            LearningMaterials = category.LearningMaterials,
            Escalation = category.Escalation,
            GuardrailNote = GuardrailNoteText,
        };
    }

    private static bool ContainsUrgentEscalationSignal(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return false;
        }

        var lowered = text.ToLowerInvariant();
        return UrgentEscalationKeywords.Any(keyword => lowered.Contains(keyword));
    }

    private static List<Faq> SelectRelevantFaqs(List<Faq> faqs, string situation, string? desiredOutcome)
    {
        var keywords = ExtractKeywords($"{situation} {desiredOutcome}");
        if (keywords.Count == 0)
        {
            return faqs.Take(3).ToList();
        }

        var matches = faqs
            .Where(faq => keywords.Any(keyword =>
                faq.Question.Contains(keyword, StringComparison.OrdinalIgnoreCase) ||
                faq.Answer.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return matches.Count > 0 ? matches : faqs.Take(3).ToList();
    }

    private static List<string> ExtractKeywords(string text) =>
        Regex.Matches(text, @"[a-zA-Z]{4,}")
            .Select(m => m.Value)
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

    private static string Truncate(string text, int maxLength)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return "your situation";
        }

        return text.Length <= maxLength ? text : text[..maxLength].TrimEnd() + "…";
    }
}
