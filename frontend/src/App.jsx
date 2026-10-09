import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  PawPrint,
  Pill,
  ClipboardList,
  History,
  BarChart3,
  Receipt,
  Search,
  Plus,
  ArrowUpRight,
  Activity,
  Package,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  RefreshCw,
} from "lucide-react";

import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8081";

const pageTitles = {
  dashboard: ["Dashboard", "Overview of your veterinary inventory"],
  owners: ["Owners", "Manage pet owners and contact information"],
  animals: ["Animals", "View animals registered in your clinic"],
  medicines: ["Medicines", "Monitor medicine inventory and availability"],
  prescriptions: ["Prescriptions", "Create and manage prescriptions"],
  history: ["Prescription History", "Review complete prescription records"],
  insights: ["Medicine Insights", "Understand medicine usage and inventory"],
  billing: ["Billing & Cost", "Calculate prescription costs"],
};

function App() {
  const [page, setPage] = useState("dashboard");

  const [owners, setOwners] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [details, setDetails] = useState([]);
  const [aboveAverage, setAboveAverage] = useState([]);

  const [backendOnline, setBackendOnline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const [costId, setCostId] = useState("");
  const [cost, setCost] = useState(null);
  const [costLoading, setCostLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [ownersRes, animalsRes, medicinesRes, prescriptionsRes] =
        await Promise.all([
          fetch(`${API}/owners`),
          fetch(`${API}/animals`),
          fetch(`${API}/medicines`),
          fetch(`${API}/prescriptions`),
        ]);

      if (
        !ownersRes.ok ||
        !animalsRes.ok ||
        !medicinesRes.ok ||
        !prescriptionsRes.ok
      ) {
        throw new Error("Backend request failed");
      }

      const [ownersData, animalsData, medicinesData, prescriptionsData] =
        await Promise.all([
          ownersRes.json(),
          animalsRes.json(),
          medicinesRes.json(),
          prescriptionsRes.json(),
        ]);

      setOwners(ownersData);
      setAnimals(animalsData);
      setMedicines(medicinesData);
      setPrescriptions(prescriptionsData);
      setBackendOnline(true);
    } catch (error) {
      console.error(error);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadDetails = async () => {
    try {
      const response = await fetch(`${API}/prescriptions/details`);

      if (!response.ok) throw new Error("Unable to load history");

      const data = await response.json();
      setDetails(data);
      setPage("history");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load prescription history");
    }
  };

  const loadAboveAverage = async () => {
    try {
      const response = await fetch(`${API}/prescriptions/above-average`);

      if (!response.ok) throw new Error("Unable to load insights");

      const data = await response.json();
      setAboveAverage(data);
      setPage("insights");
    } catch (error) {
      console.error(error);
      setMessage("Unable to load medicine insights");
    }
  };

  const calculateCost = async () => {
    if (!costId) {
      setMessage("Please select a prescription");
      return;
    }

    setCostLoading(true);
    setCost(null);

    try {
      const response = await fetch(`${API}/prescriptions/${costId}/cost`);

      if (!response.ok) throw new Error("Unable to calculate cost");

      const data = await response.json();
      setCost(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to calculate prescription cost");
    } finally {
      setCostLoading(false);
    }
  };

  const createPrescription = async (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const data = {
      animalId: Number(form.get("animalId")),
      medicineId: Number(form.get("medicineId")),
      quantity: Number(form.get("quantity")),
      dosage: form.get("dosage"),
      prescriptionDate: form.get("prescriptionDate"),
    };

    try {
      const response = await fetch(`${API}/prescriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Unable to create prescription");
      }

      setMessage("Prescription created successfully");
      event.target.reset();

      await loadData();
    } catch (error) {
      console.error(error);
      setMessage(error.message || "Unable to create prescription");
    }
  };

  const navigate = (target) => {
    setMessage("");
    setSearch("");

    if (target === "history") {
      loadDetails();
      return;
    }

    if (target === "insights") {
      loadAboveAverage();
      return;
    }

    setPage(target);
  };

  const currentTitle = pageTitles[page] || pageTitles.dashboard;

  return (
    <div className="app-shell">
      <Sidebar page={page} navigate={navigate} />

      <main className="main-content">
        <Header
          title={currentTitle[0]}
          subtitle={currentTitle[1]}
          backendOnline={backendOnline}
          refresh={loadData}
        />

        {message && (
          <div className="toast">
            <CheckCircle2 size={18} />
            <span>{message}</span>
            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {!backendOnline && !loading && (
          <div className="connection-alert">
            <AlertTriangle size={18} />
            <div>
              <strong>Backend unavailable</strong>
              <span>
                Start the Spring Boot server on port 8081 and refresh the page.
              </span>
            </div>
          </div>
        )}

        <div className="page-container">
          {page === "dashboard" && (
            <Dashboard
              owners={owners}
              animals={animals}
              medicines={medicines}
              prescriptions={prescriptions}
              loading={loading}
              navigate={navigate}
            />
          )}

          {page === "owners" && (
            <DataPage
              title="Owner Directory"
              subtitle="Registered pet owners and their contact details"
              icon={<Users size={22} />}
              search={search}
              setSearch={setSearch}
              columns={["ID", "Owner", "Phone", "Email", "Address"]}
              data={owners
                .filter((x) =>
                  `${x.ownerName} ${x.phone} ${x.email}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((x) => [
                  x.ownerId,
                  x.ownerName,
                  x.phone,
                  x.email || "—",
                  x.address || "—",
                ])}
              loading={loading}
            />
          )}

          {page === "animals" && (
            <DataPage
              title="Animal Registry"
              subtitle="Animals registered under your veterinary clinic"
              icon={<PawPrint size={22} />}
              search={search}
              setSearch={setSearch}
              columns={["ID", "Animal", "Species", "Breed", "Age", "Owner"]}
              data={animals
                .filter((x) =>
                  `${x.animalName} ${x.species} ${x.breed} ${x.ownerId}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
                )
                .map((x) => [
                  x.animalId,
                  x.animalName,
                  x.species,
                  x.breed || "—",
                  `${x.age} yrs`,
                  getOwnerName(x.ownerId, owners),
                ])}
              loading={loading}
            />
          )}

          {page === "medicines" && (
            <MedicinePage
              medicines={medicines}
              search={search}
              setSearch={setSearch}
              loading={loading}
            />
          )}

          {page === "prescriptions" && (
            <PrescriptionsPage
              animals={animals}
              medicines={medicines}
              prescriptions={prescriptions}
              createPrescription={createPrescription}
              loading={loading}
            />
          )}

          {page === "history" && (
            <HistoryPage
              details={details}
              loading={details.length === 0 && loading}
            />
          )}

          {page === "insights" && (
            <InsightsPage
              data={aboveAverage}
              medicines={medicines}
              loading={loading}
            />
          )}

          {page === "billing" && (
            <BillingPage
              prescriptions={prescriptions}
              costId={costId}
              setCostId={setCostId}
              cost={cost}
              costLoading={costLoading}
              calculateCost={calculateCost}
            />
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- SIDEBAR ---------------- */

function Sidebar({ page, navigate }) {
  const items = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={19} />,
    },
    {
      id: "owners",
      label: "Owners",
      icon: <Users size={19} />,
    },
    {
      id: "animals",
      label: "Animals",
      icon: <PawPrint size={19} />,
    },
    {
      id: "medicines",
      label: "Medicines",
      icon: <Pill size={19} />,
    },
    {
      id: "prescriptions",
      label: "Prescriptions",
      icon: <ClipboardList size={19} />,
    },
    {
      id: "history",
      label: "Prescription History",
      icon: <History size={19} />,
    },
    {
      id: "insights",
      label: "Medicine Insights",
      icon: <BarChart3 size={19} />,
    },
    {
      id: "billing",
      label: "Billing & Cost",
      icon: <Receipt size={19} />,
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <PawPrint size={25} />
        </div>

        <div>
          <h2>VetCare</h2>
          <span>Inventory Management</span>
        </div>
      </div>

      <div className="sidebar-section-label">Workspace</div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${page === item.id ? "active" : ""}`}
            onClick={() => navigate(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="clinic-status">
          <span className="status-dot" />
          Clinic Inventory
        </div>
        <small>VetCare Management System</small>
      </div>
    </aside>
  );
}

/* ---------------- HEADER ---------------- */

function Header({ title, subtitle, backendOnline, refresh }) {
  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">VETERINARY MANAGEMENT</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="topbar-actions">
        <button className="icon-button" onClick={refresh} title="Refresh data">
          <RefreshCw size={18} />
        </button>

        <div className={`backend-status ${backendOnline ? "online" : "offline"}`}>
          <span />
          {backendOnline ? "System Connected" : "System Offline"}
        </div>
      </div>
    </header>
  );
}

/* ---------------- DASHBOARD ---------------- */

function Dashboard({
  owners,
  animals,
  medicines,
  prescriptions,
  loading,
  navigate,
}) {
  const lowStock = medicines.filter((m) => m.stock < 30);

  const recent = [...prescriptions]
    .sort(
      (a, b) =>
        new Date(b.prescriptionDate) - new Date(a.prescriptionDate)
    )
    .slice(0, 5);

  return (
    <div className="dashboard">
      <section className="welcome-card">
        <div>
          <span className="eyebrow">CLINIC OVERVIEW</span>
          <h2>Everything your clinic needs, in one place.</h2>
          <p>
            Manage owners, animals, medicine inventory and prescriptions
            through one organized workspace.
          </p>

          <div className="welcome-actions">
            <button
              className="primary-button"
              onClick={() => navigate("prescriptions")}
            >
              <Plus size={17} />
              New Prescription
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate("medicines")}
            >
              View Inventory
              <ArrowUpRight size={17} />
            </button>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="pulse-ring" />
          <PawPrint size={70} />
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Total Owners"
          value={loading ? "—" : owners.length}
          icon={<Users size={21} />}
          caption="Registered owners"
        />

        <StatCard
          title="Total Animals"
          value={loading ? "—" : animals.length}
          icon={<PawPrint size={21} />}
          caption="Animals in records"
        />

        <StatCard
          title="Medicine Stock"
          value={loading ? "—" : medicines.length}
          icon={<Package size={21} />}
          caption="Medicine types"
        />

        <StatCard
          title="Prescriptions"
          value={loading ? "—" : prescriptions.length}
          icon={<ClipboardList size={21} />}
          caption="Total records"
        />
      </section>

      <section className="dashboard-grid">
        <div className="surface-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">INVENTORY</span>
              <h3>Medicine Overview</h3>
            </div>

            <button
              className="text-button"
              onClick={() => navigate("medicines")}
            >
              View all <ArrowUpRight size={16} />
            </button>
          </div>

          {medicines.length === 0 ? (
            <EmptyState text="No medicine records available." />
          ) : (
            <div className="mini-table">
              <div className="mini-row mini-head">
                <span>Medicine</span>
                <span>Category</span>
                <span>Stock</span>
                <span>Status</span>
              </div>

              {medicines.slice(0, 5).map((medicine) => (
                <div className="mini-row" key={medicine.medicineId}>
                  <strong>{medicine.medicineName}</strong>
                  <span>{medicine.category || "General"}</span>
                  <span>{medicine.stock}</span>
                  <StockBadge stock={medicine.stock} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card">
          <div className="section-heading">
            <div>
              <span className="section-kicker">ATTENTION</span>
              <h3>Stock Alerts</h3>
            </div>

            <AlertTriangle size={19} className="alert-icon" />
          </div>

          {lowStock.length === 0 ? (
            <div className="success-state">
              <CheckCircle2 size={27} />
              <div>
                <strong>Inventory looks healthy</strong>
                <span>No medicines are currently low in stock.</span>
              </div>
            </div>
          ) : (
            <div className="alert-list">
              {lowStock.slice(0, 5).map((medicine) => (
                <div className="alert-item" key={medicine.medicineId}>
                  <div>
                    <strong>{medicine.medicineName}</strong>
                    <span>{medicine.stock} units remaining</span>
                  </div>
                  <span className="stock-danger">Low</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="surface-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">ACTIVITY</span>
            <h3>Recent Prescriptions</h3>
          </div>

          <button
            className="text-button"
            onClick={() => navigate("history")}
          >
            Full history <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="recent-grid">
          {recent.length === 0 ? (
            <EmptyState text="No prescriptions available." />
          ) : (
            recent.map((prescription) => (
              <div
                className="recent-item"
                key={prescription.prescriptionId}
              >
                <div className="recent-icon">
                  <ClipboardList size={17} />
                </div>

                <div>
                  <strong>
                    Prescription #{prescription.prescriptionId}
                  </strong>
                  <span>
                    Animal #{prescription.animalId} · Medicine #
                    {prescription.medicineId}
                  </span>
                </div>

                <time>{prescription.prescriptionDate}</time>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------- OWNERS / ANIMALS ---------------- */

function DataPage({
  title,
  subtitle,
  icon,
  columns,
  data,
  search,
  setSearch,
  loading,
}) {
  return (
    <section className="surface-card large-card">
      <div className="section-heading">
        <div className="heading-with-icon">
          <div className="heading-icon">{icon}</div>

          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>

        <span className="record-count">{data.length} records</span>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
          />
        </div>
      </div>

      <DataTable columns={columns} data={data} loading={loading} />
    </section>
  );
}

/* ---------------- MEDICINES ---------------- */

function MedicinePage({ medicines, search, setSearch, loading }) {
  const filtered = medicines.filter((medicine) =>
    `${medicine.medicineName} ${medicine.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <section className="surface-card large-card">
      <div className="section-heading">
        <div className="heading-with-icon">
          <div className="heading-icon">
            <Pill size={22} />
          </div>

          <div>
            <h2>Medicine Inventory</h2>
            <p>Monitor availability, pricing and stock levels.</p>
          </div>
        </div>

        <span className="record-count">{filtered.length} medicines</span>
      </div>

      <div className="table-toolbar">
        <div className="search-box">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search medicine..."
          />
        </div>
      </div>

      <div className="inventory-table">
        <div className="inventory-row inventory-head">
          <span>Medicine</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Status</span>
        </div>

        {loading ? (
          <LoadingRows />
        ) : filtered.length === 0 ? (
          <EmptyState text="No medicines found." />
        ) : (
          filtered.map((medicine) => (
            <div className="inventory-row" key={medicine.medicineId}>
              <div className="medicine-name">
                <div className="medicine-icon">
                  <Pill size={17} />
                </div>
                <strong>{medicine.medicineName}</strong>
              </div>

              <span>{medicine.category || "General"}</span>

              <strong>₹{Number(medicine.price).toFixed(2)}</strong>

              <strong>{medicine.stock}</strong>

              <StockBadge stock={medicine.stock} />
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ---------------- PRESCRIPTIONS ---------------- */

function PrescriptionsPage({
  animals,
  medicines,
  prescriptions,
  createPrescription,
  loading,
}) {
  return (
    <div className="stack">
      <section className="surface-card">
        <div className="section-heading">
          <div className="heading-with-icon">
            <div className="heading-icon">
              <Plus size={22} />
            </div>

            <div>
              <h2>Create Prescription</h2>
              <p>Create a new treatment record for an animal.</p>
            </div>
          </div>
        </div>

        <form className="prescription-form" onSubmit={createPrescription}>
          <label>
            Animal
            <select name="animalId" required>
              <option value="">Select animal</option>

              {animals.map((animal) => (
                <option key={animal.animalId} value={animal.animalId}>
                  {animal.animalName} · {animal.species}
                </option>
              ))}
            </select>
          </label>

          <label>
            Medicine
            <select name="medicineId" required>
              <option value="">Select medicine</option>

              {medicines.map((medicine) => (
                <option key={medicine.medicineId} value={medicine.medicineId}>
                  {medicine.medicineName} · {medicine.stock} available
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="1"
              placeholder="Enter quantity"
              required
            />
          </label>

          <label>
            Dosage
            <input
              name="dosage"
              placeholder="Example: 1 tablet twice daily"
              required
            />
          </label>

          <label>
            Prescription Date
            <input name="prescriptionDate" type="date" required />
          </label>

          <div className="form-action">
            <button className="primary-button" type="submit">
              <Plus size={17} />
              Create Prescription
            </button>
          </div>
        </form>
      </section>

      <section className="surface-card large-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">RECORDS</span>
            <h3>Prescription Records</h3>
            <p>Recently created treatment records.</p>
          </div>

          <span className="record-count">
            {prescriptions.length} records
          </span>
        </div>

        <DataTable
          columns={[
            "ID",
            "Animal",
            "Medicine",
            "Quantity",
            "Dosage",
            "Date",
          ]}
          data={prescriptions.map((item) => [
            `#${item.prescriptionId}`,
            `Animal #${item.animalId}`,
            `Medicine #${item.medicineId}`,
            item.quantity,
            item.dosage,
            item.prescriptionDate,
          ])}
          loading={loading}
        />
      </section>
    </div>
  );
}

/* ---------------- HISTORY ---------------- */

function HistoryPage({ details, loading }) {
  const rows = details.map((item) => [
    `#${item[0]}`,
    item[1],
    item[2],
    item[3],
    item[4],
    item[5],
    item[6],
  ]);

  return (
    <section className="surface-card large-card">
      <div className="section-heading">
        <div className="heading-with-icon">
          <div className="heading-icon">
            <History size={22} />
          </div>

          <div>
            <h2>Prescription History</h2>
            <p>
              A complete view of treatments, animals, owners and medicines.
            </p>
          </div>
        </div>

        <span className="record-count">{rows.length} records</span>
      </div>

      <DataTable
        columns={[
          "Prescription",
          "Animal",
          "Owner",
          "Medicine",
          "Quantity",
          "Dosage",
          "Date",
        ]}
        data={rows}
        loading={loading}
      />
    </section>
  );
}

/* ---------------- INSIGHTS ---------------- */

function InsightsPage({ data, medicines, loading }) {
  const total = data.length;

  const highest =
    medicines.length > 0
      ? [...medicines].sort((a, b) => b.stock - a.stock)[0]
      : null;

  return (
    <div className="stack">
      <section className="insight-summary">
        <InsightCard
          icon={<BarChart3 size={21} />}
          title="Medicines Above Average"
          value={total}
          text="Based on prescription activity"
        />

        <InsightCard
          icon={<Activity size={21} />}
          title="Inventory Coverage"
          value={medicines.length}
          text="Medicine types currently tracked"
        />

        <InsightCard
          icon={<Package size={21} />}
          title="Highest Stock"
          value={highest ? highest.stock : "—"}
          text={highest ? highest.medicineName : "No data"}
        />
      </section>

      <section className="surface-card large-card">
        <div className="section-heading">
          <div className="heading-with-icon">
            <div className="heading-icon">
              <BarChart3 size={22} />
            </div>

            <div>
              <h2>Medicine Insights</h2>
              <p>
                Medicines showing higher prescription activity than the
                overall average.
              </p>
            </div>
          </div>

          <span className="record-count">{total} medicines</span>
        </div>

        <DataTable
          columns={["Medicine ID", "Medicine", "Price", "Current Stock"]}
          data={data.map((item) => [
            item[0],
            item[1],
            `₹${Number(item[2]).toFixed(2)}`,
            item[3],
          ])}
          loading={loading}
        />
      </section>
    </div>
  );
}

/* ---------------- BILLING ---------------- */

function BillingPage({
  prescriptions,
  costId,
  setCostId,
  cost,
  costLoading,
  calculateCost,
}) {
  return (
    <div className="billing-layout">
      <section className="surface-card billing-card">
        <div className="heading-icon large">
          <Calculator size={24} />
        </div>

        <span className="section-kicker">COST CALCULATOR</span>

        <h2>Calculate Prescription Cost</h2>

        <p>
          Select a prescription to calculate the total medicine cost.
        </p>

        <label>
          Prescription
          <select
            value={costId}
            onChange={(e) => setCostId(e.target.value)}
          >
            <option value="">Select prescription</option>

            {prescriptions.map((prescription) => (
              <option
                key={prescription.prescriptionId}
                value={prescription.prescriptionId}
              >
                Prescription #{prescription.prescriptionId} · Animal #
                {prescription.animalId}
              </option>
            ))}
          </select>
        </label>

        <button
          className="primary-button full-width"
          onClick={calculateCost}
          disabled={costLoading}
        >
          <Calculator size={17} />
          {costLoading ? "Calculating..." : "Calculate Cost"}
        </button>
      </section>

      <section className="cost-result">
        <div className="cost-icon">
          <Receipt size={24} />
        </div>

        <span>Total Prescription Cost</span>

        <strong>
          {cost !== null ? `₹${Number(cost).toFixed(2)}` : "₹0.00"}
        </strong>

        {cost !== null && (
          <small>Calculated from the selected prescription.</small>
        )}
      </section>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, icon, caption }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">{icon}</div>
        <ArrowUpRight size={16} className="muted-icon" />
      </div>

      <strong>{value}</strong>
      <span>{title}</span>
      <small>{caption}</small>
    </div>
  );
}

function InsightCard({ icon, title, value, text }) {
  return (
    <div className="insight-card">
      <div className="stat-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{text}</small>
    </div>
  );
}

function DataTable({ columns, data, loading }) {
  if (loading) {
    return <LoadingRows />;
  }

  if (!data || data.length === 0) {
    return <EmptyState text="No records available." />;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell ?? "—"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock < 30) {
    return (
      <span className="stock-badge danger">
        <AlertTriangle size={13} />
        Low stock
      </span>
    );
  }

  return (
    <span className="stock-badge good">
      <CheckCircle2 size={13} />
      Available
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="empty-state">
      <Package size={30} />
      <span>{text}</span>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <span>Loading records...</span>
    </div>
  );
}

function getOwnerName(ownerId, owners) {
  const owner = owners.find((item) => item.ownerId === ownerId);
  return owner ? owner.ownerName : `Owner #${ownerId}`;
}

export default App;