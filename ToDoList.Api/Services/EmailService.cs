using System.Net;
using System.Net.Mail;

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
            var appUrl = Environment.GetEnvironmentVariable("APP_URL") ?? _configuration["Email:AppUrl"];

            var confirmationUrl = $"{appUrl}/api/auth/confirm-email?token={token}";

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail!),
                Subject = "Confirme seu email - ToDoList",
                Body = $"Olá {name},\n\nClique no link abaixo para confirmar seu email:\n{confirmationUrl}\n\nEste link expira em 24 horas.",
                IsBodyHtml = false
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
