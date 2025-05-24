using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Final_UI.Models;

namespace Final_UI.Services
{
    public class OpenAiService : IOpenAiService
    {
        private readonly HttpClient _http;
        private readonly string _apiKey;
        private readonly string _model;

        public OpenAiService(IConfiguration configuration, HttpClient http)
        {
            _http = http;
            _apiKey = configuration["OpenAI:ApiKey"] ?? string.Empty;
            _model = configuration["OpenAI:Model"] ?? "gpt-4o";
        }

        public async Task<string> GetChatResponseAsync(string userMessage, string mealsContext, List<ChatMessage> history)
        {
            var systemPrompt =
                "You are a helpful meal planning assistant. " +
                "Use the available recipe context to make personalized suggestions. " +
                "Be concise, friendly, and practical.\n\n" +
                "Available recipes:\n" + mealsContext;

            var messages = new List<object>
            {
                new { role = "system", content = systemPrompt }
            };

            foreach (var msg in history)
            {
                messages.Add(new { role = msg.Role, content = msg.Content });
            }

            messages.Add(new { role = "user", content = userMessage });

            var requestBody = new
            {
                model = _model,
                messages,
                max_tokens = 600,
                temperature = 0.7
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _http.PostAsync("https://api.openai.com/v1/chat/completions", content);
            response.EnsureSuccessStatusCode();

            using var responseStream = await response.Content.ReadAsStreamAsync();
            using var document = await JsonDocument.ParseAsync(responseStream);

            return document.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString() ?? "Sorry, I could not generate a response.";
        }
    }
}
