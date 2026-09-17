using ManagerCompass.Api.Models;

namespace ManagerCompass.Api.Services;

public interface IGuideService
{
    /// <returns>null when the category id does not match a known category.</returns>
    Guide? BuildGuide(GuideRequest request);
}
