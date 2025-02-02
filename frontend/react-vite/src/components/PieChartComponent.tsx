import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PieChartComponentProps {
  data: { name: string; value: number }[];
  title: string;
}

const COLORS = [
  "#F6BDCB",
  "#7AA7D1",
  "#F8A458",
  "#39716C",
  "#9C93BD",
  "#B6D4B3",
  "#856050",
  "#86C4BE",
  "#45516E",
  "#C44046",
];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  fill,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
  fill: string;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20; // Increase the radius for more space
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={fill} // Use the fill color for the label
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "12px" }}
    >
      {`${name}: ${(percent * 100).toFixed(2)}%`}
    </text>
  );
};

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
}) => {
  const [disabledItems, setDisabledItems] = useState<string[]>([]);
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

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

  useEffect(() => {
    const newColorMap = { ...colorMap };
    finalData.forEach((entry, index) => {
      if (!newColorMap[entry.name]) {
        newColorMap[entry.name] = COLORS[index % COLORS.length];
      }
    });
    setColorMap(newColorMap);
  }, [data]);

  const displayedToggles = data.length > 10 ? top9Data : sortedData;

  // Calculate dynamic width based on the number of labels
  const minWidth = Math.max(400, 200 + displayedToggles.length * 50);

  return (
    <div className="row">
      <div className="col-md-8">
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: `${minWidth}px` }}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={finalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius="60%"
                  fill="#8884d8"
                  dataKey="value"
                  label={({ ...props }) =>
                    renderCustomizedLabel({
                      ...props,
                      fill: colorMap[props.name],
                    })
                  }
                >
                  {finalData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={colorMap[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <h4>{title}</h4>
        <div className="form-group">
          <div className="row">
            {displayedToggles.map((entry) => (
              <div key={entry.name} className="col-6 col-sm-6 col-md-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`toggle-${entry.name}`}
                    checked={!disabledItems.includes(entry.name)}
                    onChange={() => handleItemToggle(entry.name)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`toggle-${entry.name}`}
                  >
                    {entry.name}
                  </label>
                </div>
              </div>
            ))}
            {data.length > 10 && (
              <div className="col-6 col-sm-6 col-md-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="toggle-Others"
                    checked={!disabledItems.includes("Others")}
                    onChange={() => handleItemToggle("Others")}
                  />
                  <label className="form-check-label" htmlFor="toggle-Others">
                    Others
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;
