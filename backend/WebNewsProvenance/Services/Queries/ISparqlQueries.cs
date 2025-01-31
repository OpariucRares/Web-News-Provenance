using WebNewsProvenance.Models;

namespace WebNewsProvenance.Services.Queries
{
    public interface ISparqlQueries
    {
        string GetAllArticlesCardPagination(int limit, int offset);
        string GetAllArticlesCardFilterPagination(int limit, int offset, Filter filter);
        string GetAllArticlesBySearchPagination(int limit, int offset, string search);
        string GetAnArticleById(string id);
    }
}
