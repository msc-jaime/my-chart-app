// components/MyChart.js
import React from 'react';
import { ComposedChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const data = [
  { name: 'Page A', uv: 400, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 300, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 200, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 278, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 189, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 239, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 349, pv: 4300, amt: 2100 },
];

const styleAxis = { fontSize: '18px', fontWeight: 'bold',fill: 'rgb(22, 22, 22)' }

const MyChart = () => (
  <div style={{ display: 'inline-block', width: 800, height: 400}}>
    <h1>Title page</h1>
    <ComposedChart width={800} height={400} data={data} margin={{ top: 20, left: 10, right: 20, bottom: 20 }}>
        <CartesianGrid stroke="#ccc" strokeWidth={1.5}/>
        <Line type="monotone"  isAnimationActive={false} dataKey="uv" stroke="#8884d8" strokeWidth={2}/>
        <Line type="monotone"  isAnimationActive={false} dataKey="pv" stroke="#8800d8" strokeWidth={2}/>
        <Line type="monotone"  isAnimationActive={false} dataKey="amt" stroke="#888400" strokeWidth={2} />
        
        <XAxis dataKey="name" angle={-35} textAnchor="end" height={60}
          style={styleAxis}/>
        <YAxis style={styleAxis}/>
    </ComposedChart>
    <p>Data</p>
  </div>
);

export default MyChart;