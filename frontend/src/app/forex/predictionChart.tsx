import ForexProvider , {ForexContext} from "./forex.context";
import { useContext , useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PredictionChart()
{
  const {forex,historical, setHistorical}= useContext(ForexContext)!;
  const chartData = useMemo(()=> {
 const data =historical.map(d => ({
  date: new Date(d.date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric"
  }),
  close: d.close.toFixed(2)
}));
const last =historical.at(-1);
if(last)
{
  data.push({
  date: "Prediction",
  close: historical[historical.length-1].close
});
}
return data;
 } , [historical]
  );
  return(
<ResponsiveContainer width="100%" height={400}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />

    <XAxis dataKey="date" />

    <YAxis
      domain={['dataMin - 50', 'dataMax + 50']}
    />

    <Tooltip />

    <Line
      type="monotone"
      dataKey="close"
      stroke="#2563eb"
      strokeWidth={2}
      dot={{ r: 3 }}
    />
  </LineChart>
</ResponsiveContainer>);

}