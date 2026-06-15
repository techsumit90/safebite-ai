"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth, HealthProfile } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Radar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts';
import {
  User as UserIcon, LogOut, Camera, Upload, AlertTriangle, ShieldCheck,
  Activity, History as HistoryIcon, UserCog, Loader2, Sparkles, Trash2, Eye, RefreshCw, X, AlertOctagon, Heart, HeartCrack
} from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading, logout, updateProfile } = useAuth();
  const router = useRouter();

  // Navigation
  const [activeTab, setActiveTab] = useState<'overview' | 'scan' | 'history' | 'profile'>('overview');

  // Loading states
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Data states
  const [scans, setScans] = useState<any[]>([]);
  const [profileForm, setProfileForm] = useState<HealthProfile>({
    diabetes: false,
    highBloodPressure: false,
    heartDisease: false,
    obesity: false,
    lactoseIntolerance: false,
    kidneyDisease: false,
    highCholesterol: false,
    glutenIntolerance: false,
    allergies: [],
    otherRestrictions: '',
  });

  // Scanner States
  const [ingredientsText, setIngredientsText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [activeHistoryScan, setActiveHistoryScan] = useState<any | null>(null);

  // Allergy Input Temp State
  const [allergyInput, setAllergyInput] = useState('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Load Scan History and Sync Profile Form
  useEffect(() => {
    if (user) {
      setProfileForm({
        diabetes: user.healthProfile?.diabetes || false,
        highBloodPressure: user.healthProfile?.highBloodPressure || false,
        heartDisease: user.healthProfile?.heartDisease || false,
        obesity: user.healthProfile?.obesity || false,
        lactoseIntolerance: user.healthProfile?.lactoseIntolerance || false,
        kidneyDisease: user.healthProfile?.kidneyDisease || false,
        highCholesterol: user.healthProfile?.highCholesterol || false,
        glutenIntolerance: user.healthProfile?.glutenIntolerance || false,
        allergies: user.healthProfile?.allergies || [],
        otherRestrictions: user.healthProfile?.otherRestrictions || '',
      });
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get('/api/scans');
      setScans(res.data);
    } catch (err) {
      console.error('Error fetching scan history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--background)',
          color: 'white',
          gap: 16,
        }}
      >
        <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)' }} />
        <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255, 255, 255, 0.6)' }}>
          Loading your dashboard...
        </span>
      </div>
    );
  }

  // --- Health Profile Handlers ---
  const handleCheckboxChange = (field: keyof HealthProfile) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleAddAllergy = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && allergyInput.trim()) {
      e.preventDefault();
      if (!profileForm.allergies?.includes(allergyInput.trim())) {
        setProfileForm((prev) => ({
          ...prev,
          allergies: [...(prev.allergies || []), allergyInput.trim()],
        }));
      }
      setAllergyInput('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setProfileForm((prev) => ({
      ...prev,
      allergies: (prev.allergies || []).filter((a) => a !== allergy),
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProfile(true);
    try {
      await updateProfile(profileForm);
      alert('Health profile saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error updating health profile');
    } finally {
      setSubmittingProfile(false);
    }
  };

  // --- Scanner / Image Upload Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const uri = URL.createObjectURL(file);
      setPreviewUri(uri);
    }
  };

  const startCamera = async () => {
    setCameraActive(true);
    setPreviewUri(null);
    setSelectedFile(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error starting camera:', err);
      alert('Could not open camera. Please use file upload.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured_scan.jpg', { type: 'image/jpeg' });
            setSelectedFile(file);
            const uri = URL.createObjectURL(blob);
            setPreviewUri(uri);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const triggerAnalyze = async () => {
    if (!selectedFile && !ingredientsText.trim()) {
      alert('Please upload/capture a label or paste ingredients text.');
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (ingredientsText) {
      formData.append('ingredientsText', ingredientsText);
    }

    try {
      const res = await axios.post('/api/scans/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(res.data.scan);
      fetchHistory(); // refresh history list
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Error occurred during food analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDeleteScan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this scan report?')) return;
    try {
      await axios.delete(`/api/scans/${id}`);
      setScans((prev) => prev.filter((s) => s._id !== id));
      if (activeHistoryScan?._id === id) setActiveHistoryScan(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete scan record');
    }
  };

  // --- Statistics Helpers ---
  const totalScansCount = scans.length;
  const safeScansCount = scans.filter((s) => s.riskLevel === 'Safe').length;
  const cautionScansCount = scans.filter((s) => s.riskLevel === 'Caution').length;
  const unsafeScansCount = scans.filter((s) => s.riskLevel === 'Unsafe').length;

  const pieData = [
    { name: 'Safe', value: safeScansCount, color: '#10b981' },
    { name: 'Caution', value: cautionScansCount, color: '#f59e0b' },
    { name: 'Unsafe', value: unsafeScansCount, color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Map scan report nutrition facts to radar format
  const getRadarData = (scanItem: any) => {
    if (!scanItem || !scanItem.nutritionFacts) return [];
    const nf = scanItem.nutritionFacts;

    // Helper to extract numeric values from strings (like "500mg" or "12g")
    const getNum = (val: any) => {
      if (!val) return 0;
      if (typeof val === 'number') return val;
      const match = val.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    return [
      { name: 'Calories', val: Math.min(100, (getNum(nf.calories) / 500) * 100) },
      { name: 'Fat', val: Math.min(100, (getNum(nf.fat) / 30) * 100) },
      { name: 'Saturated Fat', val: Math.min(100, (getNum(nf.saturatedFat) / 10) * 100) },
      { name: 'Sodium', val: Math.min(100, (getNum(nf.sodium) / 1000) * 100) },
      { name: 'Carbs', val: Math.min(100, (getNum(nf.carbohydrates) / 100) * 100) },
      { name: 'Sugar', val: Math.min(100, (getNum(nf.sugar) / 50) * 100) },
      { name: 'Protein', val: Math.min(100, (getNum(nf.protein) / 40) * 100) },
    ];
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020817' }}>
      {/* Sidebar Navigation */}
      <aside
        style={{
          width: 260,
          background: 'rgba(255,255,255,0.01)',
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, padding: '0 8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: 'white',
            }}
          >
            S
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, color: '#fff' }}>SafeBite AI</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
            { id: 'scan', label: 'Scan Food Label', icon: <Camera size={18} /> },
            { id: 'history', label: 'Scan History', icon: <HistoryIcon size={18} /> },
            { id: 'profile', label: 'Health Profile', icon: <UserCog size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id !== 'scan') stopCamera();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 12,
                border: 'none',
                background: activeTab === tab.id ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: activeTab === tab.id ? '#a5b4fc' : 'rgba(248, 250, 252, 0.6)',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(248, 250, 252, 0.6)';
                }
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        {/* User Card */}
        <div
          style={{
            marginTop: 'auto',
            padding: '16px 8px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 50,
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a5b4fc',
              }}
            >
              <UserIcon size={16} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'white', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(248,250,252,0.4)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(248, 250, 252, 0.4)',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 8,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.background = 'rgba(239,68,68,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(248, 250, 252, 0.4)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: '100vh', position: 'relative' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: 'white' }}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'scan' && 'Label Scanner'}
              {activeTab === 'history' && 'Scan History'}
              {activeTab === 'profile' && 'Health Profile'}
            </h1>
            <p style={{ color: 'rgba(248,250,252,0.5)', fontSize: 14, marginTop: 4 }}>
              {activeTab === 'overview' && 'Overview of your dietary safety logs and trends'}
              {activeTab === 'scan' && 'Scan ingredients using OCR to check compliance'}
              {activeTab === 'history' && 'Browse, inspect, and delete your past scans'}
              {activeTab === 'profile' && 'Define health conditions, allergies, and exclusions'}
            </p>
          </div>
          {activeTab === 'overview' && (
            <button
              onClick={() => setActiveTab('scan')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <Sparkles size={16} /> Scan New Product
            </button>
          )}
        </header>

        {/* ─── TAB 1: OVERVIEW ────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
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
        )}

        {/* ─── TAB 2: LABEL SCANNER ───────────────────────────────────────── */}
        {activeTab === 'scan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
              {/* Scan inputs */}
              <div className="glow-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Input Media</h3>

                {/* Upload Section */}
                {!cameraActive && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(99,102,241,0.25)',
                      borderRadius: 16,
                      padding: '40px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: 'rgba(99,102,241,0.02)',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)')}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <Upload size={32} style={{ color: 'rgba(248,250,252,0.4)', marginBottom: 12 }} />
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'white', marginBottom: 4 }}>
                      Upload Label Image
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                      Drag and drop file here, or click to browse
                    </div>
                  </div>
                )}

                {/* Camera Section */}
                {cameraActive && (
                  <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      style={{ width: '100%', display: 'block', maxHeight: 240, objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 16,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 12,
                      }}
                    >
                      <button onClick={capturePhoto} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                        Capture Photo
                      </button>
                      <button
                        onClick={stopCamera}
                        className="btn-outline"
                        style={{ padding: '8px 16px', fontSize: 13, background: 'rgba(0,0,0,0.6)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!cameraActive && !previewUri && (
                  <button
                    onClick={startCamera}
                    className="btn-outline"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Camera size={16} /> Snap Label Photo
                  </button>
                )}

                {/* Preview Thumbnail */}
                {previewUri && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>Selected Image Preview</div>
                    <div style={{ position: 'relative', width: '100%', height: 180, borderRadius: 12, overflow: 'hidden' }}>
                      <img src={previewUri} alt="Label scan preview" style={{ width: '100%', height: '100%', objectFit: 'contain', background: 'rgba(255,255,255,0.02)' }} />
                      <button
                        onClick={() => {
                          setPreviewUri(null);
                          setSelectedFile(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          color: 'white',
                          borderRadius: 50,
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Manual Text Fallback */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'rgba(248, 250, 252, 0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Ingredients List Text (Manual entry or OCR Override)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Paste or type ingredients list here... (e.g. Wheat flour, sugar, partially hydrogenated palm oil, peanuts, salt, lactose)"
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 14,
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  onClick={triggerAnalyze}
                  className="btn-primary"
                  disabled={analyzing}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '14px',
                  }}
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Analyzing Ingredients...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Analyze Food Safety
                    </>
                  )}
                </button>
              </div>

              {/* Loader/Scan Results Display Panel */}
              <div style={{ flex: 1 }}>
                {analyzing && (
                  <div
                    className="glow-card scan-overlay"
                    style={{
                      padding: '40px',
                      minHeight: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 20,
                    }}
                  >
                    <Loader2 size={40} className="animate-spin" style={{ color: 'var(--accent)' }} />
                    <div style={{ textAlign: 'center' }}>
                      <h4 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
                        Scanning & Extracting Text...
                      </h4>
                      <p style={{ fontSize: 13, color: 'rgba(248, 250, 252, 0.5)' }}>
                        Running local OCR and querying health engine
                      </p>
                    </div>
                  </div>
                )}

                {!analyzing && !analysisResult && (
                  <div
                    className="glow-card"
                    style={{
                      padding: '40px',
                      minHeight: 400,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'rgba(248,250,252,0.4)',
                      textAlign: 'center',
                    }}
                  >
                    <Camera size={44} style={{ marginBottom: 16, opacity: 0.5 }} />
                    <h4 style={{ fontWeight: 700, fontSize: 16, color: 'white', marginBottom: 4 }}>
                      Awaiting Scan Input
                    </h4>
                    <p style={{ fontSize: 13, maxWidth: 300 }}>
                      Provide an ingredient label image or paste manual text on the left to review safety assessments.
                    </p>
                  </div>
                )}

                {/* Successful Scan results */}
                {!analyzing && analysisResult && (
                  <div className="glow-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Header Details */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{analysisResult.productName}</h4>
                        <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)', marginTop: 2 }}>
                          Analyzed at {new Date(analysisResult.scannedAt).toLocaleTimeString()}
                        </div>
                      </div>
                      <span
                        className={
                          analysisResult.riskLevel === 'Safe'
                            ? 'badge-safe'
                            : analysisResult.riskLevel === 'Caution'
                              ? 'badge-caution'
                              : 'badge-danger'
                        }
                        style={{
                          padding: '6px 14px',
                          borderRadius: 50,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        {analysisResult.riskLevel.toUpperCase()}
                      </span>
                    </div>

                    {/* Score display */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 12 }}>
                      <div
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 50,
                          border: `3px solid ${analysisResult.riskLevel === 'Safe' ? '#10b981' : analysisResult.riskLevel === 'Caution' ? '#f59e0b' : '#ef4444'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: 16,
                          color: 'white',
                          background: 'rgba(0,0,0,0.3)',
                        }}
                      >
                        {analysisResult.safetyScore}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'white' }}>Safety Score</div>
                        <div style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                          Based on personal health restrictions matching
                        </div>
                      </div>
                    </div>

                    {/* Explanations */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(248, 250, 252, 0.6)' }}>AI Verdict Rationale</div>
                      <p style={{ fontSize: 14, color: 'rgba(248, 250, 252, 0.8)', lineHeight: 1.6 }}>
                        {analysisResult.personalizedExplanation}
                      </p>
                    </div>

                    {/* Warning Ingredients */}
                    {analysisResult.harmfulIngredients && analysisResult.harmfulIngredients.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <AlertOctagon size={16} /> Flagged Ingredients
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {analysisResult.harmfulIngredients.map((ing: string, idx: number) => (
                            <span
                              key={idx}
                              style={{
                                padding: '4px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                color: '#ef4444',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                            >
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Warning Chronic Banner */}
                    {analysisResult.nutritionalWarnings && analysisResult.nutritionalWarnings.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <AlertTriangle size={16} /> Nutritional Warnings
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {analysisResult.nutritionalWarnings.map((warn: string, idx: number) => (
                            <div
                              key={idx}
                              style={{
                                padding: '8px 12px',
                                background: 'rgba(245, 158, 11, 0.08)',
                                border: '1px solid rgba(245, 158, 11, 0.15)',
                                color: '#f59e0b',
                                borderRadius: 8,
                                fontSize: 12,
                              }}
                            >
                              {warn}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Radar Chart */}
                    {analysisResult.nutritionFacts && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(248, 250, 252, 0.6)' }}>Nutritional Values Radar</div>
                        <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(analysisResult)}>
                              <PolarGrid stroke="rgba(255,255,255,0.08)" />
                              <PolarAngleAxis dataKey="name" stroke="rgba(248,250,252,0.4)" fontSize={10} />
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

                    {/* Disclaimer */}
                    <footer
                      style={{
                        marginTop: 12,
                        padding: '12px',
                        border: '1px solid rgba(245,158,11,0.2)',
                        background: 'rgba(245,158,11,0.04)',
                        borderRadius: 10,
                        fontSize: 11,
                        color: 'rgba(248,250,252,0.45)',
                        lineHeight: 1.5,
                      }}
                    >
                      ⚠️ <strong>Medical Disclaimer:</strong> SafeBite AI provides automated ingredient assessments for informational purposes only. Do not rely solely on this analysis for diagnosing, treating, or managing medical conditions. Consult a qualified professional before making food decisions.
                    </footer>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: SCAN HISTORY ────────────────────────────────────────── */}
        {activeTab === 'history' && (
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
        )}

        {/* ─── TAB 4: HEALTH PROFILE ──────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <div className="glow-card" style={{ padding: 32, maxWidth: 640 }}>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              {/* Conditions Checks */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={18} style={{ color: '#ec4899' }} /> Chronic Conditions & Intolerances
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {[
                    { id: 'diabetes', label: 'Diabetes' },
                    { id: 'highBloodPressure', label: 'Hypertension' },
                    { id: 'heartDisease', label: 'Heart Disease' },
                    { id: 'obesity', label: 'Obesity' },
                    { id: 'lactoseIntolerance', label: 'Lactose Intolerance' },
                    { id: 'kidneyDisease', label: 'Kidney Disease' },
                    { id: 'highCholesterol', label: 'High Cholesterol' },
                    { id: 'glutenIntolerance', label: 'Gluten Allergy / Celiac' },
                  ].map((cond) => (
                    <label
                      key={cond.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: 12,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)')}
                    >
                      <input
                        type="checkbox"
                        checked={!!(profileForm as any)[cond.id]}
                        onChange={() => handleCheckboxChange(cond.id as any)}
                        style={{
                          width: 16,
                          height: 16,
                          accentColor: 'var(--primary)',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'white' }}>{cond.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Specific Allergies Tag Editor */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <HeartCrack size={18} style={{ color: '#ef4444' }} /> Specific Food Allergies
                </h3>
                <p style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)', marginBottom: 12 }}>
                  Type an allergy (e.g. peanuts, soy, eggs, seafood) and press Enter
                </p>

                <div
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                    padding: '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  {profileForm.allergies?.map((allergy) => (
                    <span
                      key={allergy}
                      style={{
                        padding: '4px 10px 4px 12px',
                        background: 'rgba(99,102,241,0.15)',
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#a5b4fc',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#a5b4fc',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          padding: 2,
                          borderRadius: 4,
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={profileForm.allergies?.length === 0 ? 'Type here and press Enter' : 'Add allergy...'}
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={handleAddAllergy}
                    style={{
                      flex: 1,
                      minWidth: 160,
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: 14,
                      outline: 'none',
                      padding: '4px 0',
                    }}
                  />
                </div>
              </div>

              {/* Custom restrictions text box */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <UserCog size={18} style={{ color: '#22d3ee' }} /> Other Dietary Restrictions
                </h3>
                <label style={{ fontSize: 12, color: 'rgba(248,250,252,0.4)' }}>
                  Comma-separated list of custom words to scan and flag (e.g. palm oil, msg, preservative, artificial flavor)
                </label>
                <textarea
                  rows={3}
                  placeholder="E.g. MSG, palm oil, red 40, aspartame"
                  value={profileForm.otherRestrictions}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, otherRestrictions: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 12,
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'none',
                  }}
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="btn-primary"
                disabled={submittingProfile}
                style={{
                  padding: '14px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontSize: 15,
                }}
              >
                {submittingProfile ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Saving Changes...
                  </>
                ) : (
                  'Save Health Profile'
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
