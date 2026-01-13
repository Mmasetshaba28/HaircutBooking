namespace HaircutBooking.Models
{
    public class LoginResponse
    {
        public string Token { get; set; }
        public string Email { get; set; }
        public UserRole Role { get; set; }
    }
}
