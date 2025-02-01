using Microsoft.Extensions.Options;
using System.Net;
using System.Text;
using System.Web;
using VDS.RDF;
using VDS.RDF.Query;
using VDS.RDF.Writing;
using WebNewsProvenance.Models;
using WebNewsProvenance.Services.Queries.Contracts;
using WebNewsProvenance.Services.Sparql.Contracts;

namespace WebNewsProvenance.Services.Sparql
{
    public class SparqlService : ISparqlService
    {
        private readonly string _fusekiEndpoint;
        private readonly ISparqlQueries _sparqlQueries;
        private const int DefaultLimit = 10;
        public SparqlService(IOptions<AppSettings> options, ISparqlQueries sparqlQueries)
        {
            _fusekiEndpoint = options.Value.FusekiEndpoint;
            _sparqlQueries = sparqlQueries;
        }
        public async Task<SparqlResponse<string>> ExecuteSparqlEndpointQueryAsync(string query, string format)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(query);

                if (format != "rdfa" && format != "jsonld")
                {
                    throw new NotSupportedException("Unsupported format");
                }

                string content = format == "rdfa" ? GenerateRdfa(results) : GenerateJsonLd(results);
                return new SparqlResponse<string>
                {
                    Content = content,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<string>
                {
                    Content = "",
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            //see if we need this exception
            catch (NotSupportedException)
            {
                return new SparqlResponse<string>
                {
                    Content = "",
                    Message = "The format must be jsonld or rdf.",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<string>
                {
                    Content = "",
                    Message = $"Internal server error: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        public async Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesCardPagination(int offset)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_sparqlQueries.GetAllArticlesCardPagination(DefaultLimit, offset));

                List<ArticleCard> articleCards = [];
                foreach (var result in results)
                {
                    articleCards.Add(new ArticleCard(result));
                }
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = articleCards,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        public async Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesCardFilterPagination(int offset, Models.Filter filter)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                Console.WriteLine(_sparqlQueries.GetAllArticlesCardFilterPagination(DefaultLimit, offset, filter));
                SparqlResultSet results = endpoint.QueryWithResultSet(_sparqlQueries.GetAllArticlesCardFilterPagination(DefaultLimit, offset, filter));

                List<ArticleCard> articleCards = [];
                foreach (var result in results)
                {
                    articleCards.Add(new ArticleCard(result));
                }
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = articleCards,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        public async Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesBySearchPagination(int offset, string search)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_sparqlQueries.GetAllArticlesBySearchPagination(DefaultLimit, offset, search));

                List<ArticleCard> articleCards = [];
                foreach (var result in results)
                {
                    articleCards.Add(new ArticleCard(result));
                }
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = articleCards,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        public async Task<SparqlResponse<Article>> GetAnArticleById(string articleId)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_sparqlQueries.GetAnArticleById(articleId));

                if (results.Count == 0)
                {
                    return new SparqlResponse<Article>
                    {
                        Content = new Article(),
                        Message = "No article found",
                        StatusCode = (int)HttpStatusCode.NotFound
                    };
                }

                Article article = new Article();
                foreach (var result in results)
                {
                    article = new Article(result);
                    break;
                }
                return new SparqlResponse<Article>
                {
                    Content = article,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<Article>
                {
                    Content = new Article(),
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<Article>
                {
                    Content = new Article(),
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        public async Task<SparqlResponse<List<ArticleCard>>> GetAllRecommendedArticlesCardPagination(string category)
        {
            try
            {
                int limit = 5;
                category = char.ToUpper(category[0]) + category.Substring(1).ToLower();

                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_sparqlQueries.GetRecommendedArticlesCardPagination(category, limit));

                List<ArticleCard> articleCards = [];
                foreach (var result in results)
                {
                    articleCards.Add(new ArticleCard(result));
                }
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = articleCards,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<ArticleCard>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }
        private string GenerateRdfa(SparqlResultSet results)
        {
            var rdfaBuilder = new StringBuilder();

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

            return rdfaBuilder.ToString();
        }
        private string GenerateJsonLd(SparqlResultSet results)
        {
            var store = new TripleStore();
            var graph = new Graph();
            store.Add(graph);

            // Add namespaces
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
                if (result.HasValue("article"))
                {
                    INode article = graph.CreateUriNode(new Uri(result["article"].ToString()));
                    INode creativeWorkType = graph.CreateUriNode("schema:CreativeWork");
                    graph.Assert(article, graph.CreateUriNode("rdf:type"), creativeWorkType);

                    foreach (var variable in results.Variables)
                    {
                        if (variable != "article" && result.HasValue(variable))
                        {
                            string value = result[variable].ToString();
                            INode predicate;
                            INode obj;

                            if (Uri.IsWellFormedUriString(value, UriKind.Absolute))
                            {
                                Uri uri = new Uri(value);
                                string namespaceUri = $"{uri.Scheme}://{uri.Host}/";
                                if (!namespaceMap.HasNamespace(uri.Host))
                                {
                                    namespaceMap.AddNamespace(uri.Host, new Uri(namespaceUri));
                                }

                                predicate = graph.CreateUriNode(new Uri($"http://{uri.Host}/{variable}"));
                                obj = graph.CreateUriNode(uri);
                            }
                            else
                            {
                                predicate = graph.CreateUriNode($"schema:{variable}");

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

                            graph.Assert(article, predicate, obj);
                        }
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

            return jsonLdResult;
        }
    }
}
