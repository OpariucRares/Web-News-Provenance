using System.Security.Cryptography.X509Certificates;
using VDS.RDF.Query;

namespace WebNewsProvenance.Models
{
    public class Article
    {
        public string Id { get; set; } = "";
        public string ArticleUrl { get; set; } = "";
        public string Headline { get; set; } = "";
        public string Creator { get; set; } = "";
        public string CreatorName { get; set; }="";
        public string Date { get; set; } = "";
        public string Language { get; set; } = "";
        public string ContentUrl { get; set; } = "";
        public string Image { get; set; } = "";
        public string Description { get; set; } = "";
        public string Author { get; set; } = "";
        public string AuthorName { get; set; }= "";
        public string WikidataUrl { get; set; } = "";
        public string Video { get; set; } = "";
        public string Subject { get; set; } = "";

        public Article()
        {
            
        }
        public Article(ISparqlResult? result)
        {
            ArticleUrl = result["article"].ToString();
            Id = ArticleUrl.Split('/').Last();
            Headline = result["headline"].ToString();
            Creator = result["creator"].ToString();
            Date = result["date"].ToString();
            Language = result["language"].ToString();
            Subject = result["subject"].ToString();
            ContentUrl = result["contentUrl"].ToString();
            Image = result["image"].ToString();
            Description = result["description"].ToString();
            Author = result["author"].ToString();
            AuthorName = result["authorName"].ToString();
            WikidataUrl = result["url"].ToString();
            Video = result["video"].ToString();
        }
    }
}
