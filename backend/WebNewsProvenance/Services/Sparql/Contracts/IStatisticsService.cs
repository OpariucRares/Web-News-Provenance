using WebNewsProvenance.Models;

namespace WebNewsProvenance.Services.Sparql.Contracts
{
    public interface IStatisticsService
    {
        Task<SparqlResponse<List<string>>> GetAllDistinctLanguages();
        Task<SparqlResponse<int>> GetArticleCountByLanguage(string language);
        Task<SparqlResponse<List<string>>> GetAllDistinctCategories();
        Task<SparqlResponse<int>> GetArticleCountByCategory(string category);
        Task<SparqlResponse<List<string>>> GetAllDatesForLanguageArticles(string language);
    }
}
