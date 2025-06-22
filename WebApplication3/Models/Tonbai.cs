using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DepotWebApp.Models
{
    [Table("Tonbai")]
    public class Tonbai
    {

        [Key, Column(Order = 1)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string SoCont { get; set; }
        public string Bay { get; set; }
        public string Block { get; set; }
        public string Row { get; set; }
        public string Tier { get; set; }
    }
}