using TaskStatus = ToDoList.Api.Models.TaskStatus;

namespace ToDoList.Api.DTOs
{
    public class TaskItemDTO
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
        public int TaskListId { get; set; }
    }

    public class CreateTaskItemDTO
    {
        public string Description { get; set; } = string.Empty;
        public int TaskListId { get; set; }
    }

    public class UpdateTaskItemDTO
    {
        public string Description { get; set; } = string.Empty;
        public TaskStatus Status { get; set; }
    }
}