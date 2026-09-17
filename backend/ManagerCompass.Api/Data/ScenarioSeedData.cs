using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Data;

/// <summary>
/// Demo situations shown as browsable tiles. Each points back at one of the
/// six resource categories in <see cref="CategorySeedData"/>.
/// </summary>
public static class ScenarioSeedData
{
    public static List<Scenario> All { get; } = new()
    {
        new Scenario { Id = "pay-discrepancy", Title = "Pay Discrepancy Reported", Icon = "💵", Description = "An employee says their paycheck looks wrong.", CategoryId = "payroll" },
        new Scenario { Id = "off-cycle-pay", Title = "Off-Cycle Pay Request", Icon = "⏱️", Description = "You need to request an out-of-cycle payment for someone on your team.", CategoryId = "payroll" },

        new Scenario { Id = "employee-leave", Title = "Employee Requesting Leave", Icon = "🩺", Description = "A team member wants to take a leave of absence.", CategoryId = "benefits" },
        new Scenario { Id = "benefits-enrollment", Title = "Benefits Enrollment Question", Icon = "📝", Description = "Someone missed open enrollment or has a life-event change.", CategoryId = "benefits" },

        new Scenario { Id = "coaching-low-performer", Title = "Coaching a Low Performer", Icon = "🎯", Description = "You need to have a direct conversation about performance.", CategoryId = "talent-development" },
        new Scenario { Id = "development-plan", Title = "Building a Development Plan", Icon = "🌱", Description = "You want to put together an IDP with a team member.", CategoryId = "talent-development" },

        new Scenario { Id = "policy-exception", Title = "Policy Exception Request", Icon = "📘", Description = "An employee is asking for an exception to a written policy.", CategoryId = "handbook-policies" },
        new Scenario { Id = "attendance-concern", Title = "Attendance Concern", Icon = "🗓️", Description = "A team member has a pattern of unexplained absences.", CategoryId = "handbook-policies" },
        new Scenario { Id = "team-conflict", Title = "Team Conflict Between Members", Icon = "⚖️", Description = "Two people on your team are in conflict and it's affecting work.", CategoryId = "handbook-policies" },

        new Scenario { Id = "promotion-pay-change", Title = "Promotion & Pay Change", Icon = "📊", Description = "You want to request a promotion or pay adjustment for someone.", CategoryId = "compensation" },
        new Scenario { Id = "raise-question", Title = "Employee Asking About Raises", Icon = "💬", Description = "Someone is asking directly what their raise will be.", CategoryId = "compensation" },

        new Scenario { Id = "internal-transfer", Title = "Internal Transfer Request", Icon = "🔁", Description = "A team member wants to move to another team.", CategoryId = "talent-services" },
        new Scenario { Id = "open-requisition", Title = "Opening a New Requisition", Icon = "🧑‍💼", Description = "You need to hire for an open role on your team.", CategoryId = "talent-services" },
        new Scenario { Id = "new-hire-onboarding", Title = "New Hire Onboarding Support", Icon = "👋", Description = "You have a new team member starting and want to set them up well.", CategoryId = "talent-services" },
    };
}
