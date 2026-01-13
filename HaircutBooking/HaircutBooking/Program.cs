using HaircutBooking.Data;
using HaircutBooking.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // React app URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<BookingContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ ADD JWT AUTHENTICATION CONFIGURATION
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"] ?? "your-super-secret-key-at-least-32-chars-long")),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// FIXED: Configure JSON options to serialize enums as strings
builder.Services.Configure<JsonOptions>(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// ALSO add this for controller JSON serialization
builder.Services.Configure<Microsoft.AspNetCore.Mvc.JsonOptions>(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// ✅ MUST BE IN THIS ORDER
app.UseAuthentication(); // This comes first
app.UseAuthorization();  // This comes after

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<BookingContext>();
    context.Database.EnsureCreated();

    SeedAdminUser(context);
}

app.Run();

void SeedAdminUser(BookingContext context)
{
    // Check if admin already exists
    if (!context.Users.Any(u => u.Email == "admin@barbershop.com"))
    {
        var adminUser = new User
        {
            Email = "admin@barbershop.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
            Role = UserRole.Admin
        };

        context.Users.Add(adminUser);
        context.SaveChanges();
        Console.WriteLine("✅ Admin user created: admin@barbershop.com / admin123");
    }

    // Check if services exist, if not create some
    if (!context.Services.Any())
    {
        var services = new List<Service>
        {
            new Service { Name = "Basic Haircut", Description = "Standard haircut service", Price = 25.00m, DurationMinutes = 30, IsActive = true },
            new Service { Name = "Haircut & Beard", Description = "Haircut with beard trim", Price = 35.00m, DurationMinutes = 45, IsActive = true },
            new Service { Name = "Deluxe Package", Description = "Full service with styling", Price = 50.00m, DurationMinutes = 60, IsActive = true }
        };

        context.Services.AddRange(services);
        context.SaveChanges();
        Console.WriteLine("✅ Default services created");
    }
}