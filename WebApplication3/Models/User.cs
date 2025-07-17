using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace DepotWebApp.Models
{
    [Table("nguoidung_web")] // Chỉ định tên bảng
    public class User
    {
        [Key, Column(Order = 2)]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int ID { get; set; }

        public string Tendangnhap { get; set; }

        public string Matkhau { get; set; }
    }
}