namespace WebNewsProvenance.Models
{
    public class Filter
    {
        public string Language { get; set; } = "en";
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? HasImages { get; set; }
        public string? AuthorName { get; set; }
        public string? Subject { get; set; }
    }
}
