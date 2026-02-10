namespace ToDoList.Api.DTOs
{
    public class TaskListDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    public class CreateTaskListDTO
    {
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }
    }

    public class UpdateTaskListDTO
    {
        public string Name { get; set; } = string.Empty;
    }
}
