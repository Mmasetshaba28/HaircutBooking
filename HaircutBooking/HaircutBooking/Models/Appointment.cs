using System.ComponentModel.DataAnnotations;

namespace HaircutBooking.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }

        [Required]
        public string CustomerName { get; set; }

        [Required]
        [EmailAddress]
        public string CustomerEmail { get; set; }

        [Required]
        [Phone]
        public string CustomerPhone { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }

        [Required]
        public int ServiceId { get; set; }
        public Service Service { get; set; }

        public string Notes { get; set; }

        public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
    public enum AppointmentStatus
    {
        Pending,
        Confirmed,
        Completed,
        Cancelled
    }
}
