using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using ToDoList.Api.Data;

namespace ToDoList.Api.Services
{
    public class EmailConfirmationService : IEmailConfirmationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public EmailConfirmationService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task<string> GenerateConfirmationTokenAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) throw new Exception("User not found");

            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
            user.EmailConfirmationToken = token;
            user.EmailConfirmationTokenExpiry = DateTime.UtcNow.AddHours(24);

            await _context.SaveChangesAsync();
            await _emailService.SendEmailConfirmationAsync(user.Email, user.Name, token);

            return token;
        }

        public async Task<bool> ConfirmEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);
            
            if (user == null || user.EmailConfirmationTokenExpiry == null || user.EmailConfirmationTokenExpiry < DateTime.UtcNow)
                return false;

            user.IsEmailConfirmed = true;
            user.EmailConfirmationToken = null;
            user.EmailConfirmationTokenExpiry = null;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task ResendConfirmationEmailAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) throw new Exception("User not found");
            if (user.IsEmailConfirmed) throw new Exception("Email already confirmed");

            await GenerateConfirmationTokenAsync(user.Id);
        }
    }
}
