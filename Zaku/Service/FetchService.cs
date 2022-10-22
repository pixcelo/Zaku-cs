using Zaku.Models;
using System.Net.Http.Headers;
using Bybit.Net.Clients;
using Bybit.Net.Objects;
using Bybit.Net.Objects.Models;
using CryptoExchange.Net.Authentication;
using CryptoExchange.Net.Objects;
using System.Text.Json;

namespace Zaku
{
    public class FetchService
    {
        private readonly HttpClient _client = new HttpClient();
        private readonly BybitClient _bybitClient;

        public FetchService()
        {
            _bybitClient = new BybitClient(new BybitClientOptions()
            {
                ApiCredentials = new ApiCredentials("API-KEY", "API-SECRET"),
                LogLevel = LogLevel.Trace,
                RequestTimeout = TimeSpan.FromSeconds(60),
                InverseFuturesApiOptions = new RestApiClientOptions
                {
                    ApiCredentials = new ApiCredentials("FUTURES-API-KEY", "FUTURES-API-SECRET"),
                    AutoTimestamp = false
                }
            });
        }

        public string GetOhlc()
        {
            try
            {
                string endpoint = "https://api.cryptowat.ch";
                string path = "/markets/bybit/BTCUSDT/ohlc";
                var task = _client.GetStringAsync(endpoint + path);
                task.Wait();

                return task.Result;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine("\nException Caught!");
                Console.WriteLine("Message :{0} ",e.Message);

                return "error";
            }
        }

        public List<BybitSymbol> GetSymbols()
        {
            var task = GetSymbolsAsync();
            task.Wait();

            return task.Result;
        }

        public async Task<List<BybitSymbol>> GetSymbolsAsync()
        {
            // Getting info on all symbols
            var symbolData = await _bybitClient.UsdPerpetualApi.ExchangeData.GetSymbolsAsync();
            var list = symbolData.Data.ToList();

            return list;
        }


    }

}
