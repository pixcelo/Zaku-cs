using Bybit.Net.Clients;
using Bybit.Net.Objects;
using Bybit.Net.Objects.Models;
using CryptoExchange.Net.Authentication;
using CryptoExchange.Net.Objects;

namespace Zaku
{
    public class FetchService
    {
        private BybitClient _bybitClient;

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
