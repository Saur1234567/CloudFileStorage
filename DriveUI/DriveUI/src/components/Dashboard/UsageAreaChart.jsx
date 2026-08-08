import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const data = [
  { day: 'Mon', gb: 5.8 },
  { day: 'Tue', gb: 6.1 },
  { day: 'Wed', gb: 6.4 },
  { day: 'Thu', gb: 7.0 },
  { day: 'Fri', gb: 7.6 },
  { day: 'Sat', gb: 8.1 },
  { day: 'Sun', gb: 8.6 }
];

export default function UsageAreaChart() {
  return (
    <div className="glass-panel p-5">
      <p className="font-display font-semibold mb-1">Storage Growth</p>
      <p className="text-xs text-ink-faint mb-4">GB used over the last 7 days</p>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 10, top: 5 }}>
            <defs>
              <linearGradient id="usageFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b7cfa" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#43d9c8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#9aa0ac', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#9aa0ac', fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              formatter={(v) => [`${v} GB`, 'Used']}
              contentStyle={{ background: '#12151d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
            />
            <Area type="monotone" dataKey="gb" stroke="#8b7cfa" strokeWidth={2} fill="url(#usageFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
