using Newtonsoft.Json;

namespace SocialApp.Models
{
    public class NotificationModel
    {
        public class DataPayload
        {
            [JsonProperty("id")]

            // is userID, ...
            public string Id { get; set; }
            [JsonProperty("id01")]

            public string? Id01 { get; set; }
            [JsonProperty("id02")]

            public string? Id02 { get; set; }
            [JsonProperty("type")]
            public string Type { get; set; }
            [JsonProperty("imageUrl")]
            public string? ImageUrl { get; set; }
        }

        [JsonProperty("notifyTokens")]
        public List<string> NotifyTokens { get; set; }
        [JsonProperty("title")]
        public string Title { get; set; }
        [JsonProperty("body")]
        public string Body { get; set; }
        [JsonProperty("data")]
        public DataPayload Data { get; set; }
    }
}
