import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Auth Form State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    const endpoint = isLogin ? '/api/login' : '/api/signup';

    try {
      const res = await axios.post(`http://localhost:5000${endpoint}`, { email, password });
      setMessage(res.data.message);
      setIsSuccess(true);
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setActiveTab('dashboard');
  };

  // IF NOT LOGGED IN: Show Login / Signup Screen
  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <div style={styles.authBrand}>ReliefLanka</div>
            <h2 style={styles.title}>{isLogin ? 'Welcome back' : 'Create an account'}</h2>
            <p style={styles.subtitle}>
              {isLogin ? 'Coordinate help when it matters most' : 'Join the relief coordination network'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {message && (
            <div style={{
              ...styles.alert,
              backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isSuccess ? '#34d399' : '#f87171',
              borderColor: isSuccess ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
            }}>
              {message}
            </div>
          )}

          <div style={styles.footer}>
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
              }} 
              style={styles.toggleBtn}
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN: Responsive Layout
  return (
    <>
      <style>{responsiveCSS}</style>
      <div className="dash-layout">
        {/* Responsive Sidebar / Header */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h3 style={styles.sidebarLogo}>ReliefLanka</h3>
            <button onClick={handleLogout} className="mobile-logout-btn">Sign Out</button>
          </div>
          
          <nav className="nav-menu">
            <button 
              className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Project Intro
            </button>
            <button 
              className={`nav-btn ${activeTab === 'component1' ? 'active' : ''}`}
              onClick={() => setActiveTab('component1')}
            >
              Component 1
            </button>
            <button 
              className={`nav-btn ${activeTab === 'component2' ? 'active' : ''}`}
              onClick={() => setActiveTab('component2')}
            >
              Component 2
            </button>
            <button 
              className={`nav-btn ${activeTab === 'component3' ? 'active' : ''}`}
              onClick={() => setActiveTab('component3')}
            >
              Component 3
            </button>
            <button 
              className={`nav-btn ${activeTab === 'component4' ? 'active' : ''}`}
              onClick={() => setActiveTab('component4')}
            >
              Component 4
            </button>
            {activeTab === 'dashboard' && (
              <>
                <a className="nav-btn nav-link" href="#about-relieflanka">About ReliefLanka</a>
                <a className="nav-btn nav-link" href="#contact-support">Contact & Support</a>
              </>
            )}
          </nav>
          
          <button onClick={handleLogout} className="desktop-logout-btn">Sign Out</button>
        </aside>

        {/* Responsive Main Body */}
        <main className="main-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-flow">
              <section style={styles.sectionCard}>
                <div style={styles.eyebrow}>Disaster & Flood Assistance Tracker</div>
                <h1 style={styles.pageTitle}>ReliefLanka</h1>
                <p style={styles.description}>
                  A disaster and flood assistance tracker that connects people affected by floods and landslides with the help they need, while giving volunteers and donors a clear view of relief requests across Sri Lanka.
                </p>
                <div className="grid-container">
                  <div style={styles.infoBox}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#67e8f9' }}>The Problem</h4>
                    <p style={{ margin: 0, color: '#b6cbd1', fontSize: '13px' }}>Localized disasters can leave urgent requests for food, medicine, and boats scattered across social media.</p>
                  </div>
                  <div style={styles.infoBox}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#67e8f9' }}>Our Solution</h4>
                    <p style={{ margin: 0, color: '#b6cbd1', fontSize: '13px' }}>A clean, searchable hub for real-time relief coordination across districts.</p>
                  </div>
                </div>
              </section>

              <section id="about-relieflanka" style={styles.sectionCard}>
                <div style={styles.eyebrow}>About the platform</div>
                <h2 style={styles.sectionTitle}>Making every request visible</h2>
                <p style={styles.description}>
                  ReliefLanka brings affected families, local responders, volunteers, and donors into one shared space. Requests can be understood by urgency and district, helping support reach the right place faster.
                </p>
                <div className="grid-container">
                  <div style={styles.infoBox}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#67e8f9' }}>For communities</h4>
                    <p style={{ margin: 0, color: '#b6cbd1', fontSize: '13px' }}>Share urgent needs for food, medicine, transport, boats, and other essential support.</p>
                  </div>
                  <div style={styles.infoBox}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#67e8f9' }}>For helpers</h4>
                    <p style={{ margin: 0, color: '#b6cbd1', fontSize: '13px' }}>Find real requests by district and offer time, supplies, transport, or donations where they matter.</p>
                  </div>
                </div>
              </section>

              <section id="contact-support" className="contactCard">
                <div>
                  <div style={styles.eyebrow}>Need help or want to help?</div>
                  <h2 style={styles.sectionTitle}>Contact & Support</h2>
                  <p style={{ ...styles.description, marginBottom: 0 }}>For urgent coordination, reach out to the ReliefLanka response team or connect with local district volunteers.</p>
                </div>
                <div className="contact-details">
                  <a href="mailto:support@relieflanka.org">support@relieflanka.org</a>
                  <span>24/7 response coordination</span>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'component1' && (
            <section style={styles.sectionCard}>
              <h1 style={styles.pageTitle}>Component 1 Details</h1>
              <p style={styles.description}>This is the dedicated workspace for Component 1.</p>
            </section>
          )}

          {activeTab === 'component2' && (
            <section style={styles.sectionCard}>
              <h1 style={styles.pageTitle}>Component 2 Details</h1>
              <p style={styles.description}>This is the dedicated workspace for Component 2.</p>
            </section>
          )}

          {activeTab === 'component3' && (
            <section style={styles.sectionCard}>
              <h1 style={styles.pageTitle}>Component 3 Details</h1>
              <p style={styles.description}>This is the dedicated workspace for Component 3.</p>
            </section>
          )}

          {activeTab === 'component4' && (
            <section style={styles.sectionCard}>
              <h1 style={styles.pageTitle}>Component 4 Details</h1>
              <p style={styles.description}>This is the dedicated workspace for Component 4.</p>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

// Media Queries for Desktop, Tablet, and Mobile
const responsiveCSS = `
  * { box-sizing: border-box; }
  
  .dash-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #07131c;
    color: #effcff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .sidebar {
    width: 100%;
    background-color: #0b202b;
    border-bottom: 1px solid #164e63;
    padding: 16px;
  }

  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-menu {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-top: 12px;
    padding-bottom: 4px;
  }

  .nav-btn {
    padding: 8px 14px;
    border-radius: 8px;
    background-color: transparent;
    color: #9ab6bf;
    border: none;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
  }

  .nav-btn.active {
    background-color: #123c4a;
    color: #67e8f9;
    font-weight: 600;
  }

  .nav-link {
    text-decoration: none;
  }

  .desktop-logout-btn { display: none; }

  .mobile-logout-btn {
    padding: 6px 12px;
    border-radius: 6px;
    background-color: rgba(249, 115, 22, 0.12);
    color: #fdba74;
    border: 1px solid rgba(249, 115, 22, 0.35);
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
  }

  .main-content {
    flex: 1;
    padding: 16px;
  }

  .dashboard-flow {
    display: grid;
    gap: 20px;
    max-width: 1180px;
  }

  .contactCard {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    background: linear-gradient(120deg, #0e3542, #123044);
    border: 1px solid #1c7182;
    border-radius: 16px;
    padding: 24px;
  }

  .contact-details {
    display: grid;
    gap: 6px;
    min-width: 220px;
  }

  .contact-details a {
    color: #ffb77a;
    font-weight: 700;
    text-decoration: none;
  }

  .contact-details span {
    color: #b6cbd1;
    font-size: 13px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* Desktop and Tablet Enhancements (Screens > 768px) */
  @media (min-width: 768px) {
    .dash-layout {
      flex-direction: row;
    }

    .sidebar {
      width: 240px;
      border-bottom: none;
      border-right: 1px solid #164e63;
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .nav-menu {
      flex-direction: column;
      overflow-x: visible;
      padding-top: 0;
    }

    .nav-btn {
      text-align: left;
      font-size: 14px;
      padding: 10px 14px;
    }

    .mobile-logout-btn { display: none; }

    .desktop-logout-btn {
      display: block;
      padding: 10px 14px;
      border-radius: 8px;
      background-color: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
      cursor: pointer;
      margin-top: auto;
      font-weight: 600;
    }

    .main-content {
      padding: 32px;
    }

    .contactCard {
      padding: 28px;
    }

    .grid-container {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
`;

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#07131c',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '16px',
    boxSizing: 'border-box'
  },
  card: {
    width: '100%',
    maxWidth: '380px',
    backgroundColor: '#0b202b',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    border: '1px solid #164e63'
  },
  header: { textAlign: 'center', marginBottom: '20px' },
  authBrand: { color: '#67e8f9', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '10px' },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '10px',
    border: '1px solid rgba(59, 130, 246, 0.2)'
  },
  title: { margin: '0 0 6px 0', color: '#f9fafb', fontSize: '20px', fontWeight: '700' },
  subtitle: { margin: 0, color: '#b6cbd1', fontSize: '12px', lineHeight: '1.4' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' },
  label: { color: '#d6edf1', fontSize: '12px', fontWeight: '500' },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #246276',
    backgroundColor: '#102e3a',
    color: '#f9fafb',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box'
  },
  button: {
    marginTop: '4px',
    padding: '11px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f97316',
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  alert: {
    marginTop: '14px',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    textAlign: 'center',
    border: '1px solid'
  },
  footer: { marginTop: '16px', textAlign: 'center' },
  toggleBtn: { background: 'none', border: 'none', color: '#8ed9e5', fontSize: '12px', cursor: 'pointer' },
  sidebarLogo: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#67e8f9' },
  eyebrow: { color: '#fb923c', fontSize: '11px', fontWeight: '700', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' },
  sectionCard: {
    backgroundColor: '#0b202b',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #164e63'
  },
  pageTitle: { margin: '0 0 12px 0', fontSize: '22px', color: '#effcff' },
  sectionTitle: { margin: '0 0 12px 0', fontSize: '20px', color: '#effcff' },
  description: { color: '#b6cbd1', lineHeight: '1.6', fontSize: '14px', margin: '0 0 20px 0' },
  infoBox: {
    backgroundColor: '#102e3a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #246276'
  }
};