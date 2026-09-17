using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services
{
    public class GuardrailService
    {
        private readonly SituationService _situationService;

        public GuardrailService(SituationService situationService)
        {
            _situationService = situationService;
        }

        public Guide? CheckHighRisk(string description)
        {
            if (string.IsNullOrWhiteSpace(description))
                return null;

            var riskWords = _situationService.Keywords.TryGetValue("sensitive_issue_escalation", out var kws)
                ? kws
                : new List<string>();

            var lowered = description.ToLowerInvariant();
            var isRisky = riskWords.Any(w => lowered.Contains(w.ToLowerInvariant()));

            if (!isRisky) return null;

            return new Guide
            {
                Kind = GuideKind.Escalate,
                EscalationMessage = "This should go to Employee Relations rather than a self-serve guide. " +
                                     "Please contact your HRBP directly, or Employee Relations if this is urgent."
            };
        }
    }
}