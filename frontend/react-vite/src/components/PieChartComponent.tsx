import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface DataEntry {
  [key: string]: string | number;
  name: string;
  value: number;
}

interface PieChartComponentProps {
  data: DataEntry[];
  title: string;
  dataKey?: string;
  nameKey?: string;
  chartId?: string;
}

const COLORS = [
  "#4E79A7", // Strong blue
  "#F28E2B", // Strong orange
  "#E15759", // Strong red
  "#76B7B2", // Strong teal
  "#59A14F", // Strong green
  "#EDC948", // Strong yellow
  "#B07AA1", // Strong purple
  "#FF9DA7", // Light red
  "#9C755F", // Brown
  "#BAB0AC", // Grey
];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
  dataKey = "value",
  nameKey = "name",
  chartId,
}) => {
  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

  const handleItemToggle = (item: string) => {
    setDisabledItems((prev) =>
      prev.includes(item) ? prev.filter((l) => l !== item) : [...prev, item]
    );
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const topData = sortedData.slice(0, 10);

  useEffect(() => {
    const newColorMap: { [key: string]: string } = {};
    topData.forEach((entry, index) => {
      newColorMap[entry[nameKey] as string] = COLORS[index % COLORS.length];
    });
    setColorMap(newColorMap);
  }, [data]);

  const finalData = topData.filter(
    (entry) => !disabledItems.includes(entry[nameKey] as string)
  );

  return (
    <div
      id={chartId}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
      vocab="http://schema.org/"
      typeof="Dataset"
    >
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={finalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ percent, name }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {finalData.map((entry) => (
                <Cell
                  key={`cell-${entry[nameKey] as string}`}
                  fill={colorMap[entry[nameKey] as string]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          paddingLeft: "20px",
          overflowY: "auto",
          marginTop: "20px",
        }}
      >
        <h4 property="name" style={{ textAlign: "center" }}>
          {title}
        </h4>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {topData.map((entry) => (
            <li key={entry[nameKey] as string} style={{ marginBottom: "10px" }}>
              <input
                type="checkbox"
                checked={!disabledItems.includes(entry[nameKey] as string)}
                onChange={() => handleItemToggle(entry[nameKey] as string)}
                style={{ marginRight: "5px" }}
              />
              <span
                style={{
                  color: colorMap[entry[nameKey] as string],
                  fontWeight: "bold",
                }}
                property="name"
              >
                {entry[nameKey]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChartComponent;
