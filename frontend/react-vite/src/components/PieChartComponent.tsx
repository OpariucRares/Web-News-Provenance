import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

interface PieChartComponentProps {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A1",
  "#33FFF5",
  "#F5FF33",
  "#A133FF",
  "#FF8C33",
  "#33FF8C",
  "#8C33FF",
];

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data }) => {
  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const [colors, setColors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newColors = { ...colors };
    data.forEach((entry) => {
      if (!newColors[entry.name]) {
        newColors[entry.name] =
          COLORS[Object.keys(newColors).length % COLORS.length];
      }
    });
    setColors(newColors);
  }, [data]);

  const handleItemToggle = (item: string) => {
    setDisabledItems((prev) =>
      prev.includes(item) ? prev.filter((l) => l !== item) : [...prev, item]
    );
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const top9Data = sortedData.slice(0, 9);
  const othersData = sortedData.slice(9);
  const othersValue = othersData.reduce((acc, curr) => acc + curr.value, 0);

  const finalData =
    data.length > 10
      ? [...top9Data, { name: "Others", value: othersValue }].filter(
          (entry) => !disabledItems.includes(entry.name)
        )
      : sortedData.filter((entry) => !disabledItems.includes(entry.name));

  const displayedToggles = data.length > 10 ? top9Data : sortedData;

  return (
    <div className="row">
      <div className="col-md-8">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={finalData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {finalData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={colors[entry.name]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="col-md-4">
        <h4>Items</h4>
        <div className="form-group">
          {displayedToggles.map((entry) => (
            <div key={entry.name} className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id={`toggle-${entry.name}`}
                checked={!disabledItems.includes(entry.name)}
                onChange={() => handleItemToggle(entry.name)}
              />
              <label
                className="custom-control-label"
                htmlFor={`toggle-${entry.name}`}
              >
                {entry.name}
              </label>
            </div>
          ))}
          {data.length > 10 && (
            <div className="custom-control custom-switch">
              <input
                type="checkbox"
                className="custom-control-input"
                id="toggle-Others"
                checked={!disabledItems.includes("Others")}
                onChange={() => handleItemToggle("Others")}
              />
              <label className="custom-control-label" htmlFor="toggle-Others">
                Others
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
