using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Zaku.Models;

namespace Zaku.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly FetchService _fetchService = new FetchService();

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        var list = _fetchService.GetSymbolInfo();
        return View(list);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public void SetViewData()
    {
        ViewData["symbolData"] = _fetchService.GetSymbolInfo();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
