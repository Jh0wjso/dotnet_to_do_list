namespace ToDoList.Api.DTOs
{
    public class LoginDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public UserDTO User { get; set; } = null!;
    }
}
