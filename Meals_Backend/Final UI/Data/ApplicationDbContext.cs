using Final_UI.Models;
using Microsoft.EntityFrameworkCore;

namespace Final_UI.Data
{
    public class ApplicationDbContext :DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }   //Carol & Nour & Angela
        public DbSet<Recipe> Recipes { get; set; }  //Carol & Nour & Angela
        public DbSet<Ingredient> Ingredients { get; set; }  //Carol & Nour & Angela
        public DbSet<Review> Reviews { get; set; }  //Carol
        public DbSet<Plan> Plans { get; set; } //Nour
        public DbSet<ShoppingItem> ShoppingItems { get; set; } //Nour
        public DbSet<Followers> Followers { get; set; }  //Angela


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Recipe)
                .WithMany(rp => rp.Reviews)
                .HasForeignKey(r => r.RecipeId);

            modelBuilder.Entity<Ingredient>()
                .HasOne(i => i.Recipe)
                .WithMany(r => r.Ingredients)
                .HasForeignKey(i => i.RecipeId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.SavedRecipes)
                .WithMany(r => r.SavedByUsers)
                .UsingEntity(j => j.ToTable("UserSavedRecipes"));
        }


    }
}
