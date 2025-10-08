using System.ComponentModel.DataAnnotations;

namespace TaskTrackerApi.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [StringLength(50)]
        public string Department { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Position { get; set; } = string.Empty;
        
        public DateTime HireDate { get; set; }
        
        public bool IsActive { get; set; } = true;
        
        // Navigation property - one employee can have many tasks
        public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
        
        // Full name property for display
        public string FullName => $"{FirstName} {LastName}";
    }
}