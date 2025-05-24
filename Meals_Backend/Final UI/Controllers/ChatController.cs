using Microsoft.AspNetCore.Mvc;
using Final_UI.Models;
using Final_UI.Services;

namespace Final_UI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IRagService _ragService;
        private readonly IOpenAiService _openAiService;

        public ChatController(IRagService ragService, IOpenAiService openAiService)
        {
            _ragService = ragService;
            _openAiService = openAiService;
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message cannot be empty.");

            var context = await _ragService.GetRelevantMealsContextAsync(request.Message);
            var reply = await _openAiService.GetChatResponseAsync(request.Message, context, request.History);

            return Ok(new ChatResponse { Reply = reply });
        }
    }
}
