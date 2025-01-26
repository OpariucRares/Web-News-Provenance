using Newtonsoft.Json;

namespace WebNewsProvenance.Models
{
    public class SparqlResponse
    {
        [JsonProperty("head")]
        public Head head { get; set; }

        [JsonProperty("results")]
        public Results Results { get; set; }
    }
}
