using WebNewsProvenance.Services.Queries.Contracts;

namespace WebNewsProvenance.Services.Queries
{
    public class StatisticsQueries : IStatisticsQueries
    {
        public string GetAllNamespacesQuery { get; } = @"
        PREFIX dcterms: <http://purl.org/dc/terms/>
        PREFIX schema: <http://schema.org/>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX nepr: <https://opariucrares.github.io/Web-News-Provenance/article/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX iptc: <http://iptc.org/std/>
        PREFIX sswt: <http://vocabulary.semantic-web.at/semweb#>    
        ";

        public string GetAllDistinctLanguages()
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT DISTINCT ?language
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:language ?language .
            }}";
        }
        public string GetArticleCountByLanguage(string language)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT (COUNT(?article) AS ?articleCount)
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:language '{language}' .
            }}";
        }
        public string GetAllDistinctCategories()
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT DISTINCT ?subject
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:subject ?subject .
            }}
            ";
        }
        public string GetArticleCountByCategory(string category)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT (COUNT(?article) AS ?articleCount)
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:subject iptc:{category} .
            }}";
        }
        public string GetAllDatesForLanguageArticles(string language)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT DISTINCT ?date
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:language '{language}' ;
                         dcterms:date ?date .
            }}
            ORDER BY DESC(?date)
            ";
        }

        public string GetAllDatesForCategoryArticles(string category)
        {
            return $@"
            {GetAllNamespacesQuery}
            SELECT DISTINCT ?date
            WHERE {{
                ?article a nepr:Article ;
                         dcterms:subject iptc:{category} ;
                         dcterms:date ?date .
            }}
            ORDER BY DESC(?date)
            ";
        }
    }
}
