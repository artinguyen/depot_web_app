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
            var history = new History();
  
            if (Session["user"] == null)
            {
                // Chưa đăng nhập, điều hướng về trang login
                return RedirectToAction("Login", "Depot");
            }
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
        row.KichCo,
        row.Position
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

        public ActionResult GetBarContainer(string block, string bay)
        {
            var filteredList = _db.Tonbais
                   .Where(tb => tb.Truck == "Bar")
                   .ToList();
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

                    // Update history
                    updateHistory(tonbai);

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
            
            try
            { 

            if (data != null && data.ContainsKey("block") && data.ContainsKey("bay"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string block = data["block"].ToString();
                string bay = data["bay"].ToString();
                string socont = data["socont"].ToString();
                string row = data["row"].ToString();
                string tier = data["tier"].ToString();
                string position = data["position"].ToString();
                
                    // Cập nhật thông tin
                    var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Block = block;
                    tonbai.Bay = bay;
                    tonbai.Row = row;
                    tonbai.Tier = tier;
                    tonbai.Truck = null;
                    tonbai.Position = position;
                    tonbai.Move = null;
                    _db.SaveChanges();
                    // Update history
                    updateHistory(tonbai);

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            // In case moving
            else if (data != null && data.ContainsKey("socont") && data.ContainsKey("row") && data.ContainsKey("tier"))
            {
                //int id = Convert.ToInt32(data["id"]);
                string socont = data["socont"].ToString();
                string row = data["row"].ToString();
                string tier = data["tier"].ToString();
                string position = data["position"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(socont);
                if (tonbai != null)
                {
                    tonbai.Row = row;
                    tonbai.Tier = tier;
                    tonbai.Position = position;
                    _db.SaveChanges();
                    // Upadte history
                    updateHistory(tonbai);
                       
                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            return Json(new { message = "Thiếu thông tin cần thiết." });


            }
            catch (System.Data.Entity.Infrastructure.DbUpdateException ex)
            {
                Console.WriteLine(ex.Message);
                var innerException = ex.InnerException != null ? ex.InnerException.Message : "Không có thông tin chi tiết.";

                return Json(new { message = "Thiếu thông tin cần thiết." });
            }
            catch (Exception ex)
            {
                return Json(new { message = "Có lỗi xảy ra: " + ex.Message });
            }
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

                    // Update history
                    updateHistory(tonbai);

                    return Json(new { message = "Cập nhật thành công." });
                }
                return Json(new { message = "Không tìm thấy bản ghi để cập nhật." });
            }
            return Json(new { message = "Thiếu thông tin cần thiết." });
        }

        public ActionResult login()
        {
            if (Session["user"] != null)
            {
                return RedirectToAction("Index", "Depot");
            }
            return View();
        }

        [HttpPost]
        public ActionResult Login(string username, string password, string _zone)
        {
            if (IsValidUser(username, password))
            {
                Session["user"] = username;
                return RedirectToAction("Index");
            }

            ViewBag.Error = "Tài khoản hoặc mật khẩu không đúng";
            return View();
        }

        private bool IsValidUser(string username, string password)
        {
            return _db.Users.Any(u => u.Tendangnhap == username && u.Matkhau == password);

        }

        public ActionResult Logout()
        {
            Session.Clear();
            return RedirectToAction("Login", "Depot");
        }
        
        public void updateHistory(Tonbai tonbai)
        {
            var user = Session["user"].ToString();
            var history = new History
            {
                SoCont = tonbai.SoCont,
                //SoPhieu = tonbai.SoPhieu,
                Block = tonbai.Block,
                Bay = tonbai.Bay,
                Row = tonbai.Row,
                Tier = tonbai.Tier,
                HangTau = tonbai.HangTau,
                NgThucHien = DateTime.Now.ToString("MM/dd/yyyy"),
                GioThucHien = DateTime.Now.ToString("HH/mm"),
                KeySoPhieu = tonbai.KeySoPhieu,
                NguoiDung = user
            };

            _db.Histories.Add(history);
            _db.SaveChanges();
        }
    }

    

}