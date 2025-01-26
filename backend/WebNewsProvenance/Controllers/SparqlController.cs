using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using WebNewsProvenance.Models;
using WebNewsProvenance.Services;

namespace WebNewsProvenance.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SparqlController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ICreativeWorkService _creativeWorkService;
        //example query
//        {
//  "query": "PREFIX schema: <http://schema.org/> SELECT ?headline ?authorName ?datePublished ?language ?wordCount ?about ?mediaUrl ?mediaCaption ?mediaFormat ?publisherName ?publisherUrl WHERE { ?article a schema:CreativeWork ; schema:headline ?headline ; schema:author ?author ; schema:datePublished ?datePublished ; schema:inLanguage ?language ; schema:wordCount ?wordCount ; schema:about ?about ; schema:associatedMedia ?media ; schema:publisher ?publisher . ?author schema:name ?authorName . ?media schema:contentUrl ?mediaUrl ; schema:caption ?mediaCaption ; schema:encodingFormat ?mediaFormat . ?publisher schema:name ?publisherName ; schema:url ?publisherUrl . }"
//}
        public SparqlController(HttpClient httpClient, ICreativeWorkService creativeWorkService)
        {
            _httpClient = httpClient;
            _creativeWorkService = creativeWorkService;
        }

        [HttpPost("query")]
        public async Task<IActionResult> PostSparqlQuery([FromBody] SparqlRequest request)
        {
            if (string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("The query field is required.");
            }
            var nameDataset = "test-bigger";
            var endpointUrl = $"http://localhost:3030/{nameDataset}/sparql"; 

            try
            {
                var content = new StringContent($"query={Uri.EscapeDataString(request.Query)}", System.Text.Encoding.UTF8, "application/x-www-form-urlencoded");

                // expects JSON response
                _httpClient.DefaultRequestHeaders.Accept.Clear();
                _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/sparql-results+json"));

                var response = await _httpClient.PostAsync(endpointUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    var resultJson = await response.Content.ReadAsStringAsync();

                    var sparqlResult = JsonConvert.DeserializeObject<SparqlResponse>(resultJson);

                    var creativeWorks = _creativeWorkService.MapToCreativeWorks(sparqlResult);

                    return Ok(creativeWorks);
                }

                var result = await response.Content.ReadAsStringAsync();
                return Content(result, "application/json");
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error querying SPARQL endpoint: {ex.Message}");
            }
        }
    }
}
