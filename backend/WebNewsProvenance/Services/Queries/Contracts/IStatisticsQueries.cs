namespace WebNewsProvenance.Services.Queries.Contracts
{
    public interface IStatisticsQueries
    {
        string GetAllDistinctLanguages();
        string GetArticleCountByLanguage(string language);
        string GetAllDistinctCategories();
        string GetArticleCountByCategory(string category);
        string GetAllDatesForLanguageArticles(string language);
        string GetAllDatesForCategoryArticles(string category);
    }
}
