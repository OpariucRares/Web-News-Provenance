using Newtonsoft.Json;

namespace WebNewsProvenance.Models
{
    public class LiteralValue
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }

        [JsonProperty("datatype")]
        public string Datatype { get; set; }
    }
}
