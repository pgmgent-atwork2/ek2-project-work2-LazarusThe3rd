export default function StatCard({
  icon,
  value,
  label,
  description,
  variant = "default",
}) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-label">{label}</span>

        <span className="stat-card-icon" aria-hidden="true">
          {icon}
        </span>
      </div>

      <div className="stat-card-value">{value}</div>

      {description && (
        <div className="stat-card-description">{description}</div>
      )}
    </div>
  );
}
