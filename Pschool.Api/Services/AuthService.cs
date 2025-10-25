using Pschool.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Pschool.Api.Services
{
    public class AuthService
    {
        private readonly List<User> _users = new(); // in-memory users

        public User Register(string name, string email, string password)
        {
            if (_users.Any(u => u.Email == email))
                throw new Exception("Email already exists");

            var user = new User { Name = name, Email = email, Password = password };
            _users.Add(user);
            return user;
        }

        public string Login(string email, string password)
        {
            var user = _users.FirstOrDefault(u => u.Email == email && u.Password == password);
            if (user == null)
                throw new Exception("Invalid credentials");

            // Generate a fake token
            return Guid.NewGuid().ToString();
        }
    }
}
