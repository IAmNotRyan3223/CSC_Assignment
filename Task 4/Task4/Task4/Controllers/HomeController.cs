using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Task4.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        public ActionResult Talents()
        {
            ViewBag.Title = "Tales Page";

            return View();
        }

        public ActionResult Verify()
        {
            ViewBag.Title = "Tales Page";

            return View();
        }
    }

    
}
