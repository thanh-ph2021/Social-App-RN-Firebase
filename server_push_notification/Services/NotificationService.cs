using Microsoft.Extensions.Options;
using SocialApp.IServices;
using SocialApp.Models;
using FirebaseAdmin.Messaging;

namespace SocialApp.Services
{
    public class NotificationService : INotificationService
    {
        public NotificationService()
        {

        }

        public async Task<ResponseModel> SendNotification(NotificationModel request)
        {

            ResponseModel response = new ResponseModel()
            {
                FailCount = 0,
                SuccessCount = 0,
            };

            string body = string.IsNullOrEmpty(request.Body) || request.Title == request.Body
                ? request.Title
                : request.Body;

            //Tạo nội dung cho message gửi đi
            var notification = new Notification
            {
                Body = body,
                Title = request.Title,
                ImageUrl = "https://images.unsplash.com/photo-1417325384643-aac51acc9e5d",
            };

            //Data cho message
            var data = new Dictionary<string, string>()
                {
                    { "id", request.Data.Id },
                    { "type", request.Data.Type },
                    { "id01", request.Data.Id01 },
                    { "id02", request.Data.Id02 },
                    { "imageUrl", request.Data.ImageUrl },
                };

            //Config cho ios
            var apns = new ApnsConfig
            {
                Aps = new Aps
                {
                    Sound = "default",

                },
                Headers = new Dictionary<string, string>() {
                    { "mutable-content", "1" }
                },

                //FcmOptions = new ApnsFcmOptions
                //{
                //    ImageUrl = request.ImageURL
                //},
            };

            //Config cho android
            var android = new AndroidConfig
            {
                Notification = new AndroidNotification
                {
                    Sound = "default",
                },
                Priority = Priority.High
            };

            var message = new Message
            {
                Android = android,
                Apns = apns,
                Notification = notification,
                Data = data,
            };

            foreach (var item in request.NotifyTokens)
            {
                try
                {
                    message.Token = item;
                    await FirebaseMessaging.DefaultInstance.SendAsync(message);
                    response.SuccessCount++;
                }
                catch (Exception e)
                {
                    response.FailCount++;
                    continue;
                }
            }

            return response;
        }
    }
}
