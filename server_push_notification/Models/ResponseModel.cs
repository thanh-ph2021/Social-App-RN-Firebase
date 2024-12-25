using Newtonsoft.Json;

namespace SocialApp.Models
{
    public class ResponseModel
    {
        [JsonProperty("successCount")]
        public int SuccessCount { get; set; }
        [JsonProperty("failureCount")]
        public int FailCount { get; set; }
    }
}
