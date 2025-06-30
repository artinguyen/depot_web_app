using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebApplication3
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "GetContByBay",
                url: "Depot/GetContByBay/{block}/{bay}",
                defaults: new { controller = "Depot", action = "GetContByBay", bay = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetBayByBlock",
                url: "Depot/GetBayByBlock/{block}",
                defaults: new { controller = "Depot", action = "GetBayByBlock", block = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetMoveContainer",
                url: "Depot/GetMoveContainer/{block}/{bay}",
                defaults: new { controller = "Depot", action = "GetMoveContainer", bay = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetTruckContainer",
                url: "Depot/GetTruckContainer/{block}/{bay}",
                defaults: new { controller = "Depot", action = "GetTruckContainer", bay = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Depot", action = "Index", id = UrlParameter.Optional }
            );

        }
    }
}
