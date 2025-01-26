using Newtonsoft.Json;

namespace WebNewsProvenance.Models
{
    public class Head
    {
        [JsonProperty("vars")]
        public List<string> Vars { get; set; }
    }
}