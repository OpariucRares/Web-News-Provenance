using WebNewsProvenance.Models;

namespace WebNewsProvenance.Services.Sparql
{
    public interface ISparqlService
    {
        Task<SparqlResponse<string>> ExecuteSparqlEndpointQueryAsync(string query, string format);
        Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesCardPagination(int offset);
        Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesCardFilterPagination(int offset, Filter filter);
        Task<SparqlResponse<List<ArticleCard>>> GetAllArticlesBySearchPagination(int offset, string search);
        Task<SparqlResponse<Article>> GetAnArticleById(string encodedArticleId);

    }
}
