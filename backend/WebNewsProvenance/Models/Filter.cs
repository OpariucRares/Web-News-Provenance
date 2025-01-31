namespace WebNewsProvenance.Models
{
    public class Filter
    {
        public string Language { get; set; } = "en";  // Default to English
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? HasImages { get; set; }
        public string? AuthorName { get; set; }
    }
}
