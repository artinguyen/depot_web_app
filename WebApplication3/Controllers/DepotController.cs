using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Net;
using DepotWebApp.Models;
using System.Data.Entity;
using System.Web.Script.Serialization;
using System.IO;
using System.Text.RegularExpressions;
namespace WebApplication3.Controllers
{

    public class DepotController : Controller
    {
        // GET: Tonbai
        private TonbaiEntities _db = new TonbaiEntities();
        public ActionResult Index()
        {
            var data = _db.Tonbais
              .Where(tb => tb.Block == "A")
              .Select(tb => tb.Bay.Trim())
              .Distinct()
              .Take(25)
              .ToList();

            var viewModel = new BayViewModel
            {
                Bays = data
            };

            return View(viewModel);
        }

        public class BayViewModel
        {
            public IEnumerable<string> Bays { get; set; }
        }

        public ActionResult GetContByBay(string block, string bay)
        {
            var filteredList = _db.Tonbais
                .Where(tb => tb.Bay.Equals(bay, StringComparison.OrdinalIgnoreCase)
                &&
                 tb.Block.Equals(block, StringComparison.OrdinalIgnoreCase)
                 && tb.Row != null && tb.Tier != null
                 )
                .ToList();

            if (filteredList.Count == 0)
            {
                return Json(new { message = "Không tìm thấy số cont với tier đã cho." }, JsonRequestBehavior.AllowGet);
            }
            /*
            var result = new Dictionary<string, Dictionary<string, object[]>>();

            foreach (var row in filteredList)
            {
                string rowKey = RemoveWhitespace(row.Row);
                string tierKey = RemoveWhitespace(row.Tier);
                
                if (!result.ContainsKey(rowKey))
                {
                    result[rowKey] = new Dictionary<string, object[]>();
                }
                
                result[rowKey][tierKey] = new object[]
                {
                    row.ID,
                    RemoveWhitespace(row.SoCont),
                    RemoveWhitespace(row.Row),
                    RemoveWhitespace(row.Tier),
                    row.HangTau,
                    row.KichCo
                };
                
           

            }

            
            */
            var results = new List<object[]>(); // Tạo danh sách để lưu trữ kết quả
            foreach (var row in filteredList)
            {
                var result = new object[]
                {
        row.ID,
        RemoveWhitespace(row.SoCont),
        RemoveWhitespace(row.Row),
        RemoveWhitespace(row.Tier),
        row.HangTau,
        row.KichCo
                };

                results.Add(result); // Thêm kết quả vào danh sách
            }

            return Json(results, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetMoveContainer(string block, string bay)
        {
            /*
            var filteredList = _db.Tonbais
                .Where(tb => tb.Bay.Equals(bay, StringComparison.OrdinalIgnoreCase)
                           && tb.Block.Equals(block, StringComparison.OrdinalIgnoreCase)
                          && tb.Move == "Yes")
                .ToList();
                */
            var filteredList = _db.Tonbais
                   .Where(tb => tb.Move == "Yes")
                   .ToList();

            if (filteredList.Count == 0)
            {
                return Json(new { message = "Không tìm thấy số cont với tier đã cho." }, JsonRequestBehavior.AllowGet);
            }
            /*
            var result = new Dictionary<string, Dictionary<string, object[]>>();

            foreach (var row in filteredList)
            {
                string rowKey = RemoveWhitespace(row.Row);
                string tierKey = RemoveWhitespace(row.Tier);

                if (!result.ContainsKey(rowKey))
                {
                    result[rowKey] = new Dictionary<string, object[]>();
                }

                result[rowKey][tierKey] = new object[]
                {
                    row.ID,
                    RemoveWhitespace(row.SoCont),
                    RemoveWhitespace(row.Row),
                    RemoveWhitespace(row.Tier),
                    row.HangTau
                };
            }
            */
            return Json(filteredList, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetTruckContainer(string block, string bay)
        {
            var filteredList = _db.Tonbais
                   .Where(tb => tb.Truck == "Yes")
                   .ToList();
            /*
            if (filteredList.Count == 0)
            {
                return Json(new { message = "Không tìm thấy số cont với tier đã cho." }, JsonRequestBehavior.AllowGet);
            }
            */
            return Json(filteredList, JsonRequestBehavior.AllowGet);
        }

        private string RemoveWhitespace(string input)
        {
            return Regex.Replace(input, @"\s+", string.Empty);
        }

        public class BayObject
        {
            public string Bay { get; set; }
        }

        public ActionResult GetBayByBlock(string block)
        {
            var data = (from tb in _db.Tonbais
                        where tb.Block == block
                        select new BayObject { Bay = tb.Bay.Trim() })
                         .Distinct()
                         .Take(25)
                         .ToList();
            return Json(data, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult UpdateMovePosition()
        {
            var reader = new StreamReader(Request.InputStream);
            var jsonString = reader.ReadToEnd();
            var serializer = new JavaScriptSerializer();
            var data = serializer.Deserialize<Dictionary<string, object>>(jsonString);

            if (data != null && data.ContainsKey("block") && data.ContainsKey("bay") && data.ContainsKey("socont"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string block = data["block"].ToString();
                string bay = data["bay"].ToString();
                string socont = data["socont"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Row = null;
                    tonbai.Tier = null;
                    tonbai.Block = null;
                    tonbai.Bay = null;
                    tonbai.Move = "Yes";
                    tonbai.Truck = null;
                    _db.SaveChanges();

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            return Json(new { message = "Thiếu thông tin cần thiết." });
        }

        [HttpPost]
        public JsonResult UpdatePosition()
        {
            var reader = new StreamReader(Request.InputStream);
            var jsonString = reader.ReadToEnd();
            var serializer = new JavaScriptSerializer();
            var data = serializer.Deserialize<Dictionary<string, object>>(jsonString);
            if (data != null && data.ContainsKey("block") && data.ContainsKey("bay"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string block = data["block"].ToString();
                string bay = data["bay"].ToString();
                string socont = data["socont"].ToString();
                string row = data["row"].ToString();
                string tier = data["tier"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Block = block;
                    tonbai.Bay = bay;
                    tonbai.Row = row;
                    tonbai.Tier = tier;
                    tonbai.Truck = null;
                    _db.SaveChanges();

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }

            else if (data != null && data.ContainsKey("socont") && data.ContainsKey("row") && data.ContainsKey("tier"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string socont = data["socont"].ToString();
                string row = data["row"].ToString();
                string tier = data["tier"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Row = row;
                    tonbai.Tier = tier;
                    _db.SaveChanges();

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            return Json(new { message = "Thiếu thông tin cần thiết." });
        }


        [HttpPost]
        public JsonResult UpdateTruckPosition()
        {
            var reader = new StreamReader(Request.InputStream);
            var jsonString = reader.ReadToEnd();
            var serializer = new JavaScriptSerializer();
            var data = serializer.Deserialize<Dictionary<string, object>>(jsonString);

            if (data != null && data.ContainsKey("block") && data.ContainsKey("bay") && data.ContainsKey("socont"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string block = data["block"].ToString();
                string bay = data["bay"].ToString();
                string socont = data["socont"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Row = null;
                    tonbai.Tier = null;
                    tonbai.Block = null;
                    tonbai.Bay = null;
                    tonbai.Move = null;
                    tonbai.Truck = "Yes";
                    _db.SaveChanges();

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            return Json(new { message = "Thiếu thông tin cần thiết." });
        }


    }
}