namespace ToDoList.Api.DTOs
{
    public class SignUpDTO
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    public class SignUpResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public UserDTO User { get; set; } = null!;
    }
}
