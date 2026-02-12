namespace ToDoList.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsEmailConfirmed { get; set; } = false;
        public string? EmailConfirmationToken { get; set; }
        public DateTime? EmailConfirmationTokenExpiry { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public List<TaskList> TaskLists { get; set; } = new List<TaskList>();
    }
}