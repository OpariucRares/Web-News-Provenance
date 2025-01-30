using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using VDS.RDF;
using VDS.RDF.Query;
using VDS.RDF.Writing;
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
        private const string nameDataset = "dbpedia-ontology";
        private readonly string fusekiEndpoint = $"http://localhost:3030/{nameDataset}/sparql";

        //example query
        //        {
        //  "query": "PREFIX schema: <http://schema.org/> SELECT ?headline ?authorName ?datePublished ?language ?wordCount ?about ?mediaUrl ?mediaCaption ?mediaFormat ?publisherName ?publisherUrl WHERE { ?article a schema:CreativeWork ; schema:headline ?headline ; schema:author ?author ; schema:datePublished ?datePublished ; schema:inLanguage ?language ; schema:wordCount ?wordCount ; schema:about ?about ; schema:associatedMedia ?media ; schema:publisher ?publisher . ?author schema:name ?authorName . ?media schema:contentUrl ?mediaUrl ; schema:caption ?mediaCaption ; schema:encodingFormat ?mediaFormat . ?publisher schema:name ?publisherName ; schema:url ?publisherUrl . }"
        //}
        public SparqlController(HttpClient httpClient, ICreativeWorkService creativeWorkService)
        {
            _httpClient = httpClient;
            _creativeWorkService = creativeWorkService;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok("SparqlController is working.");
        }

        [HttpPost("query")]
        public async Task<IActionResult> PostSparqlQuery([FromBody] SparqlRequest request)
        {
            if (string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("The query field is required.");
            }
            //var nameDataset = "test-bigger";
            var nameDataset = "dbpedia-ontology";
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
                    var errorMessage = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, $"SPARQL endpoint error: {response.ReasonPhrase}. Details: {errorMessage}");
                }

                var resultJson = await response.Content.ReadAsStringAsync();

                SparqlResponse? sparqlResult;
                try
                {
                    sparqlResult = JsonConvert.DeserializeObject<SparqlResponse>(resultJson);
                }
                catch (JsonException)
                {
                    return StatusCode(500, "Error parsing the SPARQL response. The response format might not match the expected structure.");
                }

                var creativeWorks = _creativeWorkService.MapToCreativeWorks(sparqlResult);
                return Ok(creativeWorks);
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Error querying SPARQL endpoint: {ex.Message}");
            }
        }

        [HttpPost("rdfa")]
        public async Task<IActionResult> PostRDFa([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(request.Query);

                var rdfaBuilder = new System.Text.StringBuilder();

                rdfaBuilder.AppendLine("<!DOCTYPE html>");
                rdfaBuilder.AppendLine("<html lang=\"en\">");
                rdfaBuilder.AppendLine("<head>");
                rdfaBuilder.AppendLine("<meta charset=\"UTF-8\">");
                rdfaBuilder.AppendLine("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
                rdfaBuilder.AppendLine("<title>SPARQL RDFa Results</title>");
                rdfaBuilder.AppendLine("</head>");
                rdfaBuilder.AppendLine("<body>");
                rdfaBuilder.AppendLine("<div vocab=\"http://schema.org/\" typeof=\"CreativeWork\">");

                foreach (var result in results)
                {
                    rdfaBuilder.AppendLine("<div>");

                    foreach (var variable in results.Variables)
                    {
                        if (result.HasValue(variable))
                        {
                            string value = result[variable].ToString();
                            string property = $"property=\"{variable}\"";

                            if (Uri.IsWellFormedUriString(value, UriKind.Absolute))
                            {
                                rdfaBuilder.AppendLine($"<a {property} href=\"{value}\">{value}</a>");
                            }
                            else
                            {
                                // Check if it's a typed literal (e.g., ^^http://www.w3.org/2001/XMLSchema#dateTime)
                                if (value.Contains("^^"))
                                {
                                    string[] parts = value.Split(new[] { "^^" }, StringSplitOptions.None);
                                    string literalValue = parts[0];
                                    Uri datatype = new Uri(parts[1]);

                                    rdfaBuilder.AppendLine($"<span {property} datatype=\"{datatype}\">{literalValue}</span>");
                                }
                                else
                                {
                                    rdfaBuilder.AppendLine($"<span {property}>{value}</span>");
                                }
                            }
                        }
                    }

                    rdfaBuilder.AppendLine("</div>");
                }

                rdfaBuilder.AppendLine("</div>");
                rdfaBuilder.AppendLine("</body>");
                rdfaBuilder.AppendLine("</html>");

                string rdfaResult = rdfaBuilder.ToString();
                return Ok(rdfaResult);
            }
            catch (RdfQueryException ex)
            {
                return StatusCode(500, $"SPARQL query error: {ex.InnerException}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("jsonld")]
        public async Task<IActionResult> PostJsonLd([FromBody] SparqlRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.Query))
            {
                return BadRequest("Invalid SPARQL request.");
            }

            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(request.Query);

                var store = new TripleStore();
                var graph = new Graph();
                store.Add(graph);

                // Add known namespaces dynamically (can be extended based on your use case)
                var namespaceMap = graph.NamespaceMap;
                namespaceMap.AddNamespace("dcterms", new Uri("http://purl.org/dc/terms/"));
                namespaceMap.AddNamespace("schema", new Uri("http://schema.org/"));
                namespaceMap.AddNamespace("prov", new Uri("http://www.w3.org/ns/prov#"));
                namespaceMap.AddNamespace("skos", new Uri("http://www.w3.org/2004/02/skos/core#"));
                namespaceMap.AddNamespace("nepr", new Uri("http://example.org/nepr/"));
                namespaceMap.AddNamespace("rdfs", new Uri("http://www.w3.org/2000/01/rdf-schema#"));
                namespaceMap.AddNamespace("xsd", new Uri("http://www.w3.org/2001/XMLSchema#"));
                namespaceMap.AddNamespace("iptc", new Uri("http://iptc.org/std/"));
                namespaceMap.AddNamespace("sswt", new Uri("http://vocabulary.semantic-web.at/semweb#"));

                foreach (var result in results)
                {
                    //TODO: we need to define unique URIs for item
                    INode subject = graph.CreateBlankNode();

                    INode creativeWorkType = graph.CreateUriNode("schema:CreativeWork");
                    graph.Assert(subject, graph.CreateUriNode("rdf:type"), creativeWorkType);

                    foreach (var variable in results.Variables)
                    {
                        if (result.HasValue(variable))
                        {
                            string value = result[variable].ToString();
                            INode predicate;
                            INode obj;

                            if (Uri.IsWellFormedUriString(value, UriKind.Absolute))
                            {
                                Uri uri = new Uri(value);

                                string namespaceUri = $"{uri.Scheme}://{uri.Host}/";
                                if (!namespaceMap.HasNamespace(namespaceUri))
                                {
                                    namespaceMap.AddNamespace(uri.Host, new Uri(namespaceUri));
                                }

                                string prefix = namespaceMap.GetPrefix(new Uri(namespaceUri));
                                if (string.IsNullOrEmpty(prefix))
                                {
                                    prefix = uri.Host;
                                }

                                predicate = graph.CreateUriNode(new Uri($"{namespaceUri}{variable}"));
                                obj = graph.CreateUriNode(uri);
                            }
                            else
                            {
                                predicate = graph.CreateUriNode($"schema:{variable}");

                                // Check if it's a typed literal (e.g., ^^http://www.w3.org/2001/XMLSchema#dateTime)
                                if (value.Contains("^^"))
                                {
                                    string[] parts = value.Split(new[] { "^^" }, StringSplitOptions.None);
                                    string literalValue = parts[0];
                                    Uri datatype = new Uri(parts[1]);

                                    obj = graph.CreateLiteralNode(literalValue, datatype);
                                }
                                else
                                {
                                    obj = graph.CreateLiteralNode(value);
                                }
                            }
                            graph.Assert(subject, predicate, obj);
                        }
                    }
                }

                var writer = new JsonLdWriter();
                string jsonLdResult;
                using (var sw = new System.IO.StringWriter())
                {
                    writer.Save(store, sw);
                    jsonLdResult = sw.ToString();
                }
                return Ok(jsonLdResult);
            }
            catch (RdfQueryException ex)
            {
                return StatusCode(500, $"SPARQL query error: {ex.InnerException}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

}
