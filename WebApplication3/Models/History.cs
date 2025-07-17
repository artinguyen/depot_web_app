using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DepotWebApp.Models
{
    [Table("history")]
    public class History
    {
        [Key]
        //public int SoPhieu { get; set;  }
        public string SoCont { get; set; }
        public string KeySoPhieu { get; set; }
        
        public string Bay { get; set; }
        public string Block { get; set; }
        public string Row { get; set; }
        public string Tier { get; set; }

        public string HangTau { get; set; }
        public string NgThucHien { get; set; }
        public string GioThucHien { get; set; }
        public string NguoiDung { get; set; }
    }
}