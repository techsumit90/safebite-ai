"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth, HealthProfile } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  User as UserIcon, LogOut, Camera, Activity, History as HistoryIcon, UserCog, Loader2, Sparkles
} from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import ScanTab from './components/ScanTab';
import HistoryTab from './components/HistoryTab';
import ProfileTab from './components/ProfileTab';

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
  const handleCheckboxChange = (field: string) => {
    setProfileForm((prev: any) => ({
      ...prev,
      [field]: !prev[field as keyof HealthProfile],
    }));
  };

  const handleAddAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
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
          <OverviewTab
            scans={scans}
            setActiveHistoryScan={setActiveHistoryScan}
            setActiveTab={setActiveTab}
            handleDeleteScan={handleDeleteScan}
          />
        )}

        {/* ─── TAB 2: LABEL SCANNER ───────────────────────────────────────── */}
        {activeTab === 'scan' && (
          <ScanTab
            ingredientsText={ingredientsText}
            setIngredientsText={setIngredientsText}
            imagePreview={previewUri}
            handleImageUpload={handleFileChange}
            analyzing={analyzing}
            analysisResult={analysisResult}
            handleAnalyze={triggerAnalyze}
            getRadarData={getRadarData}
          />
        )}

        {/* ─── TAB 3: SCAN HISTORY ────────────────────────────────────────── */}
        {activeTab === 'history' && (
          <HistoryTab
            loadingHistory={loadingHistory}
            scans={scans}
            activeHistoryScan={activeHistoryScan}
            setActiveHistoryScan={setActiveHistoryScan}
            handleDeleteScan={handleDeleteScan}
            getRadarData={getRadarData}
          />
        )}

        {/* ─── TAB 4: HEALTH PROFILE ──────────────────────────────────────── */}
        {activeTab === 'profile' && (
          <ProfileTab
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            allergyInput={allergyInput}
            setAllergyInput={setAllergyInput}
            handleAddAllergy={handleAddAllergy}
            handleRemoveAllergy={handleRemoveAllergy}
            handleCheckboxChange={handleCheckboxChange}
            handleSaveProfile={handleSaveProfile}
            submittingProfile={submittingProfile}
          />
        )}
      </main>
    </div>
  );
}
