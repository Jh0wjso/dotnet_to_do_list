namespace ToDoList.Api.Services
{
    public interface IEmailConfirmationService
    {
        Task<string> GenerateConfirmationTokenAsync(int userId);
        Task<bool> ConfirmEmailAsync(string token);
        Task ResendConfirmationEmailAsync(string email);
    }
}
