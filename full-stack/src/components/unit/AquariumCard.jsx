import { useState, useEffect, useCallback } from "react";

import { useParams } from "react-router-dom";
import { getFiltratieUnitById } from "../../api/filtratie_unit/api.filtratie_unit.ts";
import {
  addFiltratieWaarde,
  getFiltratieWaardenByUnitId,
} from "../../api/filtratie_waarden/api.filtratie_waarden.ts";
import { useAuth } from "../../context/auth";
import PreviousLogsSection from "./PreviousLogsSection";
import "../../css/aquariumCard.css";

// ─── Mock data – replace with your DB/API calls ───────────────────────────────
// const MOCK_TANK = {
//   id: "tank-001",
//   naam: "Coral Reef Display",
//   location: "Aquarium Hall",
//   status: "active", // "active" | "warning" | "inactive"
//   lastInspection: new Date("2026-05-04T22:47:06"),
//   parameters: [
//     { key: "pH",          value: 7.78, unit: "",      min: 7.2,  max: 8.4,  decimals: 2 },
//     { key: "Chlorine",    value: 1.98, unit: "mg/L",  min: 0.5,  max: 3,    decimals: 2 },
//     { key: "Temperature", value: 24.5, unit: "°C",    min: 22,   max: 28,   decimals: 1 },
//     { key: "Salinity",    value: 33.3, unit: "ppt",   min: 30,   max: 36,   decimals: 1 },
//   ],
// };
// ─────────────────────────────────────────────────────────────────────────────

// Utilities
function formatDate(date) {
  return date.toLocaleString("nl-NL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function getParamStatus(value, min, max) {
  if (value < min || value > max) return "danger";
  const buffer = (max - min) * 0.1;
  if (value < min + buffer || value > max - buffer) return "warning";
  return "ok";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ParamCard({ label, value, unit, min, max, decimals }) {
  const status = getParamStatus(value, min, max);

  return (
    <div className="param-card">
      <div className="param-label">{label}</div>
      <div className={`param-value ${status}`}>
        {value.toFixed(decimals)}
        <span className="param-unit">{unit}</span>
      </div>
      <div className={`param-range ${status === "ok" ? "in-range" : ""}`}>
        target {min}–{max}
      </div>
    </div>
  );
}

// ─── Log Entry Modal (stub – wire up your own submit handler) ─────────────────

function LogEntryModal({ tank, onClose, onSubmit }) {
  const [fields, setFields] = useState(() =>
    Object.fromEntries(tank.parameters.map((p) => [p.key, ""])),
  );
  const [notes, setNotes] = useState("");

  function handleChange(key, val) {
    setFields((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const entry = {
      tankId: tank.id,
      timestamp: new Date(),
      readings: fields,
      notes,
    };
    onSubmit(entry);
    onClose();
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add Log Entry</h2>
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div>
            {tank.parameters.map((p) => (
              <label key={p.key} className="form-label">
                <span className="form-label-text">
                  {p.key}{" "}
                  <span className="form-label-hint">
                    ({p.min}–{p.max}
                    {p.unit})
                  </span>
                </span>
                <input
                  type="number"
                  step="any"
                  placeholder={`e.g. ${p.value}`}
                  value={fields[p.key]}
                  onChange={(e) => handleChange(p.key, e.target.value)}
                  className="form-input"
                />
              </label>
            ))}
          </div>

          <label className="form-label">
            <span className="form-label-text">Notes</span>
            <textarea
              rows={3}
              placeholder="Optional observations…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="form-textarea"
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * AquariumCard
 *
 * Props:
 *   unitId – optional unit ID to fetch data from API (required for real data)
 *   tank  – tank data object (defaults to MOCK_TANK for development)
 *   onLogSubmit(entry) – called when the user saves a log entry; wire this to your DB
 */

export default function AquariumCard({ onLogSubmit }) {
  const { id } = useParams();
  const { auth } = useAuth();
  const [tank, setTank] = useState();
  const [allWaarden, setAllWaarden] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch tank data function

  const fetchTankData = useCallback(async () => {
    if (!id) return;

    setLoading(true);

    const [unitData, waardenData] = await Promise.all([
      getFiltratieUnitById(id),
      getFiltratieWaardenByUnitId(id),
    ]);

    console.log("Fetched unit data:", unitData);
    console.log("Fetched waarden data:", waardenData);

    if (unitData) {
      const latestWaarde = unitData.latestWaarde;

      const range = Array.isArray(unitData.waarden_range)
        ? unitData.waarden_range[0]
        : unitData.waarden_range;

      const transformedTank = {
        id: unitData.id,
        naam: unitData.naam,
        location: unitData.locatie,
        status: "active",
        lastInspection: latestWaarde?.gemeten_op
          ? new Date(latestWaarde.gemeten_op)
          : new Date(),
        parameters: range
          ? [
              {
                key: "pH",
                value: latestWaarde?.ph ?? 0,
                unit: "",
                min: range.ph_min,
                max: range.ph_max,
                decimals: 2,
              },
              {
                key: "Temperatuur",
                value: latestWaarde?.temperatuur ?? 0,
                unit: "°C",
                min: range.temperatuur_min,
                max: range.temperatuur_max,
                decimals: 1,
              },
              {
                key: "Water Level",
                value: latestWaarde?.water_level ?? 0,
                unit: "",
                min: range.water_level_min,
                max: range.water_level_max,
                decimals: 2,
              },
              {
                key: "Zoutgehalte",
                value: latestWaarde?.zoutgehalte ?? 0,
                unit: "ppt",
                min: range.zoutgehalte_min,
                max: range.zoutgehalte_max,
                decimals: 1,
              },
              {
                key: "Microbiologie",
                value: latestWaarde?.microbiologie ?? 0,
                unit: "",
                min: 0,
                max: range.microbiologie_max,
                decimals: 2,
              },
            ]
          : [],
        latestWaarde,
        waarden_range: range,
      };

      setTank(transformedTank);
      setAllWaarden(waardenData || []);
    }

    setLoading(false);
  }, [id]);

  // Fetch data on mount
  useEffect(() => {
    fetchTankData();
  }, [fetchTankData]);

  async function handleLogSubmit(entry) {
    try {
      // Transform form data to API format
      const waarde = {
        unit_id: entry.tankId,
        gemeten_op: entry.timestamp.toISOString(),
        medewerker_id: auth?.user?.id,
        ph: entry.readings["pH"] ? parseFloat(entry.readings["pH"]) : null,
        temperatuur: entry.readings["Temperatuur"]
          ? parseFloat(entry.readings["Temperatuur"])
          : null,
        water_level: entry.readings["Water Level"]
          ? parseFloat(entry.readings["Water Level"])
          : null,
        zoutgehalte: entry.readings["Zoutgehalte"]
          ? parseFloat(entry.readings["Zoutgehalte"])
          : null,
        microbiologie: entry.readings["Microbiologie"]
          ? parseFloat(entry.readings["Microbiologie"])
          : null,
        notitie: entry.notes || null,
      };

      const result = await addFiltratieWaarde(waarde);

      if (result) {
        console.log("Filtratie waarde added successfully:", result);
        onLogSubmit?.(entry);
        // Refetch tank data to show updated values
        await fetchTankData();
      } else {
        console.error("Failed to add filtratie waarde");
      }
    } catch (error) {
      console.error("Error adding log entry:", error);
    }
  }

  return (
    <>
      {loading && <div>Loading tank data...</div>}

      {!loading && (
        <div className="aquarium-card">
          <div className="aquarium-header">
            <div>
              <h1 className="aquarium-title">{tank.naam}</h1>
              <div className="aquarium-info">
                <span className="location-section">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="location-badge">{tank.location}</span>
                </span>
                <span className="inspection-info">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  Last inspection {formatDate(tank.lastInspection)}
                </span>
              </div>
            </div>
          </div>

          {/* Parameter cards */}
          <div className="param-cards-container">
            {tank.parameters.map((p) => (
              <ParamCard
                key={p.key}
                label={p.key}
                value={p.value}
                unit={p.unit}
                min={p.min}
                max={p.max}
                decimals={p.decimals}
              />
            ))}
          </div>

          {/* Notes section */}
          {tank.latestWaarde?.notitie && (
            <div className="notes-section">
              <h3 className="notes-title">Latest Note</h3>
              <p className="notes-content">{tank.latestWaarde.notitie}</p>
            </div>
          )}

          {/* Footer actions */}
          <div className="card-footer">
            <button
              className="btn-log-entry"
              onClick={() => setModalOpen(true)}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add log entry
            </button>
          </div>
        </div>
      )}

      {!loading && tank && (
        <PreviousLogsSection logs={allWaarden} range={tank.waarden_range} />
      )}

      {modalOpen && (
        <LogEntryModal
          tank={tank}
          onClose={() => setModalOpen(false)}
          onSubmit={handleLogSubmit}
        />
      )}
    </>
  );
}
