import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Bookmark,
  BookOpen,
  Search,
  X,
  Check,
  ChevronRight,
  Plus,
  Minus,
  RotateCcw,
  Maximize2,
  Minimize2,
  Layers3,
  HeartPulse,
  Network,
  Droplets,
  Map,
  Lightbulb,
  GraduationCap,
  Info,
  CircleHelp,
  Sparkles,
  Route,
  Building2,
  PersonStanding,
  ListFilter,
  CheckCircle2,
  Circle,
  ExternalLink,
} from 'lucide-react';
import Atlas, { Organ } from './Atlas';
import { structures, systems, regions, journeys, quizQuestions } from './data';
import '@fontsource-variable/dm-sans';
import '@fontsource/libre-caslon-display/latin-400.css';
import './styles.css';
const iconFor = {
  organs: HeartPulse,
  arteries: Route,
  veins: Droplets,
  nerves: Network,
  lymph: Layers3,
};
function readSaved(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}
function IconButton({ title, children, onClick, className = '', ...props }) {
  return (
    <button
      className={`icon-button ${className}`}
      title={title}
      aria-label={title}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
function App() {
  const [view, setView] = useState('anatomy'),
    [selected, setSelected] = useState('heart');
  const [layers, setLayers] = useState({
    organs: true,
    arteries: true,
    veins: true,
    nerves: false,
    lymph: false,
  });
  const [labels, setLabels] = useState(true),
    [region, setRegion] = useState('all'),
    [zoom, setZoom] = useState(1),
    [focus, setFocus] = useState(false);
  const [modal, setModal] = useState(null),
    [query, setQuery] = useState(''),
    [searchOpen, setSearchOpen] = useState(false),
    [detailTab, setDetailTab] = useState('overview');
  const [saved, setSaved] = useState(() => readSaved('corpus-saved', [])),
    [visited, setVisited] = useState(() => readSaved('corpus-visited', ['heart']));
  const [journey, setJourney] = useState(null),
    [step, setStep] = useState(0),
    [quizIndex, setQuizIndex] = useState(0),
    [answers, setAnswers] = useState([]),
    [quizDone, setQuizDone] = useState(false);
  const searchRef = useRef(null),
    dialogRef = useRef(null),
    lastFocus = useRef(null);
  const s = structures.find((n) => n.id === selected),
    system = systems.find((n) => n.id === s.system),
    StructureIcon = iconFor[s.system];
  const filtered = structures.filter((n) =>
    `${n.name} ${n.city} ${n.system} ${n.region}`.toLowerCase().includes(query.toLowerCase()),
  );
  const guide = journeys.find((j) => j.id === journey);
  useEffect(() => {
    try {
      localStorage.setItem('corpus-saved', JSON.stringify(saved));
      localStorage.setItem('corpus-visited', JSON.stringify(visited));
    } catch {}
  }, [saved, visited]);
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setModal(null);
        setSearchOpen(false);
        setFocus(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  useEffect(() => {
    if (modal === 'quiz') dialogRef.current?.focus();
  }, [quizIndex, quizDone]);
  useEffect(() => {
    if (!modal) return;
    lastFocus.current = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const trap = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input, [tabindex="0"]',
      );
      if (!nodes?.length) return;
      const first = nodes[0],
        last = nodes[nodes.length - 1];
      if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === dialogRef.current)
      ) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', trap);
    return () => {
      document.body.style.overflow = old;
      document.removeEventListener('keydown', trap);
      lastFocus.current?.focus();
    };
  }, [modal]);
  function select(id) {
    const item = structures.find((n) => n.id === id);
    setSelected(id);
    setLayers((p) => ({ ...p, [item.system]: true }));
    setVisited((p) => (p.includes(id) ? p : [...p, id]));
    setRegion('all');
    setSearchOpen(false);
    setQuery('');
    setDetailTab('overview');
  }
  function toggleSave() {
    setSaved((p) => (p.includes(selected) ? p.filter((n) => n !== selected) : [...p, selected]));
  }
  function startJourney(id) {
    const j = journeys.find((n) => n.id === id);
    setJourney(id);
    setStep(0);
    select(j.steps[0].id);
    setModal(null);
  }
  function moveStep(next) {
    setStep(next);
    select(guide.steps[next].id);
  }
  function startQuiz() {
    setQuizIndex(0);
    setAnswers([]);
    setQuizDone(false);
    setModal('quiz');
  }
  function answerQuiz(id) {
    if (answers[quizIndex]) return;
    setAnswers((p) => [...p, id]);
    select(quizQuestions[quizIndex].answer);
  }
  function changeRegion(id) {
    setRegion(id);
    setZoom(1);
  }
  const activeLayers = systems.filter((n) => layers[n.id]);
  return (
    <div className={`app ${focus ? 'focus-mode' : ''}`}>
      <header className="site-header" inert={modal ? true : undefined}>
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setView('anatomy');
            setFocus(false);
          }}
          aria-label="Corpus home"
        >
          <span className="brand-mark">
            <svg viewBox="0 0 32 36" fill="none">
              <circle cx="16" cy="6" r="3" fill="currentColor" />
              <path
                d="M16 11V24M5 13L16 16L27 13M16 23L9 33M16 23L23 33"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
              />
              <circle cx="16" cy="20" r="11" stroke="currentColor" strokeWidth=".7" opacity=".6" />
            </svg>
          </span>
          <span>
            corpus<span className="brand-dot">.</span>
          </span>
          <span className="brand-divider" />
          <span className="brand-tagline">THE LIVING ATLAS</span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <button
            className="nav-active"
            onClick={() => {
              setModal(null);
              setFocus(false);
            }}
          >
            Explore
          </button>
          <button onClick={() => setModal('journeys')}>Learning paths</button>
          <button onClick={() => setModal('saved')}>
            My notebook{saved.length > 0 && <span className="nav-count">{saved.length}</span>}
          </button>
        </nav>
        <div className="header-right">
          <button
            className="help-button"
            onClick={() => setModal('about')}
            aria-label="About this atlas"
          >
            <CircleHelp size={18} />
          </button>
          <span className="header-separator" />
          <span className="student-avatar" title="Your local learning space">
            S
          </span>
        </div>
      </header>
      <main inert={modal ? true : undefined}>
        <section className="intro">
          <div>
            <div className="eyebrow">
              <span /> ANATOMY, REIMAGINED
            </div>
            <h1>
              A body of knowledge.
              <br className="mobile-break" /> A city of connections.
            </h1>
            <p>Explore the human body. See how it all connects. Make it unforgettable.</p>
          </div>
          <button className="practice-button" onClick={startQuiz}>
            <GraduationCap size={18} /> Test your knowledge <ArrowUpRight size={16} />
          </button>
        </section>
        <div className="workspace-top">
          <div className="view-switch" role="tablist" aria-label="Atlas view">
            <button
              role="tab"
              aria-selected={view === 'anatomy'}
              className={view === 'anatomy' ? 'active' : ''}
              onClick={() => setView('anatomy')}
            >
              <PersonStanding size={17} /> Human anatomy
            </button>
            <button
              role="tab"
              aria-selected={view === 'city'}
              className={view === 'city' ? 'active' : ''}
              onClick={() => setView('city')}
            >
              <Building2 size={17} /> Human body as a city{' '}
              <span className="new-tag">NEW PERSPECTIVE</span>
            </button>
          </div>
          <div className="search-wrap">
            <Search size={16} />
            <input
              ref={searchRef}
              aria-label="Search anatomy"
              value={query}
              placeholder="Find a structure…"
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filtered.length) {
                  select(filtered[0].id);
                  searchRef.current?.blur();
                }
              }}
            />
            {query ? (
              <IconButton title="Clear search" onClick={() => setQuery('')}>
                <X size={13} />
              </IconButton>
            ) : (
              <kbd>⌘ K</kbd>
            )}
            {searchOpen && (
              <>
                <div className="search-dismiss" onClick={() => setSearchOpen(false)} />
                <div className="search-results">
                  <div className="search-label">
                    {query ? `${filtered.length} matching structures` : 'EXPLORE A STRUCTURE'}
                  </div>
                  {filtered.length ? (
                    filtered.map((n) => (
                      <button key={n.id} onClick={() => select(n.id)}>
                        <span
                          className="result-dot"
                          style={{ background: systems.find((t) => t.id === n.system).color }}
                        />
                        <span>
                          <strong>{n.name}</strong>
                          <small>{n.city}</small>
                        </span>
                        <ArrowUpRight size={14} />
                      </button>
                    ))
                  ) : (
                    <p>No structures found. Try “heart”, “nerve”, or “lymph”.</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="workspace">
          <aside className="left-sidebar">
            <div className="section-heading">
              <span>ANATOMICAL LAYERS</span>
              <Layers3 size={15} />
            </div>
            <p className="sidebar-help">Choose what you want to see.</p>
            <div className="layer-list">
              {systems.map((layer) => {
                const Icon = iconFor[layer.id];
                return (
                  <label
                    className={`layer-row ${layers[layer.id] ? 'enabled' : ''}`}
                    key={layer.id}
                  >
                    <span
                      className="layer-icon"
                      style={{ color: layer.color, background: `${layer.color}12` }}
                    >
                      <Icon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="layer-name">
                      {layer.name}
                      <small>
                        {structures.filter((n) => n.system === layer.id).length} structures
                      </small>
                    </span>
                    <input
                      type="checkbox"
                      role="switch"
                      aria-label={`Show ${layer.name}`}
                      checked={layers[layer.id]}
                      onChange={() => setLayers((p) => ({ ...p, [layer.id]: !p[layer.id] }))}
                    />
                    <span className="toggle" />
                  </label>
                );
              })}
            </div>
            <div className="layer-tools">
              <button
                onClick={() => setLayers(Object.fromEntries(systems.map((n) => [n.id, true])))}
              >
                Show all
              </button>
              <span>·</span>
              <button
                onClick={() =>
                  setLayers({
                    organs: true,
                    arteries: false,
                    veins: false,
                    nerves: false,
                    lymph: false,
                  })
                }
              >
                Organs only
              </button>
            </div>
            <div className="sidebar-divider" />
            <div className="section-heading">
              <span>BODY REGIONS</span>
              <ListFilter size={14} />
            </div>
            <div className="region-list">
              {regions.map((r, i) => (
                <button
                  key={r.id}
                  className={region === r.id ? 'active' : ''}
                  onClick={() => changeRegion(r.id)}
                >
                  <span>
                    {i === 0 ? (
                      <PersonStanding size={16} />
                    ) : (
                      <span className="region-number">0{i}</span>
                    )}
                    {r.name}
                  </span>
                  {region === r.id ? <span className="selected-dot" /> : <ChevronRight size={13} />}
                </button>
              ))}
            </div>
            <button className="guided-card" onClick={() => setModal('journeys')}>
              <span className="guided-icon">
                <Route size={21} />
                <span className="small-star">✦</span>
              </span>
              <span className="tiny-label">FOLLOW THE CONNECTIONS</span>
              <strong>Take the scenic route.</strong>
              <span>
                Follow a blood cell. Trace a signal.
                <br />
                Learn one journey at a time.
              </span>
              <span className="guided-link">
                Explore learning paths <ArrowUpRight size={15} />
              </span>
            </button>
            <div className="sidebar-foot">
              <span className="live-dot" /> Built for curious minds.
            </div>
          </aside>
          <section className="canvas-panel" aria-label="Interactive atlas">
            <div className="canvas-heading">
              <div>
                <span className="tiny-label">
                  {view === 'anatomy' ? 'THE HUMAN ATLAS' : 'THE BODY, REBUILT'}
                </span>
                <h2>
                  {view === 'anatomy' ? 'Every part has a purpose.' : 'One city. Working together.'}
                </h2>
              </div>
              <span className="view-badge">
                {view === 'anatomy' ? 'ANTERIOR VIEW' : 'ANATOMICAL CITY'}
              </span>
            </div>
            <div className="canvas-topline">
              <span>
                <span className="canvas-status" />
                {region === 'all'
                  ? `${structures.length} structures to discover`
                  : regions.find((r) => r.id === region).name}
              </span>
              <button
                className={`label-toggle ${labels ? 'on' : ''}`}
                aria-pressed={labels}
                onClick={() => setLabels((p) => !p)}
              >
                <span className="mini-check">{labels && <Check size={10} />}</span> Labels
              </button>
            </div>
            <div className="map-stage">
              <div className="orientation">
                <span>R</span>
                <span>Patient’s right</span>
              </div>
              <div className="orientation right">
                <span>L</span>
                <span>Patient’s left</span>
              </div>
              <Atlas
                view={view}
                layers={layers}
                selected={selected}
                onSelect={select}
                labels={labels}
                region={region}
                zoom={zoom}
              />
              {activeLayers.length === 0 && (
                <div className="empty-map">
                  <Layers3 size={24} />
                  <strong>A fresh perspective starts with a layer.</strong>
                  <button onClick={() => setLayers((p) => ({ ...p, organs: true }))}>
                    Show organs <ArrowRight size={15} />
                  </button>
                </div>
              )}
              <div className="map-controls">
                <div>
                  <IconButton
                    title="Zoom in"
                    disabled={zoom >= 1.8}
                    onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.2).toFixed(1)))}
                  >
                    <Plus size={17} />
                  </IconButton>
                  <span>{Math.round(zoom * 100)}%</span>
                  <IconButton
                    title="Zoom out"
                    disabled={zoom <= 0.8}
                    onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.2).toFixed(1)))}
                  >
                    <Minus size={17} />
                  </IconButton>
                </div>
                <IconButton
                  title="Reset view"
                  onClick={() => {
                    setZoom(1);
                    setRegion('all');
                  }}
                >
                  <RotateCcw size={16} />
                </IconButton>
                <IconButton
                  title={focus ? 'Exit focus mode' : 'Enter focus mode'}
                  onClick={() => setFocus((p) => !p)}
                >
                  {focus ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </IconButton>
              </div>
              <button
                className="mobile-detail-jump"
                onClick={() =>
                  document.querySelector('.detail-sidebar')?.scrollIntoView({
                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                      ? 'instant'
                      : 'smooth',
                    block: 'start',
                  })
                }
              >
                <span>{s.name}</span>
                <span>
                  Explore structure <ArrowRight size={12} />
                </span>
              </button>
              <div className="map-caption">
                <span className="crosshair">＋</span>{' '}
                {view === 'anatomy'
                  ? 'A little curiosity goes a long way. Select any structure.'
                  : 'Same body. A different way to remember it.'}
              </div>
            </div>
            {guide && (
              <div className="journey-player">
                <div className="journey-player-top">
                  <span>
                    <Route size={15} /> {guide.name}
                  </span>
                  <IconButton title="Close learning path" onClick={() => setJourney(null)}>
                    <X size={15} />
                  </IconButton>
                </div>
                <div className="journey-progress">
                  {guide.steps.map((_, i) => (
                    <span key={i} className={i <= step ? 'done' : ''} />
                  ))}
                </div>
                <p aria-live="polite">{guide.steps[step].text}</p>
                <div className="journey-actions">
                  <button disabled={step === 0} onClick={() => moveStep(step - 1)}>
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span>
                    {step + 1} of {guide.steps.length}
                  </span>
                  {step < guide.steps.length - 1 ? (
                    <button onClick={() => moveStep(step + 1)}>
                      Continue <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setJourney(null);
                        setModal('journeys');
                      }}
                    >
                      Complete <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="canvas-legend">
              {systems.map((n) => (
                <button
                  key={n.id}
                  className={!layers[n.id] ? 'muted' : ''}
                  onClick={() => setLayers((p) => ({ ...p, [n.id]: !p[n.id] }))}
                  aria-pressed={layers[n.id]}
                >
                  <i style={{ background: n.color }} />
                  {n.name}
                </button>
              ))}
            </div>
            <div className="diagram-disclaimer">
              <Info size={12} />
              <span>
                {view === 'anatomy'
                  ? 'Schematic overview · structures are simplified and depth is superimposed.'
                  : 'Relative positions preserved · buildings, distances & bridge are a learning analogy.'}
              </span>
            </div>
          </section>
          <aside className="detail-sidebar" aria-label="Structure details">
            <div className="detail-top">
              <span className="tiny-label">IN FOCUS</span>
              <IconButton
                title={saved.includes(selected) ? 'Remove from notebook' : 'Save to notebook'}
                aria-pressed={saved.includes(selected)}
                className={saved.includes(selected) ? 'bookmarked' : ''}
                onClick={toggleSave}
              >
                <Bookmark size={17} fill={saved.includes(selected) ? 'currentColor' : 'none'} />
              </IconButton>
            </div>
            <div className="organ-portrait">
              <div className="portrait-orbit orbit-one" />
              <div className="portrait-orbit orbit-two" />
              {s.system === 'organs' ? (
                <svg viewBox="-65 -70 130 140" aria-hidden="true">
                  <g transform={s.id === 'heart' ? 'translate(0 0) scale(1.2)' : 'translate(0 0)'}>
                    <Organ id={s.id} />
                  </g>
                </svg>
              ) : (
                <StructureIcon size={64} strokeWidth={1.1} style={{ color: system.color }} />
              )}
              <span className="portrait-index">
                {String(structures.findIndex((n) => n.id === selected) + 1).padStart(2, '0')} /{' '}
                {structures.length}
              </span>
            </div>
            <div className="structure-title">
              <span className="system-tag" style={{ color: system.color }}>
                <i style={{ background: system.color }} />
                {system.name === 'Organs' ? 'ORGAN' : system.name.toUpperCase()}
              </span>
              <h2>{s.name}</h2>
              <p>
                <Map size={12} /> {regions.find((r) => r.id === s.region).name}
              </p>
            </div>
            <div className="detail-tabs" role="tablist" aria-label="Structure information">
              <button
                role="tab"
                aria-selected={detailTab === 'overview'}
                className={detailTab === 'overview' ? 'active' : ''}
                onClick={() => setDetailTab('overview')}
              >
                Overview
              </button>
              <button
                role="tab"
                aria-selected={detailTab === 'connections'}
                className={detailTab === 'connections' ? 'active' : ''}
                onClick={() => setDetailTab('connections')}
              >
                Connections
              </button>
            </div>
            <div className="detail-content" aria-live="polite">
              {detailTab === 'overview' ? (
                <>
                  <div className="fact-block">
                    <h3>WHAT IT DOES</h3>
                    <p>{s.role}</p>
                  </div>
                  <div className="fact-block">
                    <h3>WHERE TO FIND IT</h3>
                    <p>{s.location}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="fact-block">
                    <h3>HOW IT CONNECTS</h3>
                    <p>{s.connection}</p>
                  </div>
                  <div className="fact-block">
                    <h3>LOOK A LITTLE CLOSER</h3>
                    <p>{s.fact}</p>
                  </div>
                </>
              )}
              <div className="city-analogy">
                <div className="city-analogy-heading">
                  <Building2 size={17} />
                  <span>IN THE BODY CITY</span>
                </div>
                <h3>{s.city}</h3>
                <p>{s.memory}</p>
                <button onClick={() => setView(view === 'city' ? 'anatomy' : 'city')}>
                  {view === 'city' ? 'See in the human body' : 'Find it in the city'}{' '}
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <button
                className="remember-button"
                onClick={() =>
                  setDetailTab(detailTab === 'connections' ? 'overview' : 'connections')
                }
              >
                <Lightbulb size={17} />
                <span>
                  {detailTab === 'connections'
                    ? 'Return to the big picture'
                    : 'Make one more connection'}
                </span>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="exploration-progress">
              <div>
                <span>Your exploration</span>
                <strong>
                  {visited.length}
                  <span> / {structures.length}</span>
                </strong>
              </div>
              <div className="progress-track">
                <span style={{ width: `${(visited.length / structures.length) * 100}%` }} />
              </div>
              <small>Every connection makes it clearer.</small>
            </div>
          </aside>
        </div>
        <footer className="page-footer">
          <span>
            <span className="footer-mark">✳</span> An extraordinary system. A new way to see it.
          </span>
          <div>
            <button onClick={() => setModal('about')}>
              About this atlas <ArrowUpRight size={12} />
            </button>
            <span>Made for learning, not diagnosis.</span>
          </div>
        </footer>
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModal(null);
          }}
        >
          <section
            className={`modal ${modal === 'quiz' ? 'quiz-modal' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            tabIndex={-1}
            ref={dialogRef}
          >
            <IconButton title="Close dialog" className="modal-close" onClick={() => setModal(null)}>
              <X size={21} />
            </IconButton>
            {modal === 'journeys' && (
              <>
                <span className="modal-eyebrow">
                  <Route size={17} /> CONNECT THE DOTS
                </span>
                <h2 id="modal-title">Take a journey through you.</h2>
                <p className="modal-intro">
                  Anatomy makes more sense when you follow the connections. Choose a path, then
                  explore it in either view.
                </p>
                <div className="journey-list">
                  {journeys.map((j, i) => (
                    <button key={j.id} onClick={() => startJourney(j.id)}>
                      <span className={`journey-number journey-${i}`}>
                        {j.id === 'signal' ? (
                          <Network />
                        ) : i === 0 ? (
                          <HeartPulse />
                        ) : i === 1 ? (
                          <Sparkles />
                        ) : (
                          <Droplets />
                        )}
                      </span>
                      <span>
                        <strong>{j.name}</strong>
                        <small>{j.subtitle}</small>
                        <em>{j.steps.length} stops · guided exploration</em>
                      </span>
                      <ArrowRight size={20} />
                    </button>
                  ))}
                </div>
                <div className="modal-note">
                  <Info size={15} /> These routes explain physiology; they are not literal paths
                  through every vessel or duct.
                </div>
              </>
            )}
            {modal === 'saved' && (
              <>
                <span className="modal-eyebrow">
                  <Bookmark size={17} /> YOUR PERSONAL ATLAS
                </span>
                <h2 id="modal-title">Keep the connections.</h2>
                <p className="modal-intro">
                  Saved structures, ready for another look. Your notebook is stored in this browser.
                </p>
                {saved.length ? (
                  <div className="notebook-list">
                    {saved.map((id) => {
                      const n = structures.find((t) => t.id === id);
                      if (!n) return null;
                      return (
                        <div key={id}>
                          <button
                            onClick={() => {
                              select(id);
                              setModal(null);
                            }}
                          >
                            <span
                              className="result-dot"
                              style={{ background: systems.find((t) => t.id === n.system).color }}
                            />
                            <span>
                              <strong>{n.name}</strong>
                              <small>{n.city}</small>
                            </span>
                            <ArrowUpRight size={17} />
                          </button>
                          <IconButton
                            title={`Remove ${n.name} from notebook`}
                            onClick={() => setSaved((p) => p.filter((t) => t !== id))}
                          >
                            <X size={16} />
                          </IconButton>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="notebook-empty">
                    <Bookmark size={34} strokeWidth={1.2} />
                    <h3>Your next discovery belongs here.</h3>
                    <p>Select a structure and tap the bookmark in its detail panel.</p>
                    <button className="primary-button" onClick={() => setModal(null)}>
                      Start exploring <ArrowRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
            {modal === 'about' && (
              <>
                <span className="modal-eyebrow">
                  <BookOpen size={17} /> A NOTE ON THE ATLAS
                </span>
                <h2 id="modal-title">A new lens. The same anatomy.</h2>
                <p className="modal-intro">
                  Corpus helps you connect anatomical landmarks with memorable city functions.
                </p>
                <div className="about-grid">
                  <div>
                    <h3>What you’re seeing</h3>
                    <p>
                      An anterior schematic of {structures.length} selected major structures. Left
                      and right refer to the person, not the viewer. Size, shape, depth, and routes
                      are simplified; posterior structures are superimposed.
                    </p>
                  </div>
                  <div>
                    <h3>What the city means</h3>
                    <p>
                      Buildings keep anatomical names and approximate relative positions. Roads
                      represent vascular, neural, and lymphatic routes. The bridge symbolically
                      joins the upper district (head, thorax, abdomen) and lower district (pelvis,
                      legs). No such bridge or separation exists in the body.
                    </p>
                  </div>
                  <div>
                    <h3>A color is a category</h3>
                    <p>
                      Red identifies arterial routes; blue identifies venous routes. These colors do
                      not indicate oxygen content. Pulmonary arteries carry deoxygenated blood;
                      pulmonary veins carry oxygenated blood.
                    </p>
                  </div>
                  <div>
                    <h3>Keep learning</h3>
                    <p>
                      This is a study aid, not a complete dissection atlas or medical advice.
                      Anatomical variation, microanatomy, and many smaller structures are not
                      represented.
                    </p>
                  </div>
                </div>
                <div className="reference-links">
                  <h3>CONTINUE WITH REFERENCE MATERIAL</h3>
                  <a
                    href="https://openstax.org/details/books/anatomy-and-physiology-2e"
                    target="_blank"
                    rel="noreferrer"
                  >
                    OpenStax · Anatomy and Physiology 2e <ExternalLink size={14} />
                  </a>
                  <a href="https://www.ncbi.nlm.nih.gov/books/" target="_blank" rel="noreferrer">
                    NCBI Bookshelf · Anatomy reference library <ExternalLink size={14} />
                  </a>
                </div>
              </>
            )}
            {modal === 'quiz' && !quizDone && (
              <>
                <span className="modal-eyebrow">
                  <GraduationCap size={18} /> A LITTLE ACTIVE RECALL
                </span>
                <div className="quiz-top">
                  <span>
                    Question {quizIndex + 1} of {quizQuestions.length}
                  </span>
                  <span>
                    {answers.filter((a, i) => a === quizQuestions[i].answer).length} correct
                  </span>
                </div>
                <div className="quiz-progress">
                  <span style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
                </div>
                <h2 id="modal-title">{quizQuestions[quizIndex].question}</h2>
                <div className="quiz-options">
                  {quizQuestions[quizIndex].options.map((id, i) => {
                    const n = structures.find((t) => t.id === id),
                      answered = answers[quizIndex],
                      correct = id === quizQuestions[quizIndex].answer;
                    return (
                      <button
                        key={id}
                        disabled={!!answered}
                        className={
                          answered ? (correct ? 'correct' : answered === id ? 'incorrect' : '') : ''
                        }
                        onClick={() => answerQuiz(id)}
                      >
                        <span className="option-letter">{'ABCD'[i]}</span>
                        {n.name}
                        {answered && correct ? (
                          <CheckCircle2 size={19} />
                        ) : answered === id ? (
                          <X size={19} />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                {answers[quizIndex] && (
                  <div className="quiz-feedback" aria-live="polite">
                    <strong>
                      {answers[quizIndex] === quizQuestions[quizIndex].answer
                        ? 'That connection is correct.'
                        : 'A useful connection to remember.'}
                    </strong>
                    <p>{quizQuestions[quizIndex].why}</p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        if (quizIndex === quizQuestions.length - 1) setQuizDone(true);
                        else setQuizIndex((i) => i + 1);
                      }}
                    >
                      {quizIndex === quizQuestions.length - 1 ? 'See my results' : 'Next question'}
                      <ArrowRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
            {modal === 'quiz' && quizDone && (
              <div className="quiz-complete">
                <span className="completion-icon">
                  <GraduationCap size={34} />
                </span>
                <span className="modal-eyebrow">CONNECTIONS MADE</span>
                <h2 id="modal-title">Keep that curiosity going.</h2>
                <div className="score">
                  {answers.filter((a, i) => a === quizQuestions[i].answer).length}
                  <span> / {quizQuestions.length}</span>
                </div>
                <p>correct answers. Every retrieval strengthens a memory.</p>
                <div className="quiz-review">
                  {quizQuestions.map((q, i) => (
                    <div key={i}>
                      {answers[i] === q.answer ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                      <button
                        onClick={() => {
                          select(q.answer);
                          setModal(null);
                        }}
                      >
                        {structures.find((n) => n.id === q.answer).name}
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="completion-actions">
                  <button className="secondary-button" onClick={startQuiz}>
                    <RotateCcw size={15} /> Try again
                  </button>
                  <button className="primary-button" onClick={() => setModal(null)}>
                    Back to exploring <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
