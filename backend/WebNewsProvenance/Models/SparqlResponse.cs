namespace WebNewsProvenance.Models
{
    public class SparqlResponse<T>
    {
        public required T Content { get; set; }
        public string Message { get; set; } = "";
        public int StatusCode { get; set; }
    }
}
