namespace Final_UI.Services
{
    public interface IRagService
    {
        Task<string> GetRelevantMealsContextAsync(string userMessage);
    }
}
