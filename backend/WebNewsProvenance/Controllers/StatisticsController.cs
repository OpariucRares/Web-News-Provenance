using Microsoft.AspNetCore.Mvc;
using WebNewsProvenance.Services.Sparql.Contracts;

namespace WebNewsProvenance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatisticsController : ControllerBase
    {
        public IStatisticsService _statisticsService;
        public StatisticsController(IStatisticsService statisticsService)
        {
            _statisticsService = statisticsService;
        }
        [HttpGet("test-statistics")]
        public IActionResult Get()
        {
            return Ok("Statistics is working.");
        }
        [HttpGet("languages")]
        public async Task<IActionResult> GetAllDistinctLanguages()
        {
            var response = await _statisticsService.GetAllDistinctLanguages();
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("article-count-languages/{language}")]
        public async Task<IActionResult> GetArticleCountByLanguage(string language)
        {
            var response = await _statisticsService.GetArticleCountByLanguage(language);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("categories")]
        public async Task<IActionResult> GetAllDistinctCategories()
        {
            var response = await _statisticsService.GetAllDistinctCategories();
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("article-count-category/{category}")]
        public async Task<IActionResult> GetArticleCountByCategory(string category)
        {
            var response = await _statisticsService.GetArticleCountByCategory(category);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
        [HttpGet("dates-language-articles/{language}")]
        public async Task<IActionResult> GetAllDatesForLanguageArticles(string language)
        {
            var response = await _statisticsService.GetAllDatesForLanguageArticles(language);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response);
            }
            return Ok(response);
        }
    }
}
