using HaircutBooking.Data;
using HaircutBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace HaircutBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly BookingContext _context;
        private readonly ILogger<AppointmentsController> _logger;

        public AppointmentsController(BookingContext context, ILogger<AppointmentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Helper method to get current user ID
        private int GetCurrentUserId()
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    throw new UnauthorizedAccessException("User not authenticated");
                }
                return int.Parse(userId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user ID: {ex.Message}");
                throw;
            }
        }

        // Helper method to check if user is admin
        private bool IsAdmin()
        {
            return User.IsInRole("Admin");
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .OrderByDescending(a => a.AppointmentDate)
                .ToListAsync();
        }

        [HttpGet("my-appointments")]
        [Authorize] // ✅ REQUIRES AUTHENTICATION
        public async Task<ActionResult<IEnumerable<Appointment>>> GetMyAppointments()
        {
            try
            {
                var userId = GetCurrentUserId();
                Console.WriteLine($"🔍 Fetching appointments for user: {userId}");

                var appointments = await _context.Appointments
                    .Include(a => a.Service)
                    .Where(a => a.UserId == userId)
                    .OrderByDescending(a => a.AppointmentDate)
                    .ToListAsync();

                Console.WriteLine($"✅ Found {appointments.Count} appointments for user {userId}");
                return appointments;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Error in GetMyAppointments: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching appointments", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Appointment>> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Service)
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        [HttpPost]
        [Authorize] // ✅ REQUIRES AUTHENTICATION
        public async Task<ActionResult<Appointment>> CreateAppointment(Appointment appointment)
        {
            try
            {
                var userId = GetCurrentUserId();

                var service = await _context.Services.FindAsync(appointment.ServiceId);
                if (service == null || !service.IsActive)
                {
                    return BadRequest("Invalid service selected.");
                }

                // Check for time slot conflicts
                var conflictAppointment = await _context.Appointments
                    .Where(a => a.AppointmentDate == appointment.AppointmentDate &&
                               a.Status != AppointmentStatus.Cancelled)
                    .FirstOrDefaultAsync();

                if (conflictAppointment != null)
                {
                    return BadRequest("The selected time slot is already booked.");
                }

                // Set the user ID for the appointment
                appointment.UserId = userId;
                appointment.Status = AppointmentStatus.Pending;
                appointment.CreatedAt = DateTime.UtcNow;

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"NEW BOOKING: User {userId} - {appointment.CustomerName} for {appointment.AppointmentDate}");
                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Error creating appointment: {ex.Message}");
                return StatusCode(500, new { message = "Error creating appointment", error = ex.Message });
            }
        }

        [HttpPut("{id}/confirm")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            appointment.Status = AppointmentStatus.Confirmed;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/complete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CompleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            appointment.Status = AppointmentStatus.Completed;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}/cancel")]
        [Authorize] // ✅ REQUIRES AUTHENTICATION
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            // Users can only cancel their own appointments unless they're admin
            var userId = GetCurrentUserId();
            if (!IsAdmin() && appointment.UserId != userId)
            {
                return Forbid();
            }

            appointment.Status = AppointmentStatus.Cancelled;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
            {
                return NotFound();
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"APPOINTMENT DELETED: {appointment.CustomerName} for {appointment.AppointmentDate}");
            return NoContent();
        }

        [HttpGet("available-slots")]
        [AllowAnonymous] // ✅ PUBLIC - no authentication required
        public async Task<ActionResult<IEnumerable<DateTime>>> GetAvailableSlots([FromQuery] DateTime date, [FromQuery] int serviceId)
        {
            try
            {
                var service = await _context.Services.FindAsync(serviceId);
                if (service == null)
                {
                    return BadRequest("Invalid service");
                }

                var dateOnly = date.Date;
                var slots = new List<DateTime>();

                // Define business hours (9 AM to 5 PM)
                for (int hour = 9; hour < 17; hour++)
                {
                    for (int minute = 0; minute < 60; minute += 30) // 30-minute intervals
                    {
                        var slotTime = new DateTime(dateOnly.Year, dateOnly.Month, dateOnly.Day, hour, minute, 0);

                        // Check if this exact time slot is already booked
                        var isBooked = await _context.Appointments
                            .AnyAsync(a => a.AppointmentDate == slotTime &&
                                          a.Status != AppointmentStatus.Cancelled);

                        if (!isBooked)
                        {
                            slots.Add(slotTime);
                        }
                    }
                }

                return slots;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"💥 Error in GetAvailableSlots: {ex.Message}");
                return StatusCode(500, new { message = "Error fetching available slots", error = ex.Message });
            }
        }
    }
}