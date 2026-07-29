import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const PieChartComponent = ({ data, title, description }) => {
  const [highchartsReady, setHighchartsReady] = useState(false);

  useEffect(() => {
    const initializeHighcharts = async () => {
      const exportingModule = await import("highcharts/modules/exporting");
      const exportDataModule = await import("highcharts/modules/export-data");
      const accessibilityModule = await import(
        "highcharts/modules/accessibility"
      );

      const safeInit = (mod) => {
        if (typeof mod === "function") mod(Highcharts);
        else if (mod && typeof mod.default === "function")
          mod.default(Highcharts);
      };

      safeInit(exportingModule);
      safeInit(exportDataModule);
      safeInit(accessibilityModule);

      setHighchartsReady(true);
    };

    initializeHighcharts();
  }, []);

const formattedData = Array.isArray(data)
  ? data
      .filter((item) => item && item.name && !isNaN(Number(item.y)))
      .map((item) => ({
        name: item.name,
        y: Number(item.y),
      }))
  : [];

  const options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },
    title: {
      text: title || "",
      style: {
        fontSize: "16px",
      },
      margin: 20,
    },
    subtitle: {
      text: description || "",
      align: "center",
      verticalAlign: "top",
      y: 30,
      style: {
        fontSize: "13px",
        color: "#666",
      },
    },
    exporting: { enabled: true },
    credits: { enabled: false },
    accessibility: { enabled: true },
    legend: {
      enabled: true, // Enable legend
      layout: "horizontal", // horizontal or vertical
      align: "center", // left, center, right
      verticalAlign: "bottom", // top, middle, bottom
      itemStyle: {
        fontSize: "12px",
        fontWeight: "normal",
        color: "#333",
      },
      itemHoverStyle: {
        color: "#000",
      },
      itemMarginTop: 5,
      itemMarginBottom: 5,
      symbolRadius: 0, // Square legend symbols
      symbolPadding: 5,
      borderWidth: 0, // Remove border
      backgroundColor: "transparent",
      floating: false, // Don't float over chart
      y: -10, // Adjust vertical position
      labelFormatter: function () {
    // Add value beside name in legend
    return `${this.name}: <b>${Highcharts.numberFormat(this.y, 0)}</b>`;
  },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: [
          {
            enabled: true,
            format: "<b>{point.name}</b>",
            distance: 15,
            style: { fontSize: "13px", color: "#000" },
          },
        ],
        center: ["50%", "45%"],
        size: "90%", 
        showInLegend: true, 
      },
    },
    series: [
      {
        name: "Value",
        colorByPoint: true,
        data: formattedData,
      },
    ],
  };

  if (!highchartsReady) return <div>Loading chart...</div>;

  return (
    <div
      style={{
        width: "100%",
        // height: "450px",
        margin: "auto",
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default PieChartComponent;
