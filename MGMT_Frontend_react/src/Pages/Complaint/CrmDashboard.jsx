import React, { useMemo, useState, useEffect, useCallback } from "react";
import Header from "../../HOC/Header/Header";
import Navbar from "../../HOC/Navbar/Navbar";
import Table from "../../Components/Table/Table";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import {
  RefreshCw,
  Download,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Table2,
} from "lucide-react";
import { Calendar, BarChart3, PieChart as PieIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
// import "./CrmDashBoard.css";
import { useLanguage } from "../../Context/LanguageProvider";
import apiService from "../../../apiService";
import { useAuth } from "../../Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CHANNEL_COLORS = ["#ef4444", "#16a34a", "#8b5cf6", "#f59e0b", "#2563eb"];
const STATUS_COLORS = ["#8b5cf6", "#2563eb", "#f59e0b", "#16a34a"];
const CATEGORY_COLORS = [
  "#2563eb",
  "#ef4444",
  "#16a34a",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
];
const k = (n) => (n > 999 ? (n / 1000).toFixed(1) + "k" : String(n));
const percent = (n) => `${Math.round(n * 100)}%`;

const CrmDashBoardOut = () => {
  const [username, setUsername] = useState(""); // State to store the username
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { translate } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ulbId = user?.data?.OrgId;
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [prio, setPrio] = useState("");
  const [stat, setStat] = useState("");
  const [channel, setChannel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [period, setPeriod] = useState("All");

  const [kpis, setKpis] = useState({
    total: 0,
    resolved: 0,
    avgResolutionTime: 0,
    avgCsat: 0,
    fcr: 0,
  });
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [csatChartData, setCsatChartData] = useState([]);
  const [agentTableData, setAgentTableData] = useState([]);
  const [priorityAgingData, setPriorityAgingData] = useState([]);
  const [channelMixData, setChannelMixData] = useState([]);

  const paginatedAgentData = agentTableData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(agentTableData.length / rowsPerPage);

  const getDatesForPeriod = (period) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (period) {
      case "3m":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "12m":
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      case "All":
        startDate.setFullYear(endDate.getFullYear() - 10);
        break;
      default:
        startDate.setFullYear(endDate.getFullYear() - 1);
    }

    const format = (d) => d.toISOString().split("T")[0];
    return { startDate: format(startDate), endDate: format(endDate) };
  };

  const fetchAllData = useCallback(async () => {
    try {
      const { startDate, endDate } = getDatesForPeriod(period);

      const payload = { ulbid: ulbId, startDate, endDate };

      const categoryRes = await apiService.post(
        "getComplaintDetailsByUlb",
        payload
      );
      if (categoryRes.data.success) {
        const deptCount = {};
        categoryRes.data.data.forEach((item) => {
          const dept = item.DEPTNM;
          deptCount[dept] = (deptCount[dept] || 0) + 1;
        });

        const categoryData = Object.entries(deptCount).map(
          ([name, tickets]) => ({
            name,
            tickets,
          })
        );
        setCategoryChartData(categoryData);
      }

      const csatRes = await apiService.post("GetMonthlyCSAT", payload);
      if (csatRes.data.success) {
        setCsatChartData(
          csatRes.data.data.map((item) => ({
            month: item.MONTH,
            csat: item.CSAT,
            reopened: item.WORK_ASSIGNED,
          }))
        );
      }

      const kpiRes = await apiService.post("GetResolutionSummary", payload);
      if (kpiRes.data.success) {
        const data = kpiRes.data.data;
        setKpis({
          total: Number(data.TOTAL_COMPLNT) || 0,
          resolved: Number(data.RESOLVED) || 0,
          avgResolutionTime: Number(data.AVG_RESOLUTION_TIME_HRS) || 0,
          avgCsat: Number(data.AVG_CSAT) || 0,
          fcr:
            Number(data.HANDLED) > 0
              ? (Number(data.CLOSE_) || 0) / Number(data.HANDLED)
              : 0,
        });
      }

      const monthlyRes = await apiService.post("GetMonthlyResolved", payload);
      if (monthlyRes.data.success) {
        setMonthlyChartData(
          monthlyRes.data.data.map((item) => ({
            month: item.MONTH,
            total: item.TOTAL_COMPLNT,
            resolved: item.RESOLVED,
          }))
        );
      }

      const statusRes = await apiService.post("GetComplaintStatuses", payload);
      if (statusRes.data.success) {
        setStatusChartData(
          Object.entries(statusRes.data.data).map(([key, value]) => ({
            name: key,
            value,
          }))
        );
      }

      const channelRes = await apiService.post("GetComplaintSources", payload);
      if (channelRes.data.success) {
        setChannelMixData(
          Object.entries(channelRes.data.data)
            .filter(([key]) => key !== "TOTAL")
            .map(([key, value]) => ({
              name: key,
              value,
            }))
        );
      }

      const agentRes = await apiService.post("GetAgentPerformance", payload);
      if (agentRes.data.success) {
        setAgentTableData(
          agentRes.data.data.map((item) => ({
            agent: item.USERNAME || "NA",
            handled: item.HANDLED || 0,
            avgResolution: item.AVG_RESOLUTION_TIME_HRS || 0,
            fcr:
              item.CLOSE_ && item.HANDLED > 0
                ? (item.CLOSE_ / item.HANDLED).toFixed(2)
                : 0,
            csat: item.CSAT || 0,
            sla: item.SLA ? item.SLA : null,
          }))
        );
      }

      const agingRes = await apiService.post("GetComplaintAging", payload);
      if (agingRes.data.success) {
        setPriorityAgingData(
          agingRes.data.data
            .filter((item) => item.AGING_BUCKET)
            .map((item) => ({
              AGING_BUCKET: item.AGING_BUCKET,
              TOTAL_COMPLAINTS: item.TOTAL_COMPLAINTS,
            }))
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }, [period, ulbId]);

  // Effect now depends on memoized fetchAllData
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const filteredMonthly = useMemo(() => {
    if (!monthlyChartData || monthlyChartData.length === 0) return [];
    const totalMonths = monthlyChartData.length;
    let startIndex = 0;
    if (period === "6m" && totalMonths > 6) startIndex = totalMonths - 6;
    else if (period === "3m" && totalMonths > 3) startIndex = totalMonths - 3;
    return monthlyChartData.slice(startIndex);
  }, [period, monthlyChartData]);

  const statusDistribution = statusChartData;
  const categoryBreakdown = categoryChartData;

  const exportCSV = () => {
    const rows = [
      ["month", "total", "resolved", "csat", "reopened"], // Removed 'slaBreaches' as it's not present in data/logic
      ...filteredMonthly.map((m) => [
        m.month,
        m.total,
        m.resolved,
        m.csat || "NA", // Added fallback for csat
        m.reopened || "NA", // Added fallback for reopened
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaint_metrics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  // Use useEffect to get the token from localStorage and decode it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get user details
        const decodedToken = jwtDecode(token);
        // Assuming the username is stored in 'USERNAME' in the token payload
        setUsername(decodedToken.in_UserId);
        console.log(decodedToken.in_UserId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleGoBack = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-3">
      <Header title="Dashboard" subtitle="CRM" onBack={handleGoBack} />

      <div className="container-fluid p-4">
        {/* Header (Responsive) */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-3 rounded">
          <div className="mb-3 mb-md-0">
            <h1 className="h3 fw-bold mb-1">Complaint Analysis Dashboard</h1>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            {/* Use flex-wrap to stack buttons if screen is too narrow */}
            <Button
              variant="light"
              className="border text-muted d-flex align-items-center shadow-lg rounded"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} className="me-1" /> Refresh
            </Button>
            {/* <Button
              variant="dark"
              className="border text-white d-flex align-items-center shadow-lg rounded"
              onClick={exportCSV}
            >
              <Download size={16} className="me-1" /> Export CSV
            </Button> */}
          </div>
        </div>

        {/* Filters (Responsive) */}
        <Form className="mb-4 p-3 shadow-lg rounded bg-white">
          <Row className="g-2 mb-2">
            {/* Ensure period buttons stack on smaller screens but align on larger ones */}
            <Col xs={12} className="d-flex flex-wrap align-items-center">
              <span
                className="d-flex align-items-center gap-1 px-2 py-1 fw-semibold small mb-2 me-2" // Added mb-2 and me-2 for wrapping
                style={{
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                }}
              >
                <Calendar size={16} className="text-muted" /> Period
              </span>
              {["3m", "6m", "12m", "All"].map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "primary" : "outline-secondary"}
                  onClick={() => setPeriod(p)}
                  size="sm"
                  className="ms-md-2 ms-0 mb-2 me-2 shadow-lg rounded px-3" // Added ms-md-2 for desktop spacing, me-2/mb-2 for mobile
                >
                  {p.toUpperCase()}
                </Button>
              ))}
            </Col>
          </Row>
        </Form>

        {/* KPI Cards (Responsive: Stack on small screens, 3 per row on medium/large) */}
        <Row className="mb-4 text-center g-3">
          <Col xs={12} sm={6} md={4}>
            <Card className="shadow-lg custom-card border-black">
              <Card.Body className="py-2">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 flex-shrink-0"
                    style={{ width: 35, height: 35 }}
                  >
                    <Users size={20} />
                  </div>
                  <div className="text-start">
                    <div className="text-muted small">Total Complaints</div>

                    <h4 className="fw-bold mb-0">{k(kpis.total)}</h4>
                    <small className="text-muted">Current Period</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="shadow-lg custom-card border-black">
              <Card.Body className="py-2">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center me-3 flex-shrink-0"
                    style={{ width: 35, height: 35 }}
                  >
                    <CheckCircle size={20} />
                  </div>
                  <div className="text-start">
                    <div className="text-muted small">Resolved</div>
                    <h4 className="fw-bold mb-0">{k(kpis.resolved)}</h4>
                    <small className="text-muted">
                      First Contact Resolutions: {percent(kpis.fcr)}
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={6} md={4}>
            <Card className="shadow-lg custom-card border-black">
              <Card.Body className="py-2">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-warning text-white rounded-circle d-flex justify-content-center align-items-center me-3 flex-shrink-0"
                    style={{ width: 35, height: 35 }}
                  >
                    <Clock size={20} />
                  </div>
                  <div className="text-start">
                    <div className="text-muted small">Avg Resolution Time</div>
                    <h4 className="fw-bold mb-0">
                      {kpis.avgResolutionTime
                        ? kpis.avgResolutionTime.toFixed(2)
                        : 0}{" "}
                      hrs
                    </h4>
                    <small className="text-muted">
                      Customer Satisfaction:{" "}
                      {kpis.avgCsat ? kpis.avgCsat.toFixed(2) : "NA"}/5
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts - Row 1 (Responsive: Stack on small screens, 3 per row on medium/large) */}
        <Row className="mb-4 g-3">
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <BarChart3 size={14} /> Complaint Volume Trend
                </Card.Title>
                <ResponsiveContainer width="100%" height={250} padding-top={20}>
                  <AreaChart data={filteredMonthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stackId="1"
                      stroke="#2563eb"
                      fill="#3b82f6"
                      name="Total"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      stackId="1"
                      stroke="#16a34a"
                      fill="#22c55e"
                      name="Resolved"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <PieIcon size={14} /> Status Distribution
                </Card.Title>

                {/* Pie Chart */}
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                      >
                        {statusDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Compact horizontal labels */}
                <div
                  className="d-flex flex-wrap gap-2 justify-content-center mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  {statusDistribution.map((entry, index) => {
                    const total = statusDistribution.reduce(
                      (sum, item) => sum + item.value,
                      0
                    );
                    const pct =
                      total === 0
                        ? 0
                        : ((entry.value / total) * 100).toFixed(0);
                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-1"
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor:
                              STATUS_COLORS[index % STATUS_COLORS.length],
                            display: "inline-block",
                            borderRadius: "50%",
                          }}
                        ></span>
                        <span>
                          {entry.name}: {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <BarChart3 size={14} /> Category Breakdown
                </Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="tickets" name="Tickets">
                      {categoryBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts - Row 2 (Responsive: Stack on small screens, 3 per row on medium/large) */}
        <Row className="mb-4 g-3">
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <BarChart3 size={14} /> Aging
                </Card.Title>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={priorityAgingData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* Rotated XAxis ticks for better mobile readability */}
                    <XAxis
                      dataKey="AGING_BUCKET"
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="TOTAL_COMPLAINTS"
                      fill="#2563eb"
                      name="Total Complaints"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <PieIcon size={14} /> Channel Mix
                </Card.Title>

                {/* Pie Chart */}
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelMixData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        innerRadius={50}
                        paddingAngle={5}
                      >
                        {channelMixData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value}`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Compact horizontal labels */}
                <div
                  className="d-flex flex-wrap gap-2 justify-content-center mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  {channelMixData.map((entry, index) => {
                    const total = channelMixData.reduce(
                      (sum, item) => sum + item.value,
                      0
                    );
                    const pct =
                      total === 0
                        ? 0
                        : ((entry.value / total) * 100).toFixed(0);
                    return (
                      <div
                        key={index}
                        className="d-flex align-items-center gap-1"
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            backgroundColor:
                              CHANNEL_COLORS[index % CHANNEL_COLORS.length],
                            display: "inline-block",
                            borderRadius: "50%",
                          }}
                        ></span>
                        <span>
                          {entry.name}: {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold mb-2 d-flex gap-2 align-items-center">
                  <BarChart3 size={14} /> Customer Satisfaction & Reopen Rate
                </Card.Title>

                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={csatChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        yAxisId="left"
                        domain={[0, 5]}
                        label={{
                          value: "CSAT (1-5)",
                          angle: -90,
                          position: "insideLeft",
                          style: { fontSize: "10px" },
                        }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                        label={{
                          value: "Reopened Tickets",
                          angle: 90,
                          position: "insideRight",
                          style: { fontSize: "10px" },
                        }}
                      />
                      <Tooltip />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="csat"
                        stroke="#8b5cf6"
                        activeDot={{ r: 8 }}
                        name="Customer Satisfaction"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="reopened"
                        stroke="#2563eb"
                        name="Reopened"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Compact horizontal legend below the chart */}
                <div
                  className="d-flex justify-content-center gap-3 mt-2"
                  style={{ fontSize: "0.85rem" }}
                >
                  <div className="d-flex align-items-center gap-1">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: "#8b5cf6",
                        display: "inline-block",
                        borderRadius: "50%",
                      }}
                    ></span>
                    <span>Customer Satisfaction</span>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: "#2563eb",
                        display: "inline-block",
                        borderRadius: "50%",
                      }}
                    ></span>
                    <span>Reopened</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Agent Performance (Responsive) */}
        <Row className="g-3">
          {/* Changed md={12} to xs={12} */}
          <Col xs={12}>
            <Card className="h-100 shadow-lg border-black">
              <Card.Body>
                <Card.Title className="h6 fw-bold d-flex gap-2 align-items-center">
                  <Table2 size={14} /> Employee Performance
                </Card.Title>
                {/* Table wrapper for horizontal scrolling on small screens */}
                <div className="table-responsive">
                  <Table
                    headers={[
                      "Employee",
                      "Handled",
                      "Avg Resolution (hrs)",
                      "First Contact Resolutions",
                      "Customer Satisfaction",
                    ]}
                    data={paginatedAgentData}
                    keyMapping={{
                      Employee: "agent",
                      Handled: "handled",
                      "Avg Resolution (hrs)": "avgResolution",
                      "First Contact Resolutions": "fcr",
                      "Customer Satisfaction": "csat",
                    }}
                    noDataMessage="No agent performance data"
                    showCheckboxInHeader={false}
                  />
                </div>

                {/* Pagination controls (Responsive) */}
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-2">
                  <div className="mb-2 mb-sm-0">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="d-flex gap-1">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={currentPage === totalPages || totalPages === 0}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );

  // return (
  //     <div className="min-h-screen bg-gray-50 font-sans pb-3">
  //         <Header title="Dashboard" subtitle="CRM" onBack={handleGoBack} />

  //         <div className="container-fluid p-3 p-md-4">
  //             {/* Header (Responsive) */}
  //             <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 p-3 p-md-4 rounded-3 bg-white border shadow-sm">
  //                 <div className="mb-3 mb-md-0">
  //                     <h1 className="h4 h3-md fw-bold mb-1 text-dark">Complaint Analysis Dashboard</h1>
  //                     <p className="text-muted mb-0 small">Comprehensive overview of customer complaints and resolution metrics</p>
  //                 </div>
  //                 <div className="d-flex gap-2 flex-wrap">
  //                     <Button
  //                         variant="outline-secondary"
  //                         className="d-flex align-items-center shadow-sm rounded-pill px-3 py-2"
  //                         onClick={() => window.location.reload()}
  //                     >
  //                         <RefreshCw size={16} className="me-2" />
  //                         <span className="d-none d-sm-inline">Refresh</span>
  //                     </Button>
  //                     <Button
  //                         variant="primary"
  //                         className="d-flex align-items-center shadow-sm rounded-pill px-3 py-2"
  //                         onClick={exportCSV}
  //                     >
  //                         <Download size={16} className="me-2" />
  //                         <span className="d-none d-sm-inline">Export CSV</span>
  //                     </Button>
  //                 </div>
  //             </div>

  //             {/* Filters (Responsive) */}
  //             <Card className="mb-4 border shadow-sm">
  //                 <Card.Body className="p-3">
  //                     <Form>
  //                         <Row className="g-2 align-items-center">
  //                             <Col xs={12} sm="auto" className="mb-2 mb-sm-0">
  //                                 <span
  //                                     className="d-flex align-items-center gap-1 px-3 py-2 fw-semibold small"
  //                                     style={{
  //                                         backgroundColor: "#f8f9fa",
  //                                         border: "1px solid #dee2e6",
  //                                         borderRadius: "8px",
  //                                         color: "#495057"
  //                                     }}
  //                                 >
  //                                     <Calendar size={16} className="text-primary" /> Period
  //                                 </span>
  //                             </Col>
  //                             <Col xs={12} sm="auto" className="d-flex flex-wrap gap-2">
  //                                 {["3m", "6m", "12m", "All"].map((p) => (
  //                                     <Button
  //                                         key={p}
  //                                         variant={period === p ? "primary" : "outline-primary"}
  //                                         onClick={() => setPeriod(p)}
  //                                         size="sm"
  //                                         className="rounded-pill px-3"
  //                                     >
  //                                         {p.toUpperCase()}
  //                                     </Button>
  //                                 ))}
  //                             </Col>
  //                         </Row>
  //                     </Form>
  //                 </Card.Body>
  //             </Card>

  //             {/* KPI Cards - Stack on mobile, 3 per row on desktop */}
  //             <Row className="mb-4 g-3">
  //                 <Col xs={12} sm={6} lg={4}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Body className="p-3">
  //                             <div className="d-flex align-items-center">
  //                                 <div
  //                                     className="bg-primary text-white rounded-3 d-flex justify-content-center align-items-center me-3 flex-shrink-0"
  //                                     style={{ width: 50, height: 50 }}
  //                                 >
  //                                     <Users size={24} />
  //                                 </div>
  //                                 <div className="text-start flex-grow-1">
  //                                     <div className="text-muted small fw-semibold">Total Complaints</div>
  //                                     <h4 className="fw-bold mb-1 text-dark">{k(kpis.total)}</h4>
  //                                     <div className="progress mt-2" style={{height: "4px"}}>
  //                                         <div
  //                                             className="progress-bar bg-primary"
  //                                             style={{width: "100%"}}
  //                                         ></div>
  //                                     </div>
  //                                     <small className="text-muted">Current Period</small>
  //                                 </div>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //                 <Col xs={12} sm={6} lg={4}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Body className="p-3">
  //                             <div className="d-flex align-items-center">
  //                                 <div
  //                                     className="bg-success text-white rounded-3 d-flex justify-content-center align-items-center me-3 flex-shrink-0"
  //                                     style={{ width: 50, height: 50 }}
  //                                 >
  //                                     <CheckCircle size={24} />
  //                                 </div>
  //                                 <div className="text-start flex-grow-1">
  //                                     <div className="text-muted small fw-semibold">Resolved</div>
  //                                     <h4 className="fw-bold mb-1 text-dark">{k(kpis.resolved)}</h4>
  //                                     <div className="progress mt-2" style={{height: "4px"}}>
  //                                         <div
  //                                             className="progress-bar bg-success"
  //                                             style={{width: `${(kpis.resolved / kpis.total) * 100}%`}}
  //                                         ></div>
  //                                     </div>
  //                                     <small className="text-muted">
  //                                         FCR: <span className="fw-bold text-success">{percent(kpis.fcr)}</span>
  //                                     </small>
  //                                 </div>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //                 <Col xs={12} sm={6} lg={4}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Body className="p-3">
  //                             <div className="d-flex align-items-center">
  //                                 <div
  //                                     className="bg-warning text-white rounded-3 d-flex justify-content-center align-items-center me-3 flex-shrink-0"
  //                                     style={{ width: 50, height: 50 }}
  //                                 >
  //                                     <Clock size={24} />
  //                                 </div>
  //                                 <div className="text-start flex-grow-1">
  //                                     <div className="text-muted small fw-semibold">Avg Resolution Time</div>
  //                                     <h4 className="fw-bold mb-1 text-dark">
  //                                         {kpis.avgResolutionTime ? kpis.avgResolutionTime.toFixed(1) : "NA"} hrs
  //                                     </h4>
  //                                     <div className="progress mt-2" style={{height: "4px"}}>
  //                                         <div
  //                                             className="progress-bar bg-warning"
  //                                             style={{width: kpis.avgResolutionTime ? `${Math.min(kpis.avgResolutionTime / 24 * 100, 100)}%` : "0%"}}
  //                                         ></div>
  //                                     </div>
  //                                     <small className="text-muted">
  //                                         CSAT: <span className="fw-bold text-warning">
  //                                             {kpis.avgCsat ? kpis.avgCsat.toFixed(1) : "NA"}/5
  //                                         </span>
  //                                     </small>
  //                                 </div>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //             </Row>

  //             {/* Charts - Row 1 - Stack on mobile, adjust columns for tablet/desktop */}
  //             <Row className="mb-4 g-3">
  //                 <Col xs={12} lg={4} className="mb-3 mb-lg-0">
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <BarChart3 size={18} className="text-primary me-2" />
  //                                 <span>Complaint Volume Trend</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 250, minHeight: 200 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <AreaChart data={filteredMonthly}>
  //                                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
  //                                         <XAxis dataKey="month" fontSize={12} />
  //                                         <YAxis fontSize={12} />
  //                                         <Tooltip />
  //                                         <Area
  //                                             type="monotone"
  //                                             dataKey="total"
  //                                             stackId="1"
  //                                             stroke="#2563eb"
  //                                             fill="#3b82f6"
  //                                             fillOpacity={0.2}
  //                                             name="Total"
  //                                         />
  //                                         <Area
  //                                             type="monotone"
  //                                             dataKey="resolved"
  //                                             stackId="1"
  //                                             stroke="#16a34a"
  //                                             fill="#22c55e"
  //                                             fillOpacity={0.2}
  //                                             name="Resolved"
  //                                         />
  //                                     </AreaChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>

  //                 <Col xs={12} lg={4} className="mb-3 mb-lg-0">
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <PieChart size={18} className="text-primary me-2" />
  //                                 <span>Status Distribution</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 200, minHeight: 150 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <PieChart>
  //                                         <Pie
  //                                             data={statusDistribution}
  //                                             dataKey="value"
  //                                             nameKey="name"
  //                                             innerRadius={40}
  //                                             outerRadius={70}
  //                                             paddingAngle={2}
  //                                         >
  //                                             {statusDistribution.map((entry, index) => (
  //                                                 <Cell
  //                                                     key={`cell-${index}`}
  //                                                     fill={STATUS_COLORS[index % STATUS_COLORS.length]}
  //                                                 />
  //                                             ))}
  //                                         </Pie>
  //                                         <Tooltip />
  //                                     </PieChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                             <div className="d-flex flex-wrap gap-1 justify-content-center mt-2" style={{ fontSize: "0.75rem" }}>
  //                                 {statusDistribution.map((entry, index) => {
  //                                     const total = statusDistribution.reduce((sum, item) => sum + item.value, 0);
  //                                     const pct = total === 0 ? 0 : ((entry.value / total) * 100).toFixed(0);
  //                                     return (
  //                                         <div key={index} className="d-flex align-items-center gap-1 px-2 py-1">
  //                                             <span
  //                                                 style={{
  //                                                     width: "8px",
  //                                                     height: "8px",
  //                                                     backgroundColor: STATUS_COLORS[index % STATUS_COLORS.length],
  //                                                     borderRadius: "50%",
  //                                                 }}
  //                                             ></span>
  //                                             <span className="fw-medium">
  //                                                 {entry.name}: {pct}%
  //                                             </span>
  //                                         </div>
  //                                     );
  //                                 })}
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>

  //                 <Col xs={12} lg={4}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <BarChart3 size={18} className="text-primary me-2" />
  //                                 <span>Category Breakdown</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 250, minHeight: 200 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <BarChart data={categoryBreakdown}>
  //                                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
  //                                         <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} fontSize={12} />
  //                                         <YAxis fontSize={12} />
  //                                         <Tooltip />
  //                                         <Bar dataKey="tickets" name="Tickets" radius={[2, 2, 0, 0]}>
  //                                             {categoryBreakdown.map((entry, index) => (
  //                                                 <Cell
  //                                                     key={`cell-${index}`}
  //                                                     fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
  //                                                 />
  //                                             ))}
  //                                         </Bar>
  //                                     </BarChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //             </Row>

  //             {/* Charts - Row 2 */}
  //             <Row className="mb-4 g-3">
  //                 <Col xs={12} lg={4} className="mb-3 mb-lg-0">
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <TrendingUp size={18} className="text-primary me-2" />
  //                                 <span>Aging Analysis</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 250, minHeight: 200 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <BarChart data={priorityAgingData}>
  //                                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
  //                                         <XAxis
  //                                             dataKey="AGING_BUCKET"
  //                                             angle={-45}
  //                                             textAnchor="end"
  //                                             height={60}
  //                                             fontSize={12}
  //                                         />
  //                                         <YAxis fontSize={12} />
  //                                         <Tooltip />
  //                                         <Bar
  //                                             dataKey="TOTAL_COMPLAINTS"
  //                                             fill="#2563eb"
  //                                             name="Total Complaints"
  //                                             radius={[2, 2, 0, 0]}
  //                                         />
  //                                     </BarChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>

  //                 <Col xs={12} lg={4} className="mb-3 mb-lg-0">
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <PieChart size={18} className="text-primary me-2" />
  //                                 <span>Channel Mix</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 200, minHeight: 150 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <PieChart>
  //                                         <Pie
  //                                             data={channelMixData}
  //                                             dataKey="value"
  //                                             nameKey="name"
  //                                             outerRadius={70}
  //                                             innerRadius={40}
  //                                             paddingAngle={2}
  //                                         >
  //                                             {channelMixData.map((entry, index) => (
  //                                                 <Cell
  //                                                     key={`cell-${index}`}
  //                                                     fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]}
  //                                                 />
  //                                             ))}
  //                                         </Pie>
  //                                         <Tooltip />
  //                                     </PieChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                             <div className="d-flex flex-wrap gap-1 justify-content-center mt-2" style={{ fontSize: "0.75rem" }}>
  //                                 {channelMixData.map((entry, index) => {
  //                                     const total = channelMixData.reduce((sum, item) => sum + item.value, 0);
  //                                     const pct = total === 0 ? 0 : ((entry.value / total) * 100).toFixed(0);
  //                                     return (
  //                                         <div key={index} className="d-flex align-items-center gap-1 px-2 py-1">
  //                                             <span
  //                                                 style={{
  //                                                     width: "8px",
  //                                                     height: "8px",
  //                                                     backgroundColor: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
  //                                                     borderRadius: "50%",
  //                                                 }}
  //                                             ></span>
  //                                             <span className="fw-medium">
  //                                                 {entry.name}: {pct}%
  //                                             </span>
  //                                         </div>
  //                                     );
  //                                 })}
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>

  //                 <Col xs={12} lg={4}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark d-flex align-items-center">
  //                                 <Activity size={18} className="text-primary me-2" />
  //                                 <span>Satisfaction & Reopen Rate</span>
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-3">
  //                             <div style={{ width: "100%", height: 250, minHeight: 200 }}>
  //                                 <ResponsiveContainer width="100%" height="100%">
  //                                     <LineChart data={csatChartData}>
  //                                         <CartesianGrid strokeDasharray="3 3" stroke="#f8f9fa" />
  //                                         <XAxis dataKey="month" fontSize={12} />
  //                                         <YAxis
  //                                             yAxisId="left"
  //                                             domain={[0, 5]}
  //                                             fontSize={12}
  //                                         />
  //                                         <YAxis
  //                                             yAxisId="right"
  //                                             orientation="right"
  //                                             domain={[0, 100]}
  //                                             fontSize={12}
  //                                         />
  //                                         <Tooltip />
  //                                         <Line
  //                                             yAxisId="left"
  //                                             type="monotone"
  //                                             dataKey="csat"
  //                                             stroke="#8b5cf6"
  //                                             strokeWidth={2}
  //                                             name="Customer Satisfaction"
  //                                         />
  //                                         <Line
  //                                             yAxisId="right"
  //                                             type="monotone"
  //                                             dataKey="reopened"
  //                                             stroke="#2563eb"
  //                                             strokeWidth={2}
  //                                             name="Reopened"
  //                                         />
  //                                     </LineChart>
  //                                 </ResponsiveContainer>
  //                             </div>
  //                             <div className="d-flex justify-content-center gap-3 mt-2" style={{ fontSize: "0.75rem" }}>
  //                                 <div className="d-flex align-items-center gap-1">
  //                                     <span
  //                                         style={{
  //                                             width: "10px",
  //                                             height: "2px",
  //                                             backgroundColor: "#8b5cf6",
  //                                             display: "inline-block",
  //                                         }}
  //                                     ></span>
  //                                     <span>Customer Satisfaction</span>
  //                                 </div>
  //                                 <div className="d-flex align-items-center gap-1">
  //                                     <span
  //                                         style={{
  //                                             width: "10px",
  //                                             height: "2px",
  //                                             backgroundColor: "#2563eb",
  //                                             display: "inline-block",
  //                                         }}
  //                                     ></span>
  //                                     <span>Reopened</span>
  //                                 </div>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //             </Row>

  //             {/* Agent Performance Table */}
  //             <Row className="g-3">
  //                 <Col xs={12}>
  //                     <Card className="h-100 border shadow-sm">
  //                         <Card.Header className="bg-white border-bottom py-3">
  //                             <Card.Title className="h6 fw-bold mb-0 text-dark">
  //                                 Employee Performance
  //                             </Card.Title>
  //                         </Card.Header>
  //                         <Card.Body className="p-0">
  //                             <div className="table-responsive">
  //                                 <Table
  //                                     headers={[
  //                                         "Employee",
  //                                         "Handled",
  //                                         "Avg Resolution (hrs)",
  //                                         "First Contact Resolutions",
  //                                         "Customer Satisfaction",
  //                                     ]}
  //                                     data={paginatedAgentData}
  //                                     keyMapping={{
  //                                         Employee: "agent",
  //                                         Handled: "handled",
  //                                         "Avg Resolution (hrs)": "avgResolution",
  //                                         "First Contact Resolutions": "fcr",
  //                                         "Customer Satisfaction": "csat",
  //                                     }}
  //                                     noDataMessage="No agent performance data"
  //                                     showCheckboxInHeader={false}
  //                                 />
  //                             </div>

  //                             {/* Pagination controls (Responsive) */}
  //                             <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center p-3 border-top">
  //                                 <div className="mb-2 mb-sm-0 small text-muted">
  //                                     Page {currentPage} of {totalPages}
  //                                 </div>
  //                                 <div className="d-flex gap-2">
  //                                     <Button
  //                                         variant="outline-primary"
  //                                         size="sm"
  //                                         disabled={currentPage === 1}
  //                                         onClick={() => setCurrentPage((prev) => prev - 1)}
  //                                     >
  //                                         Previous
  //                                     </Button>
  //                                     <Button
  //                                         variant="outline-primary"
  //                                         size="sm"
  //                                         disabled={currentPage === totalPages || totalPages === 0}
  //                                         onClick={() => setCurrentPage((prev) => prev + 1)}
  //                                     >
  //                                         Next
  //                                     </Button>
  //                                 </div>
  //                             </div>
  //                         </Card.Body>
  //                     </Card>
  //                 </Col>
  //             </Row>
  //         </div>
  //     </div>
  // );
};

export default CrmDashBoardOut;
