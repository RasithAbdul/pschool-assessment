using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pschool.Api.Models
{
    public class Student
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public int Age { get; set; }

        // Foreign key
        public int ParentId { get; set; }

        // Navigation property with foreign key explicitly defined
        [ForeignKey("ParentId")]
        public Parent Parent { get; set; } = null!;
    }
}
