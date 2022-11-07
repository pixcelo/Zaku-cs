using System.Text.Json;

namespace Zaku
{
    public class JsonService
    {
        private readonly string _filePath;

        public JsonService(string filePath)
        {
            this._filePath = filePath;
        }

        /// <summary>
        /// Deserialize Json to .NET Object
        /// </summary>
        /// <returns></returns>
        public List<Candle> SerializeBasicModel()
        {
            var candles = JsonSerializer.Deserialize<List<Candle>>(this._filePath);

            return candles;
        }

    }
}
