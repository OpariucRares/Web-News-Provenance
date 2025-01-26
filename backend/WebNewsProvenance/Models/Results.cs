using Newtonsoft.Json;

namespace WebNewsProvenance.Models
{
    public class Results
    {
        [JsonProperty("bindings")]
        public List<Binding> Bindings { get; set; }
    }
}
