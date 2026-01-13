using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace HaircutBooking.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }   
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum UserRole
    {
        Customer,
        Admin
    }
}
