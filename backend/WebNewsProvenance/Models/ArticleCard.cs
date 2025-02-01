using VDS.RDF.Query;

namespace WebNewsProvenance.Models
{
    public class ArticleCard
    {
        public string Id { get; set; } = "";
        public string ArticleUrl { get; set; } = "";
        public string Headline { get; set; } = "";
        public string Description { get; set; } = "";
        public string Image { get; set; } = "";
        public ArticleCard()
        {
            
        }
        public ArticleCard(ISparqlResult? result)
        {
            ArticleUrl = result["article"].ToString();
            Id = ArticleUrl.Split('/').Last();
            Headline = result["headline"].ToString();
            Description = result["description"].ToString();
            Image = result["image"].ToString();
        }
    }
}
