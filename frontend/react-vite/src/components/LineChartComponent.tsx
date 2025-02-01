import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
  ReferenceLine,
} from "recharts";

interface LineChartComponentProps {
  data: { year: number; count: number }[];
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data }) => {
  const [domain, setDomain] = useState<[number, number] | undefined>(undefined);

  const handleZoom = (newIndex: { startIndex?: number; endIndex?: number }) => {
    if (newIndex.startIndex !== undefined && newIndex.endIndex !== undefined) {
      const newDomain: [number, number] = [
        data[newIndex.startIndex].year,
        data[newIndex.endIndex].year,
      ];
      setDomain(newDomain);
    }
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="year" domain={domain} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Brush
          dataKey="year"
          height={30}
          stroke="#8884d8"
          onChange={handleZoom}
        />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
        {domain && <ReferenceLine x={domain[0]} stroke="red" />}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
