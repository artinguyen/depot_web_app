using System.Data.Entity;
namespace DepotWebApp.Models
{
    public class TonbaiEntities : DbContext
    {
        public TonbaiEntities() : base("demoASPEntities")
        {
        }
        public DbSet<Tonbai> Tonbais { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<History> Histories { get; set; }
    }
}