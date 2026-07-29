import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BarGraphComponent = ({ data, title, description }) => {
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

  const categories = data?.map((item) => item.label) || [];
  const seriesData = data?.map((item) => item.value) || [];

  const options = {
    chart: {
      type: "column", // 'column' is for vertical bar chart
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
    xAxis: {
      categories: categories,
      title: {
        text: null,
      },
      crosshair: true,
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: "Values",
        style: {
          fontSize: "12px",
        },
      },
      labels: {
        style: {
          fontSize: "11px",
        },
      },
    },
    exporting: { enabled: true },
    credits: { enabled: false },
    accessibility: { enabled: true },
    legend: {
      enabled: false,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: "{y}",
          style: {
            fontSize: "11px",
            fontWeight: "normal",
            color: "#000",
          },
        },
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    series: [
      {
        name: "Value",
        data: seriesData,
        color: "#3b82f6", // Blue color
      },
    ],
  };

  if (!highchartsReady) return <div>Loading chart...</div>;

  return (
    <div
      style={{
        width: "100%",
        height: "400px",
        margin: "auto",
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarGraphComponent;
