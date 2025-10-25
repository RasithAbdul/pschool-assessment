using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pschool.Api.Data;
using Pschool.Api.Dtos;
using Pschool.Api.Models;

namespace Pschool.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? parentId)
        {
            var query = _context.Students.AsQueryable();

            if (parentId.HasValue)
                query = query.Where(s => s.ParentId == parentId.Value);

            var students = await query
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Age = s.Age,
                    ParentId = s.ParentId
                })
                .ToListAsync();

            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var student = await _context.Students
                .Where(s => s.Id == id)
                .Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Age = s.Age,
                    ParentId = s.ParentId
                })
                .FirstOrDefaultAsync();

            if (student == null) return NotFound();
            return Ok(student);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StudentDto studentDto)
        {
            if (studentDto == null) return BadRequest();
            if (!studentDto.ParentId.HasValue)
                return BadRequest("ParentId is required.");

            var exists = await _context.Students
                .AnyAsync(s => s.Name == studentDto.Name && s.ParentId == studentDto.ParentId.Value);

            if (exists)
                return Conflict("Student with this name under the selected parent already exists.");

            var student = new Student
            {
                Name = studentDto.Name,
                Age = studentDto.Age,
                ParentId = studentDto.ParentId.Value
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = student.Id }, studentDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] StudentDto studentDto)
        {
            if (studentDto == null || id != studentDto.Id)
                return BadRequest("Invalid student data.");

            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            student.Name = studentDto.Name;
            student.Age = studentDto.Age;

            if (studentDto.ParentId.HasValue)
                student.ParentId = studentDto.ParentId.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
