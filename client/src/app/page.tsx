"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Feature {
  icon: string;
  title: string;
  desc: string;
  color: string;
}

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface Stat {
  value: string;
  label: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const features: Feature[] = [
  {
    icon: "🔬",
    title: "AI Ingredient Analysis",
    desc: "Powered by OpenAI GPT. Every ingredient is cross-referenced with your personal health profile to instantly flag risks.",
    color: "#6366f1",
  },
  {
    icon: "📷",
    title: "OCR Label Scanning",
    desc: "Simply snap a photo of any food label. Our Tesseract OCR engine extracts all text and sends it to the AI in seconds.",
    color: "#22d3ee",
  },
  {
    icon: "❤️",
    title: "Personal Health Profile",
    desc: "Configure your allergies, conditions, and dietary restrictions once. SafeBite AI personalizes every scan for you.",
    color: "#ec4899",
  },
  {
    icon: "🚦",
    title: "Traffic-Light Safety Score",
    desc: "Green, Yellow, or Red — get an instant, easy-to-understand safety rating for every scanned product.",
    color: "#10b981",
  },
  {
    icon: "📊",
    title: "Nutrition Radar Charts",
    desc: "Beautiful interactive Recharts radar graphs let you visualize nutritional balance at a single glance.",
    color: "#f59e0b",
  },
  {
    icon: "🔒",
    title: "Secure Authentication",
    desc: "JWT-based login and Google OAuth ensure your health data stays private and always protected.",
    color: "#8b5cf6",
  },
];

const steps: Step[] = [
  {
    num: "01",
    title: "Create your health profile",
    desc: "Select your health conditions, allergies, and dietary restrictions from our comprehensive list.",
  },
  {
    num: "02",
    title: "Scan a food label",
    desc: "Take a photo of any food label or manually enter the ingredients you want to check.",
  },
  {
    num: "03",
    title: "Get your safety report",
    desc: "Receive an instant AI-powered safety report with traffic-light scores and nutrition charts.",
  },
];

const stats: Stat[] = [
  { value: "50K+", label: "Food Labels Scanned" },
  { value: "99.2%", label: "OCR Accuracy" },
  { value: "< 2s", label: "Analysis Time" },
  { value: "200+", label: "Health Conditions" },
];

const conditions = [
  "Diabetes", "Lactose Intolerance", "Gluten Sensitivity",
  "Nut Allergy", "Hypertension", "Celiac Disease",
  "Shellfish Allergy", "Vegan", "Keto", "Low-FODMAP",
];

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      id="navbar"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        background: scrolled
          ? "rgba(2, 8, 23, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(99,102,241,0.1)"
          : "none",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: 700,
            color: "white",
          }}
        >
          S
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 18,
            background: "linear-gradient(135deg, #fff, #a5b4fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SafeBite AI
        </span>
      </div>

      {/* Desktop links */}
      <div
        style={{
          display: "flex",
          gap: 32,
          alignItems: "center",
        }}
        className="nav-links"
      >
        {["Features", "How It Works", "About"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(" ", "-")}`}
            style={{
              color: "rgba(248,250,252,0.7)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 500,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#fff")
            }
            onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color =
              "rgba(248,250,252,0.7)")
            }
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Link
          id="nav-login-btn"
          className="btn-outline"
          style={{ fontSize: 14, padding: "8px 20px", textDecoration: "none" }}
          href="/login"
        >
          Log In
        </Link>
        <Link
          id="nav-signup-btn"
          className="btn-primary"
          style={{ fontSize: 14, padding: "8px 20px", textDecoration: "none" }}
          href="/register"
        >
          Get Started Free
        </Link>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [activeCondition, setActiveCondition] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActiveCondition((p) => (p + 1) % conditions.length),
      2000
    );
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        id="hero-badge"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 16px",
          borderRadius: 50,
          border: "1px solid rgba(99,102,241,0.4)",
          background: "rgba(99,102,241,0.08)",
          marginBottom: 24,
          fontSize: 13,
          color: "#a5b4fc",
          fontWeight: 500,
        }}
      >
        <span style={{ fontSize: 16 }}>✨</span>
        AI-Powered Food Safety — Now Available
      </div>

      {/* Headline */}
      <h1
        id="hero-headline"
        style={{
          fontSize: "clamp(36px, 7vw, 76px)",
          fontWeight: 900,
          textAlign: "center",
          lineHeight: 1.08,
          maxWidth: 900,
          marginBottom: 24,
          letterSpacing: "-0.03em",
        }}
      >
        Know What You Eat.{" "}
        <span className="gradient-text">Stay Safe.</span>
      </h1>

      {/* Subheadline */}
      <p
        style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: "rgba(248,250,252,0.6)",
          textAlign: "center",
          maxWidth: 640,
          lineHeight: 1.7,
          marginBottom: 16,
        }}
      >
        Scan any food label with your camera. SafeBite AI instantly analyzes
        every ingredient against your personal health profile and delivers
        a clear safety verdict.
      </p>

      {/* Rotating condition chip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 44,
          fontSize: 15,
          color: "rgba(248,250,252,0.5)",
        }}
      >
        Tailored for people with{" "}
        <span
          style={{
            color: "#22d3ee",
            fontWeight: 600,
            padding: "2px 12px",
            background: "rgba(34,211,238,0.1)",
            borderRadius: 50,
            border: "1px solid rgba(34,211,238,0.3)",
            transition: "all 0.4s ease",
            display: "inline-block",
            minWidth: 160,
            textAlign: "center",
          }}
        >
          {conditions[activeCondition]}
        </span>
      </div>

      {/* CTA Buttons */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 80,
        }}
      >
        <Link
          id="hero-cta-primary"
          className="btn-primary"
          style={{ fontSize: 16, padding: "14px 36px", textDecoration: "none" }}
          href="/register"
        >
          🚀 Start Scanning Free
        </Link>
        <a
          id="hero-cta-secondary"
          className="btn-outline"
          style={{ fontSize: 16, padding: "14px 36px", textDecoration: "none" }}
          href="#features"
        >
          ▶ Explore Features
        </a>
      </div>

      {/* Mock Product Card */}
      <div
        id="hero-demo-card"
        className="glow-card"
        style={{
          maxWidth: 480,
          width: "100%",
          padding: 24,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(34,211,238,0.2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            🥤
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>
              Oat Milk (Barista Edition)
            </div>
            <div style={{ color: "rgba(248,250,252,0.5)", fontSize: 13 }}>
              Per 100ml serving
            </div>
          </div>
          <div
            style={{ marginLeft: "auto" }}
            className="badge-safe"
          >
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 50,
                fontSize: 12,
                fontWeight: 700,
              }}
              className="badge-safe"
            >
              ✅ SAFE
            </span>
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 12,
              color: "rgba(248,250,252,0.4)",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Ingredient Analysis
          </div>
          {[
            { name: "Oats", status: "safe", note: "Gluten-free certified" },
            { name: "Rapeseed Oil", status: "caution", note: "High in omega-6" },
            { name: "Dipotassium Phosphate", status: "safe", note: "Common emulsifier" },
          ].map((ing) => (
            <div
              key={ing.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                marginBottom: 6,
                borderRadius: 8,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{ing.name}</div>
                <div style={{ fontSize: 11, color: "rgba(248,250,252,0.4)" }}>
                  {ing.note}
                </div>
              </div>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 50,
                  fontSize: 11,
                  fontWeight: 700,
                }}
                className={
                  ing.status === "safe"
                    ? "badge-safe"
                    : ing.status === "caution"
                      ? "badge-caution"
                      : "badge-danger"
                }
              >
                {ing.status === "safe"
                  ? "✓ Safe"
                  : ing.status === "caution"
                    ? "⚠ Caution"
                    : "✗ Avoid"}
              </span>
            </div>
          ))}
        </div>

        {/* Nutrition bars */}
        <div>
          <div
            style={{
              fontSize: 12,
              color: "rgba(248,250,252,0.4)",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Nutrition Overview
          </div>
          {[
            { label: "Carbohydrates", value: 60, color: "#6366f1" },
            { label: "Protein", value: 22, color: "#22d3ee" },
            { label: "Fat", value: 18, color: "#f59e0b" },
          ].map((n) => (
            <div key={n.label} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                  color: "rgba(248,250,252,0.6)",
                }}
              >
                <span>{n.label}</span>
                <span>{n.value}%</span>
              </div>
              <div
                style={{
                  height: 4,
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${n.value}%`,
                    background: `linear-gradient(90deg, ${n.color}, ${n.color}aa)`,
                    borderRadius: 2,
                    transition: "width 1s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Scan line animation */}
        <div
          className="scan-overlay"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            pointerEvents: "none",
          }}
        />
      </div>
    </section>
  );
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <section
      id="stats"
      style={{
        padding: "60px 24px",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "rgba(255,255,255,0.01)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
          textAlign: "center",
        }}
      >
        {stats.map((s) => (
          <div key={s.label} id={`stat-${s.label.replace(/\s+/g, "-")}`}>
            <div
              style={{
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #6366f1, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 8,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                color: "rgba(248,250,252,0.5)",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section
      id="features"
      style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div
          style={{
            display: "inline-block",
            padding: "5px 14px",
            borderRadius: 50,
            border: "1px solid rgba(99,102,241,0.3)",
            background: "rgba(99,102,241,0.07)",
            color: "#a5b4fc",
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          FEATURES
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Everything you need to eat{" "}
          <span className="gradient-text">confidently</span>
        </h2>
        <p
          style={{
            color: "rgba(248,250,252,0.5)",
            fontSize: 18,
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          SafeBite AI combines cutting-edge AI with OCR scanning to deliver
          a seamless food safety experience.
        </p>
      </div>

      <div className="feature-grid">
        {features.map((f, i) => (
          <div
            key={f.title}
            id={`feature-card-${i}`}
            className="glow-card"
            style={{ padding: 28 }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                marginBottom: 18,
              }}
            >
              {f.icon}
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 10,
                letterSpacing: "-0.01em",
              }}
            >
              {f.title}
            </h3>
            <p
              style={{
                color: "rgba(248,250,252,0.5)",
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 24px",
        background: "rgba(255,255,255,0.01)",
        borderTop: "1px solid rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: 50,
              border: "1px solid rgba(34,211,238,0.3)",
              background: "rgba(34,211,238,0.07)",
              color: "#67e8f9",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            HOW IT WORKS
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Three steps to{" "}
            <span className="gradient-text">food clarity</span>
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 32,
            position: "relative",
          }}
        >
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 28,
              top: 60,
              bottom: 60,
              width: 1,
              background: "linear-gradient(to bottom, #6366f1, #22d3ee)",
              opacity: 0.3,
            }}
          />

          {steps.map((s, i) => (
            <div
              key={s.num}
              id={`step-${i + 1}`}
              style={{
                display: "flex",
                gap: 28,
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "white",
                  flexShrink: 0,
                  zIndex: 1,
                  boxShadow: "0 0 20px rgba(99,102,241,0.3)",
                }}
              >
                {s.num}
              </div>
              <div
                className="glow-card"
                style={{
                  flex: 1,
                  padding: "24px 28px",
                }}
              >
                <h3
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 8,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "rgba(248,250,252,0.5)",
                    fontSize: 15,
                    lineHeight: 1.7,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section
      id="cta"
      style={{
        padding: "120px 24px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "inline-block",
          padding: "5px 14px",
          borderRadius: 50,
          border: "1px solid rgba(99,102,241,0.3)",
          background: "rgba(99,102,241,0.07)",
          color: "#a5b4fc",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        GET STARTED TODAY
      </div>
      <h2
        style={{
          fontSize: "clamp(28px, 6vw, 60px)",
          fontWeight: 900,
          marginBottom: 20,
          letterSpacing: "-0.03em",
          maxWidth: 700,
          margin: "0 auto 20px",
        }}
      >
        Start eating with{" "}
        <span className="gradient-text">confidence</span> today
      </h2>
      <p
        style={{
          color: "rgba(248,250,252,0.5)",
          fontSize: 18,
          maxWidth: 500,
          margin: "0 auto 48px",
          lineHeight: 1.7,
        }}
      >
        Join thousands of health-conscious people using SafeBite AI to
        make smarter, safer food choices every day.
      </p>
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          id="cta-signup-btn"
          className="btn-primary"
          style={{ fontSize: 17, padding: "15px 40px" }}
        >
          🚀 Create Free Account
        </button>
        <button
          id="cta-learn-btn"
          className="btn-outline"
          style={{ fontSize: 17, padding: "15px 40px" }}
        >
          Learn More
        </button>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      id="footer"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 24px",
        textAlign: "center",
        color: "rgba(248,250,252,0.35)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
          }}
        >
          S
        </div>
        <span style={{ fontWeight: 600, color: "rgba(248,250,252,0.5)" }}>
          SafeBite AI
        </span>
      </div>
      <p>
        ⚠️ Medical Disclaimer: SafeBite AI is not a substitute for professional
        medical advice. Always consult your doctor before making dietary decisions.
      </p>
      <p style={{ marginTop: 8 }}>
        © {new Date().getFullYear()} SafeBite AI. All rights reserved.
      </p>
    </footer>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <div className="noise-overlay" />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
