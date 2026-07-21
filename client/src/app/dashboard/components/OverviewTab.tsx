import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck, AlertTriangle, AlertOctagon, Trash2 } from 'lucide-react';

interface OverviewTabProps {
  scans: any[];
  setActiveHistoryScan: (scan: any) => void;
  setActiveTab: (tab: any) => void;
  handleDeleteScan: (id: string, e: React.MouseEvent) => void;
}

export default function OverviewTab({ scans, setActiveHistoryScan, setActiveTab, handleDeleteScan }: OverviewTabProps) {
  const totalScansCount = scans.length;
  const safeScansCount = scans.filter((s) => s.riskLevel === 'Safe').length;
  const cautionScansCount = scans.filter((s) => s.riskLevel === 'Caution').length;
  const unsafeScansCount = scans.filter((s) => s.riskLevel === 'Unsafe').length;

  const pieData = [
    { name: 'Safe', value: safeScansCount, color: '#10b981' },
    { name: 'Caution', value: cautionScansCount, color: '#f59e0b' },
    { name: 'Unsafe', value: unsafeScansCount, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
        {[
          { title: 'Total Foods Scanned', value: totalScansCount, color: 'var(--primary)', icon: <Activity size={20} /> },
          { title: 'Safe Products', value: safeScansCount, color: '#10b981', icon: <ShieldCheck size={20} /> },
          { title: 'Caution Flagged', value: cautionScansCount, color: '#f59e0b', icon: <AlertTriangle size={20} /> },
          { title: 'Unsafe (Avoid)', value: unsafeScansCount, color: '#ef4444', icon: <AlertOctagon size={20} /> },
        ].map((card, i) => (
          <div
            key={i}
            className="glow-card"
            style={{
              padding: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(248,250,252,0.5)', marginBottom: 8 }}>
                {card.title}
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>{card.value}</div>
            </div>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: `${card.color}15`,
                border: `1px solid ${card.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
              }}
            >
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
        {/* Pie Chart Card */}
        <div className="glow-card" style={{ padding: 24, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'white' }}>Safety Distribution</h3>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {totalScansCount === 0 ? (
              <span style={{ color: 'rgba(248,250,252,0.4)', fontSize: 14 }}>No data. Perform a scan first!</span>
            ) : (
              <div style={{ width: '100%', height: 220, position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 16,
                    fontSize: 12,
                  }}
                >
                  {pieData.map((entry, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: entry.color }} />
                      <span style={{ color: 'rgba(248,250,252,0.6)' }}>
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Scans list */}
        <div className="glow-card" style={{ padding: 24, minHeight: 320, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'white' }}>Recent Scans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, overflowY: 'auto' }}>
            {scans.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <span style={{ color: 'rgba(248,250,252,0.4)', fontSize: 14 }}>No scans logged yet.</span>
              </div>
            ) : (
              scans.slice(0, 4).map((scan) => (
                <div
                  key={scan._id}
                  onClick={() => {
                    setActiveHistoryScan(scan);
                    setActiveTab('history');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  className="recent-scan-item"
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>
                      {scan.riskLevel === 'Safe' ? '🟢' : scan.riskLevel === 'Caution' ? '🟡' : '🔴'}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>{scan.productName}</div>
                      <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>
                        {new Date(scan.scannedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: scan.riskLevel === 'Safe' ? '#10b981' : scan.riskLevel === 'Caution' ? '#f59e0b' : '#ef4444',
                      }}
                    >
                      Score: {scan.safetyScore}
                    </div>
                    <button
                      onClick={(e) => handleDeleteScan(scan._id, e)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(248,250,252,0.3)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
