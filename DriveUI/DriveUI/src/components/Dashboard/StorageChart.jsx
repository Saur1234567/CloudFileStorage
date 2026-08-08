import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { getFileMeta } from '../../utils/fileTypes';
import { formatBytes } from '../../utils/format';

export default function StorageChart({ files }) {
  const byType = {};
  files.forEach((f) => {
    byType[f.type] = (byType[f.type] || 0) + f.size;
  });
  const data = Object.entries(byType).map(([type, value]) => ({
    name: getFileMeta(type).label,
    value,
    color: getFileMeta(type).color
  }));

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="glass-panel p-5 flex flex-col">
      <p className="font-display font-semibold mb-1">Storage Breakdown</p>
      <p className="text-xs text-ink-faint mb-3">By file type across My Drive</p>
      <div className="flex items-center gap-4">
        <div className="w-36 h-36 shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatBytes(value)}
                contentStyle={{ background: '#12151d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-sm font-semibold">{formatBytes(total)}</span>
            <span className="text-[10px] text-ink-faint">total</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
              <span className="text-ink-muted flex-1 truncate">{d.name}</span>
              <span className="text-ink-faint">{formatBytes(d.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
