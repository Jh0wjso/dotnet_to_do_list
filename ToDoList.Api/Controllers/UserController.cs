using ToDoList.Api.Models;
using ToDoList.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ToDoList.Api.Controllers
{
    public class UserController : Controller
    {
        private readonly AppDbContext _context;

        public UserController(AppDbContext context)
        {
            _context = context;
        }

        // Get All Users
        [HttpGet("/users")]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }
        
    }
}