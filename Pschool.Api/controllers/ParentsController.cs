using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Pschool.Api.Data;
using Pschool.Api.Dtos;
using Pschool.Api.Models;

namespace Pschool.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ParentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var parents = await _context.Parents
                .Include(p => p.Students)
                .ToListAsync();

            var parentDtos = parents.Select(p => new ParentDto
            {
                Id = p.Id,
                Name = p.Name,
                Email = p.Email,
                Students = p.Students.Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Age = s.Age,
                    ParentId = p.Id
                }).ToList()
            }).ToList();

            return Ok(parentDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null) return NotFound();

            var parentDto = new ParentDto
            {
                Id = parent.Id,
                Name = parent.Name,
                Email = parent.Email,
                Students = parent.Students.Select(s => new StudentDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Age = s.Age,
                    ParentId = parent.Id
                }).ToList()
            };

            return Ok(parentDto);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ParentDto parentDto)
        {
            if (parentDto == null) return BadRequest();

            var exists = await _context.Parents
                .AnyAsync(p => p.Name == parentDto.Name && p.Email == parentDto.Email);

            if (exists)
                return Conflict("Parent with this name and email already exists.");

            var parent = new Parent
            {
                Name = parentDto.Name,
                Email = parentDto.Email
            };

            _context.Parents.Add(parent);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = parent.Id }, new ParentDto
            {
                Id = parent.Id,
                Name = parent.Name,
                Email = parent.Email,
                Students = new List<StudentDto>()
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ParentDto parentDto)
        {
            if (id != parentDto.Id) return BadRequest();

            var parent = await _context.Parents.FindAsync(id);
            if (parent == null) return NotFound();

            parent.Name = parentDto.Name;
            parent.Email = parentDto.Email;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var parent = await _context.Parents
                .Include(p => p.Students)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (parent == null) return NotFound();

            _context.Students.RemoveRange(parent.Students);
            _context.Parents.Remove(parent);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
