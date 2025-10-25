using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Pschool.Api.Models
{
    public class Parent
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Email { get; set; } = string.Empty;

        // Navigation property
        public List<Student> Students { get; set; } = new();
    }
}
