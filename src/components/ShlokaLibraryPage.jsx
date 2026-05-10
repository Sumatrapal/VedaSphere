// ─────────────────────────────────────────────────────────────────────────────
// ShlokaLibraryPage.jsx  —  Searchable, filterable grid of 205 shlokas
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import { SHLOKAS, ALL_CATS } from "../data/data";
import ShlokaModal from "./ShlokaModal";

export default function ShlokaLibraryPage({ setView, favorites, toggleFav, askAboutShloka }) {
  const [libFilter, setLibFilter] = useState("All");
  const [libSearch, setLibSearch] = useState("");
  const [selectedShloka, setSelectedShloka] = useState(null);

  const filtered = SHLOKAS.filter(s => {
    if (libFilter === "Favourites" && !favorites.has(s.id)) return false;
    if (libFilter !== "All" && libFilter !== "Favourites" && s.category !== libFilter) return false;
    if (libSearch) {
      const q = libSearch.toLowerCase();
      return (
        s.translation.toLowerCase().includes(q) ||
        s.source.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.sanskrit.includes(libSearch)
      );
    }
    return true;
  });

  return (
    <div className="library-page fadein">
      <div className="page-header">
        <div>
          <div className="page-header-title">📜 Shloka Library</div>
          <div className="page-header-sub">{SHLOKAS.length} sacred verses · Click any card to read in full</div>
        </div>
        <button className="back-btn" onClick={() => setView("landing")}>← Home</button>
      </div>

      <div className="library-controls">
        <input
          className="search-input"
          placeholder="Search shlokas…"
          value={libSearch}
          onChange={e => setLibSearch(e.target.value)}
        />
        {ALL_CATS.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${libFilter === cat ? "active" : ""}`}
            onClick={() => setLibFilter(cat)}
          >
            {cat === "Favourites" ? `♥ Saved (${favorites.size})` : cat}
          </button>
        ))}
      </div>

      <div className="library-grid">
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "52px 0", color: "var(--text-dim)", fontSize: 14 }}>
            {libFilter === "Favourites"
              ? "No saved shlokas yet. Tap ♡ on any verse to save it."
              : "No shlokas match your search."}
          </div>
        )}
        {filtered.map(s => (
          <div key={s.id} className="shloka-card" onClick={() => setSelectedShloka(s)}>
            <div className="card-tag">{s.category}</div>
            <div className="card-sanskrit">{s.sanskrit}</div>
            <div className="card-translation">{s.translation}</div>
            <div className="card-footer">
              <div className="card-source">{s.source}</div>
              <div className="card-actions" onClick={e => e.stopPropagation()}>
                <button
                  className={`card-action-btn ${favorites.has(s.id) ? "fav" : ""}`}
                  onClick={() => toggleFav(s.id)}
                  title="Save"
                >
                  {favorites.has(s.id) ? "♥" : "♡"}
                </button>
                <button className="card-action-btn" onClick={() => askAboutShloka(s)} title="Ask Veda">
                  💬
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedShloka && (
        <ShlokaModal
          shloka={selectedShloka}
          onClose={() => setSelectedShloka(null)}
          onAsk={shloka => { setSelectedShloka(null); askAboutShloka(shloka); }}
          onFav={toggleFav}
          isFav={favorites.has(selectedShloka.id)}
        />
      )}
    </div>
  );
}
