import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const StackedBarGraph = ({ data, title, description, yAxisTitle, seriesConfig }) => {
  const [highchartsReady, setHighchartsReady] = useState(false);

  useEffect(() => {
    const initializeHighcharts = async () => {
      const exportingModule = await import("highcharts/modules/exporting");
      const exportDataModule = await import("highcharts/modules/export-data");
      const accessibilityModule = await import("highcharts/modules/accessibility");

      const safeInit = (mod) => {
        if (typeof mod === "function") mod(Highcharts);
        else if (mod && typeof mod.default === "function") mod.default(Highcharts);
      };

      safeInit(exportingModule);
      safeInit(exportDataModule);
      safeInit(accessibilityModule);

      setHighchartsReady(true);
    };

    initializeHighcharts();
  }, []);

  // ✅ Extract categories and prepare dynamic series
  const categories = data?.map((item) => item.category) || [];

  const dynamicSeries =
    seriesConfig?.map((series) => ({
      name: series.name,
      color: series.color,
      data: data.map((item) => Number(item[series.key]) || 0),
    })) || [];

  const options = {
    chart: {
      type: "column",
      backgroundColor: "transparent",
    },
    title: {
      text: title || "",
      style: { fontSize: "16px" },
    },
    subtitle: {
      text: description || "",
      style: { fontSize: "13px", color: "#666" },
    },
    xAxis: {
      categories,
      labels: { style: { fontSize: "12px" } },
    },
    yAxis: {
      min: 0,
      title: {
        text: yAxisTitle || "Value",
        style: { fontSize: "12px" },
      },
      stackLabels: {
        enabled: true,
        formatter: function () {
          return this.total.toFixed(2);
        },
        style: {
          fontWeight: "bold",
          color: "black",
          fontSize: "11px",
        },
      },
    },
    legend: {
      align: "center",
      verticalAlign: "bottom",
      itemStyle: { fontSize: "12px" },
    },
    tooltip: {
      pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
    },
    plotOptions: {
      column: {
        stacking: "normal",
        borderWidth: 0,
      },
      series: {
        borderRadius: 3,
      },
    },
    exporting: { enabled: true },
    credits: { enabled: false },
    series: dynamicSeries,
  };

  if (!highchartsReady) return <div>Loading chart...</div>;

  return (
    <div style={{ width: "100%", height: "400px", margin: "auto" }}>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default StackedBarGraph;
