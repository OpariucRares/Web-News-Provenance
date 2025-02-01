using Microsoft.Extensions.Options;
using System.Net;
using VDS.RDF.Query;
using WebNewsProvenance.Models;
using WebNewsProvenance.Services.Queries.Contracts;
using WebNewsProvenance.Services.Sparql.Contracts;

namespace WebNewsProvenance.Services.Sparql
{
    public class StatisticsService : IStatisticsService
    {
        private readonly string _fusekiEndpoint;
        private readonly AppSettings _appSettings;
        private readonly IStatisticsQueries _statisticsQueries;

        public StatisticsService(IOptions<AppSettings> options, IStatisticsQueries statisticsQueries)
        {
            _fusekiEndpoint = options.Value.FusekiEndpoint;
            _statisticsQueries = statisticsQueries;
        }

        public async Task<SparqlResponse<List<string>>> GetAllDistinctLanguages()
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_statisticsQueries.GetAllDistinctLanguages());

                HashSet<string> languages = new HashSet<string>();
                foreach (var result in results)
                {
                    var languageLiteral = result["language"].ToString();
                    var language = ExtractValue(languageLiteral);
                    languages.Add(language);
                }
                return new SparqlResponse<List<string>>
                {
                    Content = languages.ToList(),
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }

        public async Task<SparqlResponse<int>> GetArticleCountByLanguage(string language)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_statisticsQueries.GetArticleCountByLanguage(language));

                int countArticles = 0;
                foreach (var result in results)
                {
                    var articleCountLiteral = result["articleCount"].ToString();
                    countArticles = int.Parse(ExtractValue(articleCountLiteral));
                }
                return new SparqlResponse<int>
                {
                    Content = countArticles,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<int>
                {
                    Content = 0,
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<int>
                {
                    Content = 0,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError

                };
            }
        }
        public async Task<SparqlResponse<List<string>>> GetAllDistinctCategories()
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_statisticsQueries.GetAllDistinctCategories());

                HashSet<string> categories = new HashSet<string>();
                foreach (var result in results)
                {
                    var categoryLiteral = result["subject"].ToString();
                    var category = ExtractLocalName(categoryLiteral);
                    categories.Add(category);
                }
                return new SparqlResponse<List<string>>
                {
                    Content = categories.ToList(),
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError
                };
            }
        }

        public async Task<SparqlResponse<int>> GetArticleCountByCategory(string category)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                category = char.ToUpper(category[0]) + category.Substring(1).ToLower();
                SparqlResultSet results = endpoint.QueryWithResultSet(_statisticsQueries.GetArticleCountByCategory(category));

                int countArticles = 0;
                foreach (var result in results)
                {
                    var articleCountLiteral = result["articleCount"].ToString();
                    countArticles = int.Parse(ExtractValue(articleCountLiteral));
                }
                return new SparqlResponse<int>
                {
                    Content = countArticles,
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<int>
                {
                    Content = 0,
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<int>
                {
                    Content = 0,
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError

                };
            }
        }
        public async Task<SparqlResponse<List<string>>> GetAllDatesForLanguageArticles(string language)
        {
            try
            {
                SparqlRemoteEndpoint endpoint = new SparqlRemoteEndpoint(new Uri(_fusekiEndpoint));
                SparqlResultSet results = endpoint.QueryWithResultSet(_statisticsQueries.GetAllDatesForLanguageArticles(language));

                HashSet<string> dates = new HashSet<string>();
                foreach (var result in results)
                {
                    var articleCountLiteral = result["date"].ToString();
                    dates.Add(ExtractValue(articleCountLiteral));
                }
                return new SparqlResponse<List<string>>
                {
                    Content = dates.ToList(),
                    StatusCode = (int)HttpStatusCode.OK
                };
            }
            catch (RdfQueryException ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Invalid SPARQL query: {ex.InnerException}",
                    StatusCode = (int)HttpStatusCode.BadRequest
                };
            }
            catch (Exception ex)
            {
                return new SparqlResponse<List<string>>
                {
                    Content = [],
                    Message = $"Internal server error: {ex.Message}",
                    StatusCode = (int)HttpStatusCode.InternalServerError

                };
            }
        }


        private string ExtractValue(string languageLiteral)
        {
            int delimiterIndex = languageLiteral.IndexOf("^^");
            if (delimiterIndex >= 0)
            {
                return languageLiteral.Substring(0, delimiterIndex);
            }
            return languageLiteral;
        }
        private string ExtractLocalName(string uri)
        {
            if (uri.Contains("/"))
            {
                return uri.Substring(uri.LastIndexOf('/') + 1);
            }
            else if (uri.Contains("#"))
            {
                return uri.Substring(uri.LastIndexOf('#') + 1);
            }
            return uri;
        }
    }
}
