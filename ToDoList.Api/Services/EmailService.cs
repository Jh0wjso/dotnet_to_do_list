using System.Net;
using System.Net.Mail;
using System.Web;

namespace ToDoList.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailConfirmationAsync(string email, string name, string token)
        {
            var smtpHost = _configuration["Email:SmtpHost"];
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUser = Environment.GetEnvironmentVariable("GMAIL_USER") ?? _configuration["Email:SmtpUser"];
            var smtpPass = Environment.GetEnvironmentVariable("GMAIL_APP_PASSWORD") ?? _configuration["Email:SmtpPass"];
            var fromEmail = Environment.GetEnvironmentVariable("GMAIL_USER") ?? _configuration["Email:FromEmail"];
            var apiUrl = Environment.GetEnvironmentVariable("API_URL") ?? _configuration["Email:ApiUrl"];

            var confirmationUrl = $"{apiUrl}/api/auth/confirm-email?token={Uri.EscapeDataString(token)}";

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var body = $@"
                Hello {name},

                Thank you for creating your account on ToDoList!

                To activate your account, confirm your email address by clicking the link below:
                {confirmationUrl}

                For security reasons, this link expires in 24 hours.

                If you did not request this registration, you can ignore this message.

                Best regards,
                ToDoList Team
            "; 

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail!),
                Subject = "Confirm your email — ToDoList",
                Body = body.Trim(),
                IsBodyHtml = false
            };


            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
