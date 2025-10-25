namespace Pschool.Api.Dtos
{
    public class StudentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public int? ParentId { get; set; }  // <-- Must be exactly this
    }
}
