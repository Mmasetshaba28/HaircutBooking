using System.ComponentModel.DataAnnotations;

namespace HaircutBooking.Models
{
    public class Service
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }   

        [Required]
        public string Description { get; set; }

        [Required]
        [Range(0, 1000)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, 300)]
        public int DurationMinutes { get; set; }    

        public bool IsActive { get; set; } = true;  
    }
}
