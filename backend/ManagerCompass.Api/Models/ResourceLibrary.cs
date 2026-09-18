namespace ManagerCompass.Api.Models;

/// <summary>
/// A folder or a file in the resource library tree. Folders have Children populated
/// and no Url/Extension; files have Url/Extension populated and no Children.
/// </summary>
public class ResourceNode
{
    public string Name { get; set; } = string.Empty;
    public bool IsFolder { get; set; }
    public string? Url { get; set; }
    public string? Extension { get; set; }
    public List<ResourceNode> Children { get; set; } = new();
}
