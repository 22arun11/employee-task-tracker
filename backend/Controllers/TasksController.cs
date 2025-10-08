using Microsoft.AspNetCore.Mvc;
using TaskTrackerApi.Models;

namespace TaskTrackerApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        // In-memory storage for demo
        private static List<TaskItem> _tasks = new List<TaskItem>
        {
            new TaskItem
            {
                Id = 1,
                Title = "Implement User Authentication",
                Description = "Add login and registration functionality to the application",
                Status = TaskItemStatus.InProgress,
                Priority = TaskPriority.High,
                EmployeeId = 1,
                CreatedDate = DateTime.UtcNow.AddDays(-5),
                DueDate = DateTime.UtcNow.AddDays(7)
            },
            new TaskItem
            {
                Id = 2,
                Title = "Create Marketing Campaign",
                Description = "Design and launch Q4 marketing campaign",
                Status = TaskItemStatus.NotStarted,
                Priority = TaskPriority.Medium,
                EmployeeId = 2,
                CreatedDate = DateTime.UtcNow.AddDays(-3),
                DueDate = DateTime.UtcNow.AddDays(14)
            },
            new TaskItem
            {
                Id = 3,
                Title = "Follow up with leads",
                Description = "Contact potential customers from last week's trade show",
                Status = TaskItemStatus.Completed,
                Priority = TaskPriority.High,
                EmployeeId = 3,
                CreatedDate = DateTime.UtcNow.AddDays(-7),
                DueDate = DateTime.UtcNow.AddDays(-2),
                CompletedDate = DateTime.UtcNow.AddDays(-1)
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> GetTasks([FromQuery] int? employeeId = null)
        {
            var tasks = employeeId.HasValue 
                ? _tasks.Where(t => t.EmployeeId == employeeId.Value)
                : _tasks;
            
            return Ok(tasks.OrderByDescending(t => t.CreatedDate));
        }

        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTask(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            return Ok(task);
        }

        [HttpPost]
        public ActionResult<TaskItem> CreateTask(TaskItem task)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            task.Id = _tasks.Count > 0 ? _tasks.Max(t => t.Id) + 1 : 1;
            task.CreatedDate = DateTime.UtcNow;
            
            _tasks.Add(task);
            
            return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, TaskItem task)
        {
            if (id != task.Id)
            {
                return BadRequest();
            }

            var existingTask = _tasks.FirstOrDefault(t => t.Id == id);
            if (existingTask == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            existingTask.Title = task.Title;
            existingTask.Description = task.Description;
            existingTask.Status = task.Status;
            existingTask.Priority = task.Priority;
            existingTask.DueDate = task.DueDate;
            existingTask.EmployeeId = task.EmployeeId;

            // Set completed date when status changes to completed
            if (task.Status == TaskItemStatus.Completed && existingTask.CompletedDate == null)
            {
                existingTask.CompletedDate = DateTime.UtcNow;
            }
            else if (task.Status != TaskItemStatus.Completed)
            {
                existingTask.CompletedDate = null;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTask(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }

            _tasks.Remove(task);
            
            return NoContent();
        }

        [HttpGet("dashboard")]
        public ActionResult<object> GetDashboardStats()
        {
            var stats = new
            {
                TotalTasks = _tasks.Count,
                CompletedTasks = _tasks.Count(t => t.Status == TaskItemStatus.Completed),
                InProgressTasks = _tasks.Count(t => t.Status == TaskItemStatus.InProgress),
                OverdueTasks = _tasks.Count(t => t.IsOverdue),
                TasksByPriority = _tasks.GroupBy(t => t.Priority)
                    .Select(g => new { Priority = g.Key.ToString(), Count = g.Count() })
                    .ToList(),
                TasksByStatus = _tasks.GroupBy(t => t.Status)
                    .Select(g => new { Status = g.Key.ToString(), Count = g.Count() })
                    .ToList()
            };

            return Ok(stats);
        }
    }
}