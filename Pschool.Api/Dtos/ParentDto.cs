namespace Pschool.Api.Dtos
{
    public class ParentDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public List<StudentDto> Students { get; set; } = new List<StudentDto>();
    }
}
