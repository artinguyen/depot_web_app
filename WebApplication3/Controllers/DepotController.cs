using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using System.Net;
using DepotWebApp.Models;
using System.Data.Entity;
using System.Web.Script.Serialization;
using System.IO;
namespace WebApplication3.Controllers
{

    public class DepotController : Controller
    {
        // GET: Tonbai
        private TonbaiEntities _db = new TonbaiEntities();
        public ActionResult Index()
        {
            var data = (from tb in _db.Tonbais
                        where tb.Block == "A"
                        select tb).Take(25).ToList();
            return View(data);
        }
        
        public ActionResult GetContByBay(string block, string bay)
        {
            var filteredList = _db.Tonbais
                .Where(tb => tb.Bay.Equals(bay, StringComparison.OrdinalIgnoreCase)
                &&
                 tb.Block.Equals(block, StringComparison.OrdinalIgnoreCase))
                .ToList();

            if (filteredList.Count == 0)
            {
                return Json(new { message = "Không tìm thấy số cont với tier đã cho." }, JsonRequestBehavior.AllowGet);
            }

            var result = new Dictionary<string, Dictionary<string, object[]>>();

            foreach (var row in filteredList)
            {
                string rowKey = row.Row;
                string tierKey = row.Tier;

                if (!result.ContainsKey(rowKey))
                {
                    result[rowKey] = new Dictionary<string, object[]>();
                }

                result[rowKey][tierKey] = new object[]
                {
                    row.Id,
                    row.SoCont,
                    row.Row,
                    row.Tier
                };
            }
            return Json(result, JsonRequestBehavior.AllowGet);
        }


        public ActionResult GetBayByBlock(string block)
        {
            var data = (from tb in _db.Tonbais
                        where tb.Block == block
                        select tb).Take(25).ToList();
            return Json(data, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult UpdatePosition()
        {
            var reader = new StreamReader(Request.InputStream);
            var jsonString = reader.ReadToEnd();
            var serializer = new JavaScriptSerializer();
            var data = serializer.Deserialize<Dictionary<string, object>>(jsonString);

            if (data != null && data.ContainsKey("id") && data.ContainsKey("row") && data.ContainsKey("tier"))
            {
                int id = Convert.ToInt32(data["id"]);
                string row = data["row"].ToString();
                string tier = data["tier"].ToString();

                // Cập nhật thông tin
                var tonbai = _db.Tonbais.Find(id);
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

    }
}