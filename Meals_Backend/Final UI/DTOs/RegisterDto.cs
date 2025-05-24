namespace Final_UI.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; }  // you may ignore this if not used in the model
        public string Email { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
