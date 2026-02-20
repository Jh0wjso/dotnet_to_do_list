using ToDoList.Api.Data;
using ToDoList.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ToDoList.Api.Models;
using Microsoft.AspNetCore.Authorization;
using ToDoList.Api.Services;

namespace ToDoList.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailConfirmationService _emailConfirmationService;

        public AuthController(AppDbContext context, IConfiguration configuration, IEmailConfirmationService emailConfirmationService)
        {
            _context = context;
            _configuration = configuration;
            _emailConfirmationService = emailConfirmationService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponseDTO>> Login(LoginDTO dto)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
                return Unauthorized("Invalid credentials");

            var token = GenerateJwtToken(user);

            return Ok(new LoginResponseDTO
            {
                Token = token,
                User = new UserDTO { Id = user.Id, Name = user.Name, Email = user.Email, IsEmailConfirmed = user.IsEmailConfirmed }
            });
        }

        [HttpPost("signup")]
        public async Task<ActionResult<SignUpResponseDTO>> SignUp(SignUpDTO dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("Email already in use");

            var user = new User
            {
                Name = dto.Email.Split('@')[0],
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailConfirmationService.GenerateConfirmationTokenAsync(user.Id);

            var token = GenerateJwtToken(user);

            return Ok(new SignUpResponseDTO
            {
                Token = token,
                User = new UserDTO { Id = user.Id, Name = user.Name, Email = user.Email, IsEmailConfirmed = user.IsEmailConfirmed }
            });
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] string token)
        {
            var result = await _emailConfirmationService.ConfirmEmailAsync(token);
            if (!result)
                return BadRequest("Invalid or expired token");

            await Task.Delay(1000);
            var appUrl = Environment.GetEnvironmentVariable("APP_URL") ?? _configuration["APP_URL"];
            return Redirect($"{appUrl}/login");
        }

        [HttpPost("resend-confirmation")]
        public async Task<IActionResult> ResendConfirmation([FromBody] string email)
        {
            try
            {
                await _emailConfirmationService.ResendConfirmationEmailAsync(email);
                return Ok("Confirmation email resent");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtKey = Environment.GetEnvironmentVariable("JWT_SECRET") ?? _configuration["Jwt:Key"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            };

            var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? _configuration["Jwt:Issuer"];
            var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? _configuration["Jwt:Audience"];

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
