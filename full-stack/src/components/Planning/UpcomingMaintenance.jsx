import { useMemo } from "react";
import { format } from "date-fns";
import "../../css/UpcomingMaintenance.css";

const UpcomingMaintenance = ({
  items = [],
  onItemClick = () => {},
  variant = "default",
}) => {
  const upcomingItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return items
      .filter((item) => {
        if (item.status !== "gepland") return false;

        const planDate = new Date(item.start_datum);
        planDate.setHours(0, 0, 0, 0);

        return planDate >= today;
      })
      .sort((a, b) => new Date(a.start_datum) - new Date(b.start_datum))
      .slice(0, 5);
  }, [items]);

  return (
    <section
      className={`upcoming-maintenance ${
        variant === "dashboard" ? "upcoming-maintenance--dashboard" : ""
      }`}
    >
      <div className="maintenance-header">
        <div>
          <h3>Upcoming Maintenance</h3>
          <p>Next scheduled tasks across all units</p>
        </div>

        <span className="maintenance-count">{upcomingItems.length}</span>
      </div>

      {upcomingItems.length === 0 ? (
        <div className="maintenance-empty">
          <p>No upcoming maintenance scheduled</p>
        </div>
      ) : (
        <div className="maintenance-list">
          {upcomingItems.map((item) => (
            <article
              key={item.id}
              className="maintenance-item"
              onClick={() => onItemClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onItemClick(item);
                }
              }}
            >
              <div className="maintenance-item-content">
                <div className="maintenance-item-top">
                  <h4>{item.unit?.naam || "Unknown Unit"}</h4>

                  <span className="maintenance-status">Scheduled</span>
                </div>

                <p className="maintenance-note">
                  {item.notitie || "Maintenance task"}
                </p>

                <footer className="maintenance-meta">
                  <span>{item.gebruiker?.naam || "Unassigned"}</span>

                  <time dateTime={item.start_datum}>
                    {format(new Date(item.start_datum), "dd MMM yyyy")}
                  </time>
                </footer>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default UpcomingMaintenance;
