import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFiltratieUnits } from "../api/filtratie_unit/api.filtratie_unit.ts";
import UnitCard from "../components/unit/UnitCard";
import "../css/units.css";

const Home = () => {
  const navigate = useNavigate();
  const [filtratieUnits, setFiltratieUnits] = useState([]);

  const fetchFiltratieUnits = async () => {
    try {
      const data = await getFiltratieUnits();
      setFiltratieUnits(data || []);
      console.log("Fetched filtratie units homepage:", data);
    } catch (error) {
      console.error("Error fetching filtratie units:", error);
    }
  };

  useEffect(() => {
    fetchFiltratieUnits();
  }, []);

  const getUnitStatus = (unit) => {
    if (!unit.latestWaarde) {
      return "Malfunction";
    }

    const latest = unit.latestWaarde;

    const range = Array.isArray(unit.waarden_range)
      ? unit.waarden_range[0]
      : unit.waarden_range;

    if (!range) {
      return "Malfunction";
    }

    const isOutOfRange =
      (latest.ph !== null &&
        latest.ph !== undefined &&
        (latest.ph < range.ph_min || latest.ph > range.ph_max)) ||
      (latest.temperatuur !== null &&
        latest.temperatuur !== undefined &&
        (latest.temperatuur < range.temperatuur_min ||
          latest.temperatuur > range.temperatuur_max)) ||
      (latest.water_level !== null &&
        latest.water_level !== undefined &&
        (latest.water_level < range.water_level_min ||
          latest.water_level > range.water_level_max)) ||
      (latest.zoutgehalte !== null &&
        latest.zoutgehalte !== undefined &&
        (latest.zoutgehalte < range.zoutgehalte_min ||
          latest.zoutgehalte > range.zoutgehalte_max));

    return isOutOfRange ? "Maintenance" : "Active";
  };

  return (
    <main className="units-page">
      <header className="units-page-header">
        <div>
          <h1>Filtration Units</h1>
          <p>Monitor and manage all filtration units.</p>
        </div>
      </header>

      <div className="units-grid">
        {filtratieUnits && filtratieUnits.length > 0 ? (
          filtratieUnits.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={{ ...unit, status: getUnitStatus(unit) }}
              onClick={(u) => navigate(`/units/${u.id}`)}
            />
          ))
        ) : (
          <div className="units-empty">
            <h3>No filtration units</h3>
            <p>There are currently no filtration units available.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
