using System;

namespace Zaku
{
    public class Ohlc
    {
        public long CloseTime { get; set; }
        public float OpenPrice { get; set; }
        public float HighPrice { get; set; }
        public float LowPrice { get; set; }
        public float ClosePrice { get; set; }
        public float Volume { get; set; }
        public float QuoteVolume { get; set; }
    }
}
