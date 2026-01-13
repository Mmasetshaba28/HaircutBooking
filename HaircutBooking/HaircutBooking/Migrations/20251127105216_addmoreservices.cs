using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HaircutBooking.Migrations
{
    /// <inheritdoc />
    public partial class addmoreservices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Services",
                columns: new[] { "Id", "Description", "DurationMinutes", "IsActive", "Name", "Price" },
                values: new object[,]
                {
                    { 5, "Special haircut for children with fun styling", 25, true, "Kids Haircut", 18.00m },
                    { 6, "Haircut service for senior citizens", 30, true, "Senior Haircut", 17.00m },
                    { 7, "Modern fade style with precise blending", 45, true, "Fade Haircut", 30.00m },
                    { 8, "Short, even length buzz cut all over", 20, true, "Buzz Cut", 15.00m },
                    { 9, "Precise scissor-only haircut for natural look", 40, true, "Scissor Cut", 25.00m },
                    { 10, "Professional hair washing with conditioning treatment", 20, true, "Hair Wash & Treatment", 12.00m },
                    { 11, "Professional hair coloring service", 90, true, "Hair Coloring", 50.00m },
                    { 12, "Professional styling for special occasions", 30, true, "Hair Styling", 22.00m },
                    { 13, "Traditional straight razor shave with hot towels", 30, true, "Traditional Shave", 25.00m },
                    { 14, "Precise mustache shaping and trimming", 15, true, "Mustache Trim", 10.00m },
                    { 15, "Deep conditioning treatment for hair and scalp", 45, true, "Hair & Scalp Treatment", 35.00m }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Services",
                keyColumn: "Id",
                keyValue: 15);
        }
    }
}
