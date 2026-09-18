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
        public string Country { get; set; } = "Global";
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

    internal record ScenarioMeta(string Title, string Icon, string Description);

    public class SituationService
    {
        private readonly Dictionary<string, RawSituation> _situations;
        private readonly Dictionary<string, List<string>> _keywords;
        private readonly Dictionary<string, RawCategoryContacts> _contacts;

        public Dictionary<string, List<string>> Keywords => _keywords;

        private static readonly Dictionary<string, (string Icon, string Description, string DefaultSituation, string DefaultOutcome)> CategoryMeta = new()
        {
            ["Payroll"] = ("💰", "Pay, deposits, deductions, and payout timing.",
                "A team member has a payroll question — for example about their paycheck, hours, or an off-cycle payment.",
                "Get the employee an accurate, on-time resolution."),
            ["Benefits"] = ("🩺", "Medical, leave, retirement, and accommodation questions.",
                "An employee has a question about their benefits, leave, or an accommodation request.",
                "Point them to the right benefits process quickly."),
            ["Handbook & Policies"] = ("📘", "Company policy questions — attendance, conduct, and workplace rules.",
                "I need to understand a policy or handle an attendance or conduct situation.",
                "Apply the right policy consistently and fairly."),
            ["Talent & Development"] = ("🌱", "Coaching, performance conversations, and growth planning.",
                "I need to prepare for a coaching or development conversation with a team member.",
                "Walk in prepared and supportive."),
            ["Talent Services"] = ("🧭", "Onboarding, offboarding, and employee movement.",
                "I need to start an onboarding, offboarding, or employee movement request.",
                "Get the process started correctly the first time."),
        };

        private static readonly Dictionary<string, ScenarioMeta> ScenarioMetaById = new()
        {
            ["pay_discrepancy"] = new("Wrong pay amount", "💵", "A team member says their paycheck was short, wrong, or they didn't get paid this cycle."),
            ["final_pay"] = new("Employee leaving — final pay", "🧾", "An employee is leaving and needs their final pay and separation pay calculated."),
            ["ada_accommodation"] = new("Accommodation request", "♿", "An employee needs a workplace accommodation for a medical condition or disability."),
            ["leave_fmla"] = new("Leave of absence", "🌿", "An employee needs FMLA, parental leave, or short term disability leave."),
            ["benefits_enrollment"] = new("Benefits or plan question", "🏥", "An employee has a question about which medical plan, 401k, or benefit to choose."),
            ["coaching_low_performer"] = new("Coaching a low performer", "🎯", "A team member is underperforming, missing deadlines, or not meeting expectations."),
            ["goal_setting"] = new("Goal setting", "🗺️", "An employee needs help setting or updating performance and development goals."),
            ["team_conflict_or_change_discussion"] = new("Team conflict or change", "🤝", "There's tension on the team, or I need to talk through a change with them."),
            ["new_manager_first_30_days"] = new("New to managing", "🌟", "I just became a manager and need a first 30 days plan."),
            ["onboarding_new_hire"] = new("New hire starting soon", "👋", "A new hire is starting soon and I need to prepare onboarding."),
            ["offboarding_resignation"] = new("Employee resigned or is leaving", "🚪", "A team member resigned or is being separated and I need to start offboarding."),
            ["attendance_tardiness"] = new("Attendance or tardiness", "⏰", "A team member is frequently late or has an undertime issue."),
            ["no_call_no_show"] = new("No call, no show", "📵", "An employee stopped showing up and is unreachable."),
            ["flexible_work_request"] = new("Remote or hybrid request", "🏠", "An employee is asking about a remote or hybrid work arrangement."),
            ["employee_movement_report"] = new("Employee movement / salary change", "🔁", "A team member needs a salary inclusion or exclusion filed through UKG."),
            ["incentive_payment_request"] = new("Incentive or spot bonus request", "🌟", "You need to request an incentive payment or spot bonus for a team member."),
            ["code_of_conduct_concern"] = new("Possible code of conduct violation", "⚖️", "You suspect or were told about a possible policy or conduct violation."),
        };

        // A situation tagged "Global" is shown regardless of the manager's country filter;
        // otherwise it must match exactly. No filter means show everything.
        private static bool MatchesCountry(string situationCountry, string? filterCountry) =>
            string.IsNullOrEmpty(filterCountry)
            || situationCountry.Equals("Global", StringComparison.OrdinalIgnoreCase)
            || situationCountry.Equals(filterCountry, StringComparison.OrdinalIgnoreCase);

        public List<Category> GetCategories(string? country = null)
        {
            var result = new List<Category>();

            foreach (var (categoryName, meta) in CategoryMeta)
            {
                var situationsInCategory = _situations.Values
                    .Where(s => s.Category.Equals(categoryName, StringComparison.OrdinalIgnoreCase))
                    .Where(s => s.Status != "no_content_available")
                    .Where(s => MatchesCountry(s.Country, country))
                    .ToList();

                var docs = situationsInCategory
                    .SelectMany(s => s.Docs)
                    .GroupBy(d => d.Title)
                    .Select(g => new ResourceLink { Title = g.Key, Url = g.First().File })
                    .ToList();

                var faqs = situationsInCategory
                    .SelectMany(s => s.Faqs)
                    .GroupBy(f => f.Q)
                    .Select(g => new Faq { Question = g.Key, Answer = g.First().A })
                    .ToList();

                var learning = situationsInCategory
                    .SelectMany(s => s.Learning)
                    .GroupBy(l => l.Title)
                    .Select(g => new LearningMaterial { Title = g.Key, Url = g.First().File, Type = "Guide" })
                    .ToList();

                var contact = _contacts.TryGetValue(categoryName, out var c) ? c.CategoryContact : null;

                result.Add(new Category
                {
                    Id = categoryName,
                    Name = categoryName,
                    Icon = meta.Icon,
                    Description = meta.Description,
                    DefaultSituation = meta.DefaultSituation,
                    DefaultDesiredOutcome = meta.DefaultOutcome,
                    Documentation = docs,
                    Faqs = faqs,
                    LearningMaterials = learning,
                    Escalation = contact != null ? new EscalationContact { Role = contact, When = "If you need more support" } : null
                });
            }

            return result;
        }

        public List<Scenario> GetScenarios(string? country = null)
        {
            var result = new List<Scenario>();

            foreach (var (situationId, situation) in _situations)
            {
                if (!ScenarioMetaById.TryGetValue(situationId, out var meta))
                    continue;

                if (!MatchesCountry(situation.Country, country))
                    continue;

                result.Add(new Scenario
                {
                    Id = situationId,
                    Title = meta.Title,
                    Icon = meta.Icon,
                    Description = meta.Description,
                    CategoryId = situation.Category,
                    Country = situation.Country
                });
            }

            return result;
        }

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

public Guide BuildGuide(string categoryId, string description, List<string> scenarioIds)
{
    List<RawSituation> matched = new();

    if (scenarioIds != null && scenarioIds.Count > 0)
    {
        // Direct, exact lookup — no guessing, no keyword matching at all
        foreach (var id in scenarioIds)
        {
            if (_situations.TryGetValue(id, out var s) && s.Status != "no_content_available")
                matched.Add(s);
        }
    }
    else
    {
        // No checkbox selected — fall back to keyword matching on free text
        var situationId = FindBestSituationId(categoryId, description);
        if (situationId != null && _situations.TryGetValue(situationId, out var s) && s.Status != "no_content_available")
            matched.Add(s);
    }

    if (matched.Count == 0)
    {
        var fallbackContact = _contacts.TryGetValue(categoryId, out var cc) ? cc.CategoryContact : null;
        return new Guide
        {
            Kind = GuideKind.NoGuideFound,
            NoGuideMessage = scenarioIds?.Count > 0
                ? "We don't have a guide for this yet."
                : "We couldn't confidently match this to a specific guide. Could you add a bit more detail, or check one of the boxes above?",
            Contact = new EscalationContact { Role = fallbackContact ?? "your HRBP", When = "For help with this" }
        };
    }

    // Merge steps/docs/faqs/learning from every selected situation, de-duplicated
    var allSteps = matched.SelectMany(s => s.Steps).Distinct().ToList();
    var allDocs = matched.SelectMany(s => s.Docs).GroupBy(d => d.Title).Select(g => g.First()).ToList();
    var allFaqs = matched.SelectMany(s => s.Faqs).GroupBy(f => f.Q).Select(g => g.First()).ToList();
    var allLearning = matched.SelectMany(s => s.Learning).GroupBy(l => l.Title).Select(g => g.First()).ToList();
    var contact = matched.Select(s => s.EscalationContact).FirstOrDefault(c => c != null) ?? "your HRBP";

    return new Guide
    {
        Kind = GuideKind.Guide,
        Situation = description,
        FirstStep = allSteps.FirstOrDefault() ?? "",
        PrepareSteps = allSteps.Skip(1).ToList(),
        Documentation = allDocs.Select(d => new ResourceLink { Title = d.Title, Url = d.File }).ToList(),
        Faqs = allFaqs.Select(f => new Faq { Question = f.Q, Answer = f.A }).ToList(),
        LearningMaterials = allLearning.Select(l => new LearningMaterial { Title = l.Title, Url = l.File, Type = "Guide" }).ToList(),
        Contact = new EscalationContact { Role = contact, When = "If you need more support" }
    };
}
 }   // <-- closes "public class SituationService"
}  