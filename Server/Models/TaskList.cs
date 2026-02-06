namespace dotnet_to_do_list.Server.Models
{
    public class TaskList
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int UserId { get; set; }
        public User? User { get; set; }
        public List<TaskItem> Tasks { get; set; } = new List<TaskItem>();
    }
}