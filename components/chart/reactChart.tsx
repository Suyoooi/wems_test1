import styled from "styled-components";
import { Line } from "react-chartjs-2";
import { CategoryScale, ChartData } from "chart.js";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options: any = {
  maintainAspectRatio: false,
  spanGaps: true,
  maxBarThickness: 30,
  grouped: true,
  layout: {
    padding: {
      left: 10,
      right: 25,
      top: 25,
      bottom: 10,
    },
  },
  scales: {
    xAxes: [
      {
        time: {
          unit: "date",
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 12,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          min: -0.05,
          max: 0.05,
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2],
        },
      },
    ],
  },
  plugins: {
    legend: {
      display: false,
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 10,
        width: 10,
        font: {
          family: "'Noto Sans KR', 'serif'",
          lineHeight: 1,
        },
      },
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: "#6e707e",
      titleFontSize: 14,
      borderColor: "#dddfeb",
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: "index",
      caretPadding: 10,
      callbacks: {
        label: function (tooltipItem: any, chart: any) {
          var datasetLabel =
            chart.datasets[tooltipItem.datasetIndex].label || "";
          return datasetLabel + ": " + tooltipItem.yLabel;
        },
      },
    },
  },
};

type ReactChartProps = {
  labels: string[];
  datasets: any[];
};

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  gap: 5px;
  max-height: 80px;
  overflow-y: auto;
  padding-left: 10px;
  padding-right: 10px;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const ReactChart: React.FC<ReactChartProps> = ({ labels, datasets }) => {
  const data: ChartData<"line"> = {
    labels: labels,
    datasets: datasets,
  };

  const legendItems = datasets.map((dataset) => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: 50,
            marginRight: 5,
            backgroundColor: dataset.borderColor,
          }}
        ></div>
        <span>{dataset.label}</span>
      </div>
    );
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%", height: 420 }}>
        <Line data={data} options={options} />
        <LegendContainer>{legendItems}</LegendContainer>
      </div>
    </div>
  );
};

export default ReactChart;
