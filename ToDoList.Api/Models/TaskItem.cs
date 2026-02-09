namespace ToDoList.Api.Models
{

    public enum TaskStatus
    {
        Pending,
        Completed
    }

    public class TaskItem
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
        public int TaskListId { get; set; }
        public TaskList? TaskList { get; set; }
    }
}