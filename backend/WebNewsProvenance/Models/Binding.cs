using Newtonsoft.Json;

namespace WebNewsProvenance.Models
{
    public class Binding
    {
        [JsonProperty("headline")]
        public LiteralValue Headline { get; set; }

        [JsonProperty("authorName")]
        public LiteralValue AuthorName { get; set; }

        [JsonProperty("datePublished")]
        public LiteralValue DatePublished { get; set; }

        [JsonProperty("language")]
        public LiteralValue Language { get; set; }

        [JsonProperty("wordCount")]
        public LiteralValue WordCount { get; set; }

        [JsonProperty("about")]
        public LiteralValue About { get; set; }

        [JsonProperty("mediaUrl")]
        public LiteralValue MediaUrl { get; set; }

        [JsonProperty("mediaCaption")]
        public LiteralValue MediaCaption { get; set; }

        [JsonProperty("mediaFormat")]
        public LiteralValue MediaFormat { get; set; }

        [JsonProperty("publisherName")]
        public LiteralValue PublisherName { get; set; }

        [JsonProperty("publisherUrl")]
        public LiteralValue PublisherUrl { get; set; }
    }
}
