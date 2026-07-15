import React from 'react';
import { Loader2, History as HistoryIcon, Eye, Trash2, X, AlertOctagon } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface HistoryTabProps {
  loadingHistory: boolean;
  scans: any[];
  activeHistoryScan: any | null;
  setActiveHistoryScan: (scan: any | null) => void;
  handleDeleteScan: (id: string, e: React.MouseEvent) => void;
  getRadarData: (result: any) => any[];
}

export default function HistoryTab({
  loadingHistory,
  scans,
  activeHistoryScan,
  setActiveHistoryScan,
  handleDeleteScan,
  getRadarData,
}: HistoryTabProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {loadingHistory && scans.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
          <Loader2 size={30} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      ) : scans.length === 0 ? (
        <div
          className="glow-card"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: 'rgba(248,250,252,0.4)',
          }}
        >
          <HistoryIcon size={44} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h4 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
            No Scans Logged
          </h4>
          <p style={{ fontSize: 13, maxWidth: 300, margin: '0 auto' }}>
            Your analyzed labels will show up here. Go to the Label Scanner tab to generate your first safety report.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {scans.map((scan) => (
            <div
              key={scan._id}
              onClick={() => setActiveHistoryScan(scan)}
              className="glow-card"
              style={{
                padding: 20,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span
                    className={
                      scan.riskLevel === 'Safe'
                        ? 'badge-safe'
                        : scan.riskLevel === 'Caution'
                          ? 'badge-caution'
                          : 'badge-danger'
                    }
                    style={{
                      padding: '3px 10px',
                      borderRadius: 50,
                      fontSize: 10,
                      fontWeight: 800,
                    }}
                  >
                    {scan.riskLevel.toUpperCase()}
                  </span>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(248,250,252,0.4)' }}>
                    Score: {scan.safetyScore}
                  </div>
                </div>

                <h4 style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                  {scan.productName}
                </h4>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(248,250,252,0.45)',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.5,
                    marginBottom: 16,
                  }}
                >
                  {scan.personalizedExplanation}
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid rgba(255,255,255,0.04)',
                  paddingTop: 12,
                  fontSize: 11,
                  color: 'rgba(248,250,252,0.4)',
                }}
              >
                <span>{new Date(scan.scannedAt).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHistoryScan(scan);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#22d3ee',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteScan(scan._id, e)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Detail Modal Popup */}
      {activeHistoryScan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            className="glass"
            style={{
              width: '100%',
              maxWidth: 580,
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: 24,
              padding: 32,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setActiveHistoryScan(null)}
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span
                className={
                  activeHistoryScan.riskLevel === 'Safe'
                    ? 'badge-safe'
                    : activeHistoryScan.riskLevel === 'Caution'
                      ? 'badge-caution'
                      : 'badge-danger'
                }
                style={{
                  padding: '4px 12px',
                  borderRadius: 50,
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {activeHistoryScan.riskLevel.toUpperCase()}
              </span>
              <h4 style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>
                {activeHistoryScan.productName}
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 12 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 50,
                    border: `3px solid ${activeHistoryScan.riskLevel === 'Safe' ? '#10b981' : activeHistoryScan.riskLevel === 'Caution' ? '#f59e0b' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 15,
                    color: 'white',
                    background: 'rgba(0,0,0,0.3)',
                  }}
                >
                  {activeHistoryScan.safetyScore}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'white' }}>Safety Score</div>
                  <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)' }}>
                    Computed against matching medical conditions
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(248, 250, 252, 0.4)', marginBottom: 6 }}>
                  Verdict Explanation
                </div>
                <p style={{ fontSize: 14, color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.6 }}>
                  {activeHistoryScan.personalizedExplanation}
                </p>
              </div>

              {activeHistoryScan.harmfulIngredients && activeHistoryScan.harmfulIngredients.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertOctagon size={14} /> Flagged Ingredients
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {activeHistoryScan.harmfulIngredients.map((ing: string, idx: number) => (
                      <span
                        key={idx}
                        style={{
                          padding: '3px 10px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeHistoryScan.nutritionFacts && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(248, 250, 252, 0.4)', marginBottom: 8 }}>
                    Nutrition Radar
                  </div>
                  <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(activeHistoryScan)}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis dataKey="name" stroke="rgba(248,250,252,0.4)" fontSize={9} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="rgba(255,255,255,0.08)" />
                        <Radar
                          name="Nutrition"
                          dataKey="val"
                          stroke="var(--primary)"
                          fill="var(--primary)"
                          fillOpacity={0.25}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 16 }}>
                <span>Scanned on: {new Date(activeHistoryScan.scannedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
