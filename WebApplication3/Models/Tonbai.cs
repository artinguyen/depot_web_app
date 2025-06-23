using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DepotWebApp.Models
{
    [Table("Tonbai")]
    public class Tonbai
    {
        /*
        [Key, Column(Order = 1)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public decimal ID { get; set; }
        public string SoCont { get; set; }
        public string Bay { get; set; }
        public string Block { get; set; }
        public string Row { get; set; }
        public string Tier { get; set; }
        */
        public decimal? ID { get; set; }

        [Key]
        public string SoCont { get; set; }
        public string Bay { get; set; }
        public string Block { get; set; }
        public string Row { get; set; }
        public string Tier { get; set; }
        /*
        [Column("ID")]
        public decimal? ID { get; set; } // Nullable vì trong bảng cho phép NULL

        [Key]
        [Column("socont")]
        [MaxLength(11)]
        public string SoCont { get; set; } // Thuộc tính khóa chính

        [Column("block")]
        [MaxLength(1)]
        public string Block { get; set; }

        [Column("bay")]
        [MaxLength(3)]
        public string Bay { get; set; }

        [Column("row")]
        [MaxLength(3)]
        public string Row { get; set; }

        [Column("tier")]
        [MaxLength(3)]
        public string Tier { get; set; }
        */
    }
}