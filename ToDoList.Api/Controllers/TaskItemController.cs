using ToDoList.Api.Models;
using ToDoList.Api.Data;
using ToDoList.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ToDoList.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskItemController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskItemDTO>>> GetTaskItems()
        {
            var taskItems = await _context.TaskItems
                .Select(ti => new TaskItemDTO { Id = ti.Id, Description = ti.Description, Status = ti.Status, TaskListId = ti.TaskListId })
                .ToListAsync();
            return Ok(taskItems);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskItemDTO>> GetTaskItem(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return NotFound();
            
            return Ok(new TaskItemDTO { Id = taskItem.Id, Description = taskItem.Description, Status = taskItem.Status, TaskListId = taskItem.TaskListId });
        }

        [HttpPost]
        public async Task<ActionResult<TaskItemDTO>> CreateTaskItem(CreateTaskItemDTO dto)
        {
            var taskListExists = await _context.TaskLists.AnyAsync(tl => tl.Id == dto.TaskListId);
            if (!taskListExists) return BadRequest("TaskList not found");

            var taskItem = new TaskItem { Description = dto.Description, TaskListId = dto.TaskListId };
            _context.TaskItems.Add(taskItem);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetTaskItem), new { id = taskItem.Id }, new TaskItemDTO { Id = taskItem.Id, Description = taskItem.Description, Status = taskItem.Status, TaskListId = taskItem.TaskListId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskItem(int id, UpdateTaskItemDTO dto)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return NotFound();
            
            taskItem.Description = dto.Description;
            taskItem.Status = dto.Status;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskItem(int id)
        {
            var taskItem = await _context.TaskItems.FindAsync(id);
            if (taskItem == null) return NotFound();
            
            _context.TaskItems.Remove(taskItem);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
