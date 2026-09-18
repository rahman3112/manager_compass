using System.Text;
using System.Text.RegularExpressions;
using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

/// <summary>
/// Scans the real source documents under Assets/raw and organizes them into a
/// browsable folder tree. Only the original numbered category folders are included —
/// the flat "clean-name" copies kept alongside them exist purely so situations.json
/// has stable link targets, and would otherwise show every file twice.
/// </summary>
public class ResourceLibraryService
{
    private static readonly (string Folder, string DisplayName)[] IncludedFolders =
    {
        ("06_Handbook and Policies", "Handbook & Policies"),
        ("07_Training and Development", "Training & Development"),
        ("08_Employee Relations and Guardrails", "Employee Relations & Guardrails"),
        ("09_Talent Services and Intake Routing", "Talent Services & Intake Routing"),
    };

    private readonly List<ResourceNode> _tree;

    public ResourceLibraryService(IWebHostEnvironment env)
    {
        var rawRoot = Path.Combine(env.ContentRootPath, "Assets", "raw");
        _tree = BuildTree(rawRoot);
    }

    public List<ResourceNode> GetTree() => _tree;

    private static List<ResourceNode> BuildTree(string rawRoot)
    {
        var roots = new List<ResourceNode>();

        foreach (var (folder, displayName) in IncludedFolders)
        {
            var folderPath = Path.Combine(rawRoot, folder);
            if (!Directory.Exists(folderPath))
            {
                continue;
            }

            var node = new ResourceNode { Name = displayName, IsFolder = true };
            PopulateChildren(rawRoot, folderPath, node);

            if (node.Children.Count > 0)
            {
                roots.Add(node);
            }
        }

        return roots;
    }

    private static void PopulateChildren(string rawRoot, string dirPath, ResourceNode parent)
    {
        var subDirs = Directory.GetDirectories(dirPath)
            .OrderBy(Path.GetFileName, StringComparer.OrdinalIgnoreCase);

        foreach (var subDir in subDirs)
        {
            var subNode = new ResourceNode { Name = CleanTitle(Path.GetFileName(subDir) ?? ""), IsFolder = true };
            PopulateChildren(rawRoot, subDir, subNode);

            if (subNode.Children.Count > 0)
            {
                parent.Children.Add(subNode);
            }
        }

        var files = Directory.GetFiles(dirPath)
            .OrderBy(Path.GetFileNameWithoutExtension, StringComparer.OrdinalIgnoreCase);

        foreach (var file in files)
        {
            parent.Children.Add(ToFileNode(rawRoot, file));
        }
    }

    private static ResourceNode ToFileNode(string rawRoot, string filePath)
    {
        var relativeToRaw = Path.GetRelativePath(rawRoot, filePath).Replace('\\', '/');
        var url = "/assets/raw/" + string.Join('/', relativeToRaw.Split('/').Select(Uri.EscapeDataString));

        return new ResourceNode
        {
            Name = CleanTitle(Path.GetFileNameWithoutExtension(filePath)),
            IsFolder = false,
            Url = url,
            Extension = Path.GetExtension(filePath).TrimStart('.').ToUpperInvariant(),
        };
    }

    private static string CleanTitle(string name)
    {
        var repaired = RepairMojibake(name);
        var withoutTrailingBrackets = Regex.Replace(repaired, @"(\s*\[[^\]]*\])+$", "");
        return Regex.Replace(withoutTrailingBrackets, @"\s+", " ").Trim();
    }

    // Windows-1252 codepoints outside the ASCII/Latin-1-identity range (0x80-0x9F).
    private static readonly Dictionary<char, byte> Cp1252HighRange = new()
    {
        ['€'] = 0x80, ['‚'] = 0x82, ['ƒ'] = 0x83, ['„'] = 0x84, ['…'] = 0x85,
        ['†'] = 0x86, ['‡'] = 0x87, ['ˆ'] = 0x88, ['‰'] = 0x89, ['Š'] = 0x8A,
        ['‹'] = 0x8B, ['Œ'] = 0x8C, ['Ž'] = 0x8E, ['‘'] = 0x91, ['’'] = 0x92,
        ['“'] = 0x93, ['”'] = 0x94, ['•'] = 0x95, ['–'] = 0x96, ['—'] = 0x97,
        ['˜'] = 0x98, ['™'] = 0x99, ['š'] = 0x9A, ['›'] = 0x9B, ['œ'] = 0x9C,
        ['ž'] = 0x9E, ['Ÿ'] = 0x9F,
    };

    /// <summary>
    /// Some source filenames have UTF-8 bytes that got written through a Windows-1252
    /// (mis)interpretation at some earlier point (e.g. an en dash "–" became "â€“").
    /// Reverses that specific corruption for display; leaves already-clean names as-is.
    /// </summary>
    private static string RepairMojibake(string text)
    {
        try
        {
            var bytes = new byte[text.Length];
            for (var i = 0; i < text.Length; i++)
            {
                var ch = text[i];
                if (ch < 0x80 || (ch >= 0xA0 && ch <= 0xFF))
                {
                    bytes[i] = (byte)ch;
                }
                else if (Cp1252HighRange.TryGetValue(ch, out var b))
                {
                    bytes[i] = b;
                }
                else
                {
                    return text;
                }
            }

            var repaired = Encoding.UTF8.GetString(bytes);
            return repaired.Contains('�') ? text : repaired;
        }
        catch
        {
            return text;
        }
    }
}
