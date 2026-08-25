import StatusBadge from "./StatusBadge";

export default function UnitCard({ unit, onClick }) {
  const latestValue = unit.latestWaarde;

  const lastInspection = latestValue?.gemeten_op
    ? new Date(latestValue.gemeten_op).toLocaleString("nl-NL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "No inspection recorded";

  return (
    <article
      className="unit-card"
      onClick={() => onClick(unit)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(unit);
        }
      }}
    >
      <div className="unit-card-top">
        <div className="unit-card-heading">
          <h3 className="unit-name">{unit.naam}</h3>

          <p className="unit-location">{unit.locatie}</p>
        </div>

        <StatusBadge status={unit.status} />
      </div>

      <div className="unit-card-divider" />

      <div className="unit-card-details">
        <div className="unit-card-detail">
          <span className="unit-card-detail-label">Last inspection</span>
          <span className="unit-card-detail-value">{lastInspection}</span>
        </div>

        <span className="unit-card-arrow" aria-hidden="true">
          →
        </span>
      </div>
    </article>
  );
}
