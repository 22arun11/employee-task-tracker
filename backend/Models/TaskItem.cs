using System.ComponentModel.DataAnnotations;

namespace TaskTrackerApi.Models
{
    public enum TaskItemStatus
    {
        NotStarted = 0,
        InProgress = 1,
        Completed = 2,
        OnHold = 3,
        Cancelled = 4
    }
    
    public enum TaskPriority
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    public class TaskItem
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        public TaskItemStatus Status { get; set; } = TaskItemStatus.NotStarted;
        
        public TaskPriority Priority { get; set; } = TaskPriority.Medium;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? DueDate { get; set; }
        
        public DateTime? CompletedDate { get; set; }
        
        // Foreign key for Employee
        public int EmployeeId { get; set; }
        
        // Navigation property - many tasks belong to one employee
        public Employee Employee { get; set; } = null!;
        
        // Computed property to check if task is overdue
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status != TaskItemStatus.Completed;
    }
}