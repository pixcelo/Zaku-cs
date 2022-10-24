//const symbols = JSON.parse(tmpSymbols);
const ohlc = JSON.parse(tmpOhlc);

// https://docs.cryptowat.ch/rest-api/markets/ohlc
console.log('1min ', ohlc.result[60]);

// https://www.amcharts.com/demos/candlestick-chart/
am5.ready(function() {
    const root = am5.Root.new('chartdiv');
    root.setThemes([am5themes_Animated.new(root)]);

    function generateChartData(candles) {
        const chartData = [];

        for (let i = 0; i < candles.length; i++) {
            const candle = candles[i];
            chartData.push({
                date: candle[0],
                value: candle[4],
                open: candle[1],
                low: candle[3],
                high: candle[2]
            });
        }
        return chartData;
    }

    const data = generateChartData(ohlc.result[60]);

    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            focusable: true,
            panX: true,
            panY: true,
            wheelX: 'panX',
            wheelY: 'zoomX'
        })
    );

    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/
    const xAxis = chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            groupData: true,
            maxDeviation:0.5,
            baseInterval: { timeUnit: 'millisecond', count: 60 },
            renderer: am5xy.AxisRendererX.new(root, {pan:'zoom'}),
            tooltip: am5.Tooltip.new(root, {})
        })
    );

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            maxDeviation: 1,
            renderer: am5xy.AxisRendererY.new(root, {pan:'zoom'})
        })
    );

    const color = root.interfaceColors.get('background');

    const series = chart.series.push(
        am5xy.CandlestickSeries.new(root, {
            fill: color,
            calculateAggregates: true,
            stroke: color,
            name: 'MDXI',
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: 'value',
            openValueYField: 'open',
            lowValueYField: 'low',
            highValueYField: 'high',
            valueXField: 'date',
            lowValueYGrouped: 'low',
            highValueYGrouped: 'high',
            openValueYGrouped: 'open',
            valueYGrouped: 'close',
            legendValueText:
                'open: {openValueY} low: {lowValueY} high: {highValueY} close: {valueY}',
            legendRangeValueText: '{valueYClose}',
            tooltip: am5.Tooltip.new(root, {
                pointerOrientation: 'horizontal',
                labelText: 'open: {openValueY}\nlow: {lowValueY}\nhigh: {highValueY}\nclose: {valueY}'
            })
        })
    );

    const cursor = chart.set(
        'cursor',
        am5xy.XYCursor.new(root, {
            xAxis: xAxis
        })
    );
    cursor.lineY.set('visible', false);

    chart.leftAxesContainer.set('layout', root.verticalLayout);

    const scrollbar = am5xy.XYChartScrollbar.new(root, {
        orientation: 'horizontal',
        height: 50
    });
    chart.set('scrollbarX', scrollbar);

    const sbxAxis = scrollbar.chart.xAxes.push(
        am5xy.DateAxis.new(root, {
            groupData: true,
            groupIntervals: [{ timeUnit: 'week', count: 1 }],
            baseInterval: { timeUnit: 'day', count: 1 },
            renderer: am5xy.AxisRendererX.new(root, {
                opposite: false,
                strokeOpacity: 0
            })
        })
    );

    const sbyAxis = scrollbar.chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    const sbseries = scrollbar.chart.series.push(
        am5xy.LineSeries.new(root, {
            xAxis: sbxAxis,
            yAxis: sbyAxis,
            valueYField: 'value',
            valueXField: 'date'
        })
    );

    const legend = yAxis.axisHeader.children.push(am5.Legend.new(root, {}));
    legend.data.push(series);
    legend.markers.template.setAll({
        width: 10
    });

    legend.markerRectangles.template.setAll({
        cornerRadiusTR: 0,
        cornerRadiusBR: 0,
        cornerRadiusTL: 0,
        cornerRadiusBL: 0
    });

    series.data.setAll(data);
    sbseries.data.setAll(data);

    series.appear(1000);
    chart.appear(1000, 100);

    // Events
    series.columns.template.events.on('click', function(ev) {
        console.log('Clicked on a column', ev.target);
    });

});
