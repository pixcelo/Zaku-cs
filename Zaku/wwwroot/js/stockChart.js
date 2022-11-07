//const symbols = JSON.parse(tmpSymbols);
const ohlc = JSON.parse(tmpOhlc);

// https://docs.cryptowat.ch/rest-api/markets/ohlc
console.log('1min ', ohlc.result[60]);

// https://codepen.io/team/amcharts/pen/QWaZNjZ
const root = am5.Root.new('chartdiv');
root.setThemes([
    am5themes_Animated.new(root)
]);

const stockChart = root.container.children.push(
    am5stock.StockChart.new(root, {
}));

root.numberFormatter.set('numberFormat', '#,###.00');

const mainPanel = stockChart.panels.push(am5stock.StockPanel.new(root, {
    wheelY: 'zoomX',
    panX: true,
    panY: true,
    height: am5.percent(70)
}));

const valueAxis = mainPanel.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {
        pan: 'zoom'
    }),
    tooltip: am5.Tooltip.new(root, {}),
    numberFormat: '#,###.00',
    extraTooltipPrecision: 2
}));

const dateAxis = mainPanel.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
        timeUnit: 'millisecond',
        count: 60
    },
    groupData: true,
    renderer: am5xy.AxisRendererX.new(root, {}),
    tooltip: am5.Tooltip.new(root, {})
}));

const valueSeries = mainPanel.series.push(am5xy.CandlestickSeries.new(root, {
    name: 'BTCUSDT',
    valueXField: 'Date',
    valueYField: 'Close',
    highValueYField: 'High',
    lowValueYField: 'Low',
    openValueYField: 'Open',
    calculateAggregates: true,
    xAxis: dateAxis,
    yAxis: valueAxis,
    legendValueText: '{valueY}'
}));

stockChart.set('stockSeries', valueSeries);

const valueLegend = mainPanel.plotContainer.children.push(am5stock.StockLegend.new(root, {
    stockChart: stockChart
}));
valueLegend.data.setAll([valueSeries]);

mainPanel.set('cursor', am5xy.XYCursor.new(root, {
    yAxis: valueAxis,
    xAxis: dateAxis,
    snapToSeries: [valueSeries],
    snapToSeriesBy: 'y!'
}));

const scrollbar = mainPanel.set('scrollbarX', am5xy.XYChartScrollbar.new(root, {
    orientation: 'horizontal',
    height: 50
}));
stockChart.toolsContainer.children.push(scrollbar);

const sbDateAxis = scrollbar.chart.xAxes.push(am5xy.GaplessDateAxis.new(root, {
    baseInterval: {
        timeUnit: 'day',
        count: 1
    },
    renderer: am5xy.AxisRendererX.new(root, {})
}));

const sbValueAxis = scrollbar.chart.yAxes.push(am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
}));

const sbSeries = scrollbar.chart.series.push(am5xy.LineSeries.new(root, {
    valueYField: 'Close',
    valueXField: 'Date',
    xAxis: sbDateAxis,
    yAxis: sbValueAxis
}));

sbSeries.fills.template.setAll({
    visible: true,
    fillOpacity: 0.3
});

function generateChartData(candles) {
    const chartData = [];

    for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];
        chartData.push({
            Date: candle[0],
            Open: candle[1],
            High: candle[2],
            Low: candle[3],
            Close: candle[4],
        });
    }
    return chartData;
}

const data = generateChartData(ohlc.result[60]);
valueSeries.data.setAll(data);

// https://www.amcharts.com/docs/v5/reference/drawingcontrol/#Settings
const toolbar = am5stock.StockToolbar.new(root, {
    container: document.getElementById('chartcontrols'),
    stockChart: stockChart,
    controls: [
        am5stock.DrawingControl.new(root, {
            stockChart: stockChart,
        }),
        am5stock.ResetControl.new(root, {
            stockChart: stockChart
        }),
        am5stock.SettingsControl.new(root, {
            stockChart: stockChart
        })
    ]
});
