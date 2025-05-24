using Final_UI.Models;

namespace Final_UI.Services
{
    public interface IOpenAiService
    {
        Task<string> GetChatResponseAsync(string userMessage, string mealsContext, List<ChatMessage> history);
    }
}
