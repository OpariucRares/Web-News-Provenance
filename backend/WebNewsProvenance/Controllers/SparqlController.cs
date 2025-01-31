using Microsoft.AspNetCore.Mvc;
using WebNewsProvenance.Models;
using WebNewsProvenance.Services.Sparql.Contracts;


namespace WebNewsProvenance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SparqlController : ControllerBase
    {
        private readonly ISparqlService _sparqlService;

        public SparqlController(ISparqlService sparqlService)
        {
            _sparqlService = sparqlService;
        }

        //example query
        //        {
        //  "query": "PREFIX schema: <http://schema.org/> SELECT ?headline ?authorName ?datePublished ?language ?wordCount ?about ?mediaUrl ?mediaCaption ?mediaFormat ?publisherName ?publisherUrl WHERE { ?article a schema:CreativeWork ; schema:headline ?headline ; schema:author ?author ; schema:datePublished ?datePublished ; schema:inLanguage ?language ; schema:wordCount ?wordCount ; schema:about ?about ; schema:associatedMedia ?media ; schema:publisher ?publisher . ?author schema:name ?authorName . ?media schema:contentUrl ?mediaUrl ; schema:caption ?mediaCaption ; schema:encodingFormat ?mediaFormat . ?publisher schema:name ?publisherName ; schema:url ?publisherUrl . }"
        //}

        [HttpGet("test-sparql")]
        public IActionResult Get()
        {
            return Ok("SparqlController is working.");
        }
        [HttpGet("article-cards/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsPagination(int offset)
        {
            var response = await _sparqlService.GetAllArticlesCardPagination(offset);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }

        [HttpPost("article-cards-filters/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsFilteredPagination(int offset, [FromBody] Filter filters)
        {
            var response = await _sparqlService.GetAllArticlesCardFilterPagination(offset, filters);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }
        [HttpGet("article-cards-search/{offset:int}")]
        public async Task<IActionResult> GetAllArticleCardsSearchPagination(int offset, [FromQuery] string search)
        {
            var response = await _sparqlService.GetAllArticlesBySearchPagination(offset, search);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }
        [HttpGet("{articleId}")]
        public async Task<IActionResult> GetAllArticleCardsSearchPagination(string articleId)
        {
            var response = await _sparqlService.GetAnArticleById(articleId);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                if (response.StatusCode == StatusCodes.Status404NotFound)
                {
                    return NotFound(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }
        [HttpGet("recommended-articles/{category}")]
        public async Task<IActionResult> GetAllRecommendedArticlesCardPagination(string category)
        {
            var response = await _sparqlService.GetAllRecommendedArticlesCardPagination(category);
            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }

        [HttpPost("rdfa")]
        public async Task<IActionResult> PostRDFa([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            var response = await _sparqlService.ExecuteSparqlEndpointQueryAsync(request.Query, "rdfa");

            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }
            return Ok(response.Content);
        }

        [HttpPost("jsonld")]
        public async Task<IActionResult> PostJsonLd([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            var response = await _sparqlService.ExecuteSparqlEndpointQueryAsync(request.Query, "jsonld");

            if (response.StatusCode != StatusCodes.Status200OK)
            {
                if (response.StatusCode == StatusCodes.Status400BadRequest)
                {
                    return BadRequest(response.Message);
                }
                return StatusCode(StatusCodes.Status500InternalServerError, response.Message);
            }

            return Ok(response.Content);
        }
    }

}
