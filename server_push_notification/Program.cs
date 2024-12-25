using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using SocialApp.IServices;
using SocialApp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var service = builder.Services;

service.AddControllers();

// config firebase
FirebaseApp.Create(new AppOptions()
{
    Credential = GoogleCredential.GetApplicationDefault(),
});

service.AddTransient<INotificationService, NotificationService>();

service.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
});
// Configure the HTTP request pipeline.

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
