using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Data;

/// <summary>
/// Placeholder content for the hackathon demo. Swap for real links into
/// approved HR resources (intranet, LMS, policy repository) before any pilot.
/// </summary>
public static class CategorySeedData
{
    public static List<Category> All { get; } = new()
    {
        new Category
        {
            Id = "payroll",
            Name = "Payroll",
            Icon = "💵",
            Description = "Pay cycles, timekeeping corrections, and how to route pay discrepancies.",
            DefaultSituation = "A team member has raised a payroll question — for example about their paycheck, hours, or an off-cycle payment.",
            DefaultDesiredOutcome = "Get this resolved correctly and know whether I need to loop in Payroll.",
            Documentation = new()
            {
                new ResourceLink { Title = "Payroll Calendar & Cutoff Dates", Url = "#" },
                new ResourceLink { Title = "Timekeeping Correction Process", Url = "#" },
                new ResourceLink { Title = "Off-Cycle Pay Request Guide", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "An employee says their paycheck is wrong. What do I do?", Answer = "Confirm the reported issue against the timekeeping system, then route to Payroll via the Off-Cycle Pay Request form. Do not promise a specific correction amount." },
                new Faq { Question = "Can I approve a retroactive pay change myself?", Answer = "No. Retroactive pay and comp changes require Payroll/Compensation sign-off. Escalate, don't decide." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Manager Basics: Reading a Pay Statement", Url = "#", Type = "Guide" },
                new LearningMaterial { Title = "Timekeeping System Walkthrough", Url = "#", Type = "Video" },
            },
            Escalation = new EscalationContact { Role = "Payroll Team", When = "Any pay discrepancy, off-cycle payment, or garnishment question." },
        },
        new Category
        {
            Id = "benefits",
            Name = "Benefits",
            Icon = "🩺",
            Description = "Enrollment windows, leave of absence basics, and where to send benefits questions.",
            DefaultSituation = "A team member has a benefits question — enrollment, a life event, or a leave of absence.",
            DefaultDesiredOutcome = "Point them to the right resource and know when Benefits needs to be involved.",
            Documentation = new()
            {
                new ResourceLink { Title = "Open Enrollment Overview", Url = "#" },
                new ResourceLink { Title = "Leave of Absence (LOA) Process Map", Url = "#" },
                new ResourceLink { Title = "Qualifying Life Event Changes", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "An employee wants to add a dependent mid-year. What do I tell them?", Answer = "Point them to the Qualifying Life Event process and the Benefits enrollment portal; changes outside open enrollment need a qualifying event on file." },
                new Faq { Question = "Someone is asking about FMLA. Can I explain their eligibility?", Answer = "No — leave eligibility determinations belong to Benefits/Leave Administration. Route the employee there directly." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Supporting an Employee on Leave", Url = "#", Type = "Course" },
                new LearningMaterial { Title = "Benefits 101 for New Managers", Url = "#", Type = "Guide" },
            },
            Escalation = new EscalationContact { Role = "Benefits Team", When = "Leave of absence, enrollment exceptions, or coverage disputes." },
        },
        new Category
        {
            Id = "talent-development",
            Name = "Talent & Development",
            Icon = "🌱",
            Description = "Coaching conversations, individual development plans (IDPs), and performance check-ins.",
            DefaultSituation = "I need to have a coaching or development conversation with someone on my team.",
            DefaultDesiredOutcome = "Walk in prepared, with the right framework, and a clear sense of what's coaching versus something bigger.",
            Documentation = new()
            {
                new ResourceLink { Title = "Individual Development Plan (IDP) Template", Url = "#" },
                new ResourceLink { Title = "Coaching Conversation Framework", Url = "#" },
                new ResourceLink { Title = "Performance Check-In Guide", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "How do I prep for a tough coaching conversation?", Answer = "Use the Coaching Conversation Framework to separate observed behavior from impact, and bring 2-3 specific examples. Manager Compass can help you structure talking points, not script the outcome." },
                new Faq { Question = "Is a development plan the same as a performance improvement plan (PIP)?", Answer = "No. An IDP is growth-oriented and manager-led. A formal PIP is a disciplinary tool and requires HRBP involvement." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Giving Feedback That Lands", Url = "#", Type = "Course" },
                new LearningMaterial { Title = "Writing a Strong IDP", Url = "#", Type = "Guide" },
                new LearningMaterial { Title = "Coaching vs. Discipline: Knowing the Line", Url = "#", Type = "Video" },
            },
            Escalation = new EscalationContact { Role = "HRBP", When = "Performance issues that may lead to a formal PIP, or any pattern of repeated concerns." },
        },
        new Category
        {
            Id = "handbook-policies",
            Name = "Handbook & Policies",
            Icon = "📘",
            Description = "Company policies, code of conduct, and how to look up an official policy answer.",
            DefaultSituation = "A policy question or possible violation has come up with someone on my team.",
            DefaultDesiredOutcome = "Understand the written policy and know when this needs to go to Employee Relations.",
            Documentation = new()
            {
                new ResourceLink { Title = "Employee Handbook (current version)", Url = "#" },
                new ResourceLink { Title = "Code of Conduct", Url = "#" },
                new ResourceLink { Title = "Attendance & Time-Off Policy", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "An employee is asking about a policy exception. Can I grant one?", Answer = "Managers can't grant policy exceptions on their own. Reference the written policy and escalate exception requests to HRBP." },
                new Faq { Question = "Where's the single source of truth for policy wording?", Answer = "Always link to the current Employee Handbook section rather than paraphrasing from memory — policy text changes." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Policy Lookup: How to Search the Handbook", Url = "#", Type = "Guide" },
            },
            Escalation = new EscalationContact { Role = "Employee Relations", When = "Suspected policy violation, conduct concern, or a request for a policy exception." },
        },
        new Category
        {
            Id = "compensation",
            Name = "Compensation",
            Icon = "📊",
            Description = "Pay bands, promotion readiness, and where comp questions need to be routed.",
            DefaultSituation = "A pay, promotion, or compensation question has come up with someone on my team.",
            DefaultDesiredOutcome = "Respond appropriately without overpromising, and know when Compensation needs to weigh in.",
            Documentation = new()
            {
                new ResourceLink { Title = "Compensation Philosophy Overview", Url = "#" },
                new ResourceLink { Title = "Promotion & Pay Change Request Process", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "An employee asked me directly what their raise will be. What do I say?", Answer = "Do not give a number or commitment. Explain that comp changes go through the formal review cycle and route specifics to Compensation." },
                new Faq { Question = "Can I tell an employee their pay band?", Answer = "Managers can reference published band ranges from Compensation's resources, but individual placement decisions are not a manager call." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Talking About Pay Without Overpromising", Url = "#", Type = "Guide" },
            },
            Escalation = new EscalationContact { Role = "Compensation Team", When = "Any pay change, band question, or promotion pay adjustment." },
        },
        new Category
        {
            Id = "talent-services",
            Name = "Talent Services",
            Icon = "🧑‍💼",
            Description = "Hiring, internal mobility, and org changes that need a Talent Services partner.",
            DefaultSituation = "Something's come up around hiring, an internal transfer, or onboarding on my team.",
            DefaultDesiredOutcome = "Know the right process and who to loop in.",
            Documentation = new()
            {
                new ResourceLink { Title = "Internal Mobility Guidelines", Url = "#" },
                new ResourceLink { Title = "Requisition & Hiring Process Overview", Url = "#" },
            },
            Faqs = new()
            {
                new Faq { Question = "An employee wants to transfer to another team. What's my role?", Answer = "Support the conversation and reference the Internal Mobility Guidelines, but the formal transfer process runs through Talent Services." },
                new Faq { Question = "Can I write my own job requisition?", Answer = "Draft the need, but requisition creation and approval routes through Talent Services." },
            },
            LearningMaterials = new()
            {
                new LearningMaterial { Title = "Supporting Internal Mobility Conversations", Url = "#", Type = "Guide" },
            },
            Escalation = new EscalationContact { Role = "Talent Services", When = "Open requisitions, internal transfers, or org structure changes." },
        },
    };
}
