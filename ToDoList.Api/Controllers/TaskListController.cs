using ToDoList.Api.Models;
using ToDoList.Api.Data;
using ToDoList.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ToDoList.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TaskListController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TaskListController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<TaskListDTO>>> GetTaskLists()
        {
            var taskLists = await _context.TaskLists
                .Select(tl => new TaskListDTO { Id = tl.Id, Name = tl.Name, UserId = tl.UserId })
                .ToListAsync();
            return Ok(taskLists);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TaskListDTO>> GetTaskList(int id)
        {
            var taskList = await _context.TaskLists.FindAsync(id);
            if (taskList == null) return NotFound();
            
            return Ok(new TaskListDTO { Id = taskList.Id, Name = taskList.Name, UserId = taskList.UserId });
        }

        [HttpPost]
        public async Task<ActionResult<TaskListDTO>> CreateTaskList(CreateTaskListDTO dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists) return BadRequest("User not found");

            var taskList = new TaskList { Name = dto.Name, UserId = dto.UserId };
            _context.TaskLists.Add(taskList);
            await _context.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetTaskList), new { id = taskList.Id }, new TaskListDTO { Id = taskList.Id, Name = taskList.Name, UserId = taskList.UserId });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTaskList(int id, UpdateTaskListDTO dto)
        {
            var taskList = await _context.TaskLists.FindAsync(id);
            if (taskList == null) return NotFound();
            
            taskList.Name = dto.Name;
            await _context.SaveChangesAsync();
            
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTaskList(int id)
        {
            var taskList = await _context.TaskLists.FindAsync(id);
            if (taskList == null) return NotFound();
            
            _context.TaskLists.Remove(taskList);
            await _context.SaveChangesAsync();
            
            return NoContent();
        }
    }
}
