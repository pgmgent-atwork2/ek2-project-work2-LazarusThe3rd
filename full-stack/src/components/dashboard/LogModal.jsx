import { useState } from "react";
import "../../css/LogModal.css";

export default function LogModal({ units, onClose, onSave }) {
  const [unitId, setUnitId] = useState(units[0]?.id ?? "");
  const [notes, setNotes] = useState("");

  function handleSave() {
    const unit = units.find((u) => u.id === Number(unitId));

    onSave({
      unit,
      notes,
      timestamp: new Date().toLocaleString(),
    });

    onClose();
  }

  return (
    <div
      className="log-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="log-modal">
        <h3>Log Entry</h3>

        <p className="log-modal-description">
          Record a new inspection or maintenance note.
        </p>

        <div className="log-modal-form">
          <div className="log-modal-field">
            <label htmlFor="log-filtration-unit">Filtration unit</label>

            <select
              id="log-filtration-unit"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.naam}
                </option>
              ))}
            </select>
          </div>

          <div className="log-modal-field">
            <label htmlFor="log-notes">Notes</label>

            <textarea
              id="log-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what was checked or done…"
            />
          </div>
        </div>

        <div className="log-modal-actions">
          <button type="button" className="log-modal-cancel" onClick={onClose}>
            Cancel
          </button>

          <button type="button" className="log-modal-save" onClick={handleSave}>
            Save log
          </button>
        </div>
      </div>
    </div>
  );
}
