namespace WebNewsProvenance.Models
{
    public class Article
    {
        public string Id { get; set; } = "";
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
    }
}
