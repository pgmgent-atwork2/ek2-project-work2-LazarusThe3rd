import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFiltratieUnits,
  deleteFiltratieUnit,
} from "../api/filtratie_unit/api.filtratie_unit.ts";
import { useAuth } from "../context/auth";
import { getOnderhoudItems } from "../api/onderhoud/api.onderhoud.ts";
import UpcomingMaintenance from "../components/Planning/UpcomingMaintenance";
import { getStatus } from "../components/status.ts";
import { UNIT_STATUS } from "../types/types.enums.ts";
import StatCard from "../components/dashboard/StatCard";
import LogModal from "../components/dashboard/LogModal";
import StatusBadge from "../components/dashboard/StatusBadge";
import UnitDetailModal from "../components/dashboard/UnitDetailModal";
import PhChart from "../components/dashboard/PhChart";
import CreateFiltratieUnitForm from "../components/Admin/CreateFiltratieUnitForm";
import "../css/dashboard.css";

// ── Main dashboard ─────────────────────────────────────────────────────────

export default function AquariumDashboard() {
  const navigate = useNavigate();
  const [user, setuser] = useState(null);
  const { auth } = useAuth();

  // Helper function to get unit status using status.ts
  const getUnitStatus = (unit) => {
    if (!unit.latestWaarde) {
      return "Malfunction";
    }

    const waarde = unit.latestWaarde;
    const range = Array.isArray(unit.waarden_range)
      ? unit.waarden_range[0]
      : unit.waarden_range;

    if (!range) {
      return "Malfunction";
    }

    const status = getStatus(
      waarde.ph,
      waarde.temperatuur,
      waarde.water_level,
      waarde.zoutgehalte,
      waarde.microbiologie,
      range,
    );

    // Map enum values to display labels
    switch (status) {
      case UNIT_STATUS.ACTIEF:
        return "Active";
      case UNIT_STATUS.ONDERHOUD_NODIG:
        return "Maintenance";
      case UNIT_STATUS.STORING:
        return "Malfunction";
      default:
        return "Malfunction";
    }
  };

  const [units, setUnits] = useState([]);

  const [maintenanceItems, setMaintenanceItems] = useState([]);
  const [stats, setStats] = useState([
    {
      label: "Total units",
      value: 0,
      icon: "⌾",
      description: "installations",
      variant: "primary",
    },
    {
      label: "Active",
      value: 0,
      icon: "⌁",
      description: "operating normally",
      variant: "success",
    },
    {
      label: "Need attention",
      value: 0,
      icon: "△",
      description: "require review",
      variant: "warning",
    },
    {
      label: "Logs today",
      value: 0,
      icon: "▤",
      description: "measurements logged",
      variant: "neutral",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showCreateUnitForm, setShowCreateUnitForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [editUnit, setEditUnit] = useState(null);

  // Fetch units on mount
  useEffect(() => {
    const fetchData = async () => {
      const data = await getFiltratieUnits();
      setUnits(data || []);

      const maintenanceData = await getOnderhoudItems();
      setMaintenanceItems(maintenanceData || []);

      setuser(auth?.user);
    };

    fetchData();
  }, [auth]); //

  // Update stats when units change
  useEffect(() => {
    const activeCount = units.filter(
      (u) => getUnitStatus(u) === "Active",
    ).length;
    const needAttentionCount = units.filter((u) => {
      const status = getUnitStatus(u);
      return status === "Maintenance" || status === "Malfunction";
    }).length;
    const logsToday = units.filter((u) => {
      if (!u.latestWaarde?.gemeten_op) return false;
      const logDate = new Date(u.latestWaarde.gemeten_op).toDateString();
      const today = new Date().toDateString();
      return logDate === today;
    }).length;

    setStats([
      {
        label: "Total units",
        value: units.length,
        icon: "⌾",
        description: "installations",
        variant: "primary",
      },
      {
        label: "Active",
        value: activeCount,
        icon: "⌁",
        description: "operating normally",
        variant: "success",
      },
      {
        label: "Need attention",
        value: needAttentionCount,
        icon: "△",
        description: "require review",
        variant: "warning",
      },
      {
        label: "Logs today",
        value: logsToday,
        icon: "▤",
        description: "measurements logged",
        variant: "neutral",
      },
    ]);
  }, [units]);

  const handleUnitSaved = async (savedUnit) => {
    console.log("Unit saved:", savedUnit);
    setShowCreateUnitForm(false);
    setEditUnit(null);
    setSelectedUnit(null);
    // Refresh units list
    const data = await getFiltratieUnits();
    setUnits(data || []);
  };

  const handleEditUnit = (unit) => {
    setEditUnit(unit);
    setShowCreateUnitForm(true);
    setSelectedUnit(null);
  };

  const handleDeleteUnit = async (unitId) => {
    const success = await deleteFiltratieUnit(unitId);
    if (success) {
      console.log("Unit deleted successfully");
      setSelectedUnit(null);
      // Refresh units list
      const data = await getFiltratieUnits();
      setUnits(data || []);
    } else {
      alert("Fout bij het verwijderen van de unit");
    }
  };

  const handleCancelForm = () => {
    setShowCreateUnitForm(false);
    setEditUnit(null);
  };

  const isAdmin = auth?.user?.rol === "admin";

  return (
    <>
      <div className="dash-root">
        {/* ── Top bar ── */}
        <div className="topbar">
          <div className="greeting">
            <h1>Welcome, {user?.naam}</h1>
            <p>Here's the state of the park's life support today.</p>
          </div>
          {isAdmin && (
            <button
              className="btn-log"
              onClick={() => setShowCreateUnitForm(true)}
            >
              + Nieuwe Filtratie Unit
            </button>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="stats-row">
          {stats.map((s) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              value={s.value}
              label={s.label}
              description={s.description}
              variant={s.variant}
            />
          ))}
        </div>

        <div className="dashboard-chart">
          <PhChart />
        </div>

        {/* ── Units ── */}
        {/* ── Dashboard overview ── */}
        <div className="dashboard-overview-grid">
          {/* Unit status overview */}
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Unit Status Overview</h2>
                <p className="dashboard-panel-subtitle">
                  Current status across all filtration units
                </p>
              </div>

              <button
                className="dashboard-panel-link"
                onClick={() => navigate("/units")}
              >
                View all
              </button>
            </div>

            <div className="unit-status-list">
              {units.length === 0 ? (
                <div className="dashboard-empty">
                  No filtration units available.
                </div>
              ) : (
                units.map((unit) => (
                  <button
                    key={unit.id}
                    className="unit-status-row"
                    onClick={() =>
                      setSelectedUnit({
                        ...unit,
                        status: getUnitStatus(unit),
                      })
                    }
                  >
                    <div className="unit-status-info">
                      <span className="unit-status-name">{unit.naam}</span>

                      <span className="unit-status-location">
                        {unit.locatie}
                      </span>
                    </div>

                    <StatusBadge status={getUnitStatus(unit)} />
                  </button>
                ))
              )}
            </div>
          </section>

          {/* Upcoming maintenance */}
          <UpcomingMaintenance
            items={maintenanceItems}
            variant="dashboard"
            onItemClick={(item) => {
              setShowModal(true);
            }}
          />
        </div>

        {/* ── Log modal ── */}
        {showModal && (
          <LogModal
            units={units}
            onClose={() => setShowModal(false)}
            onSave={null /* Implement log saving logic here */}
          />
        )}

        {/* ── Unit detail modal ── */}
        <UnitDetailModal
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onViewDetails={(unit) => navigate(`/units/${unit.id}`)}
          onDelete={handleDeleteUnit}
          onEdit={handleEditUnit}
          isAdmin={isAdmin}
        />

        {/* ── Create/Edit filtratie unit form ── */}
        {showCreateUnitForm && isAdmin && (
          <CreateFiltratieUnitForm
            onSuccess={handleUnitSaved}
            onCancel={handleCancelForm}
            editUnit={editUnit}
          />
        )}
      </div>
    </>
  );
}
