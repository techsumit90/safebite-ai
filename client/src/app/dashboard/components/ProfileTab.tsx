import React from 'react';
import { Heart, HeartCrack, UserCog, X, Loader2 } from 'lucide-react';

interface ProfileTabProps {
  profileForm: any;
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  allergyInput: string;
  setAllergyInput: (val: string) => void;
  handleAddAllergy: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveAllergy: (allergy: string) => void;
  handleCheckboxChange: (field: string) => void;
  handleSaveProfile: (e: React.FormEvent) => void;
  submittingProfile: boolean;
}

export default function ProfileTab({
  profileForm,
  setProfileForm,
  allergyInput,
  setAllergyInput,
  handleAddAllergy,
  handleRemoveAllergy,
  handleCheckboxChange,
  handleSaveProfile,
  submittingProfile,
}: ProfileTabProps) {
  return (
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
                  checked={!!profileForm[cond.id]}
                  onChange={() => handleCheckboxChange(cond.id)}
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
            {profileForm.allergies?.map((allergy: string) => (
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
            value={profileForm.otherRestrictions || ''}
            onChange={(e) => setProfileForm((prev: any) => ({ ...prev, otherRestrictions: e.target.value }))}
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
  );
}
