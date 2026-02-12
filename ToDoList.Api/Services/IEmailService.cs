namespace ToDoList.Api.Services
{
    public interface IEmailService
    {
        Task SendEmailConfirmationAsync(string email, string name, string token);
    }
}
