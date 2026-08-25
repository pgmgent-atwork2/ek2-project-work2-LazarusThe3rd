import React from "react";
import "../../css/aquariumCard.css";

export default function UnitCard({ unit, onClick }) {
  return (
    <div
      className="aquarium-card"
      onClick={() => onClick(unit)}
      style={{ cursor: "pointer" }}
    >
      <div className="aquarium-header">
        <div>
          <h3 className="aquarium-title">{unit.naam}</h3>
          <div className="aquarium-info">
            <span className="location-section">
              <span className="location-badge">{unit.locatie}</span>
            </span>
          </div>
        </div>
        <span
          className={`status-badge ${unit.status?.toLowerCase() || "inactive"}`}
        >
          {unit.status || "Inactive"}
        </span>
      </div>

      {unit.waarden_range && (
        <div style={{ marginTop: "12px", fontSize: "13px", color: "#475569" }}>
          <p style={{ margin: "0 0 6px 0", fontWeight: "600" }}>
            Waarden Range:
          </p>
          <ul style={{ margin: "0", paddingLeft: "20px" }}>
            <li>
              pH: {unit.waarden_range.ph_min} - {unit.waarden_range.ph_max}
            </li>
            <li>
              Temp: {unit.waarden_range.temperatuur_min}°C -{" "}
              {unit.waarden_range.temperatuur_max}°C
            </li>
            <li>
              Water Level: {unit.waarden_range.water_level_min} -{" "}
              {unit.waarden_range.water_level_max}
            </li>
            <li>
              Zoutgehalte: {unit.waarden_range.zoutgehalte_min} -{" "}
              {unit.waarden_range.zoutgehalte_max}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
