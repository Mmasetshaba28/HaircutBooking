using HaircutBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace HaircutBooking.Data
{
    public class BookingContext : DbContext
    {
        public BookingContext(DbContextOptions<BookingContext> options) : base(options)
        {
        }

        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<User> Users { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>()
           .HasOne(a => a.User)
           .WithMany()
           .HasForeignKey(a => a.UserId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Appointment>()
                .HasOne(a => a.Service)
                .WithMany()
                .HasForeignKey(a => a.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Service>().HasData(
                new Service
                {
                    Id = 1,
                    Name = "Basic Haircut",
                    Description = "A standard haircut service.",
                    Price = 20.00m,
                    DurationMinutes = 30,
                    IsActive = true
                },
                new Service
                {
                    Id = 2,
                    Name = "Deluxe Haircut",
                    Description = "A premium haircut service with additional styling.",
                    Price = 35.00m,
                    DurationMinutes = 45,
                    IsActive = true
                },
                new Service
                {
                    Id = 3,
                    Name = "Beard Trim",
                    Description = "Professional beard shaping and trimming",
                    Price = 15.00m,
                    DurationMinutes = 20,
                    IsActive = true
                },
                new Service
                {
                    Id = 4,
                    Name = "Haircut + Beard",
                    Description = "Complete grooming package",
                    Price = 45.00m,
                    DurationMinutes = 60,
                    IsActive = true
                },
                // ✅ ADD THESE 11 NEW SERVICES
                new Service
                {
                    Id = 5,
                    Name = "Kids Haircut",
                    Description = "Special haircut for children with fun styling",
                    Price = 18.00m,
                    DurationMinutes = 25,
                    IsActive = true
                },
                new Service
                {
                    Id = 6,
                    Name = "Senior Haircut",
                    Description = "Haircut service for senior citizens",
                    Price = 17.00m,
                    DurationMinutes = 30,
                    IsActive = true
                },
                new Service
                {
                    Id = 7,
                    Name = "Fade Haircut",
                    Description = "Modern fade style with precise blending",
                    Price = 30.00m,
                    DurationMinutes = 45,
                    IsActive = true
                },
                new Service
                {
                    Id = 8,
                    Name = "Buzz Cut",
                    Description = "Short, even length buzz cut all over",
                    Price = 15.00m,
                    DurationMinutes = 20,
                    IsActive = true
                },
                new Service
                {
                    Id = 9,
                    Name = "Scissor Cut",
                    Description = "Precise scissor-only haircut for natural look",
                    Price = 25.00m,
                    DurationMinutes = 40,
                    IsActive = true
                },
                new Service
                {
                    Id = 10,
                    Name = "Hair Wash & Treatment",
                    Description = "Professional hair washing with conditioning treatment",
                    Price = 12.00m,
                    DurationMinutes = 20,
                    IsActive = true
                },
                new Service
                {
                    Id = 11,
                    Name = "Hair Coloring",
                    Description = "Professional hair coloring service",
                    Price = 50.00m,
                    DurationMinutes = 90,
                    IsActive = true
                },
                new Service
                {
                    Id = 12,
                    Name = "Hair Styling",
                    Description = "Professional styling for special occasions",
                    Price = 22.00m,
                    DurationMinutes = 30,
                    IsActive = true
                },
                new Service
                {
                    Id = 13,
                    Name = "Traditional Shave",
                    Description = "Traditional straight razor shave with hot towels",
                    Price = 25.00m,
                    DurationMinutes = 30,
                    IsActive = true
                },
                new Service
                {
                    Id = 14,
                    Name = "Mustache Trim",
                    Description = "Precise mustache shaping and trimming",
                    Price = 10.00m,
                    DurationMinutes = 15,
                    IsActive = true
                },
                new Service
                {
                    Id = 15,
                    Name = "Hair & Scalp Treatment",
                    Description = "Deep conditioning treatment for hair and scalp",
                    Price = 35.00m,
                    DurationMinutes = 45,
                    IsActive = true
                }
            );
        }
    }
}