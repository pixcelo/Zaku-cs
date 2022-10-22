using System;

namespace Zaku
{
    public class ResponseCandles
    {
        public string Result { get; set; }
        public int Period { get; set; }
        public List<Ohlc> list { get; set; }
    }
}
