using Final_UI.Data;
using Final_UI.DTOs;
using Final_UI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Final_UI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (dto.Password != dto.ConfirmPassword)
                return BadRequest(new { error = "Passwords do not match" });

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new { error = "This Email Already Exists" });

            var username = dto.Email.Split('@')[0];  

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Username = username,
                Password = dto.Password 
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { succeeded = true });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Password == dto.Password);

            if (user == null)
                return Unauthorized(new { error = "Invalid email or password" });

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                username = user.Username,
                email = user.Email
            });
        }

    }
}
