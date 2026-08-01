import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../Components/NewLayout";
import {
  FaChartPie,
  FaClipboardList,
  FaExclamationCircle,
  FaBuilding,
  FaListAlt,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
  FaRedo,
} from "react-icons/fa";
import DashboardCard from "../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Dashboard",
    icon: FaChartPie,
    route: "CrmDashBoardOut",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Complaint Summary",
    icon: FaClipboardList,
    route: "ComplaintSummary2",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-400",
  },
  {
    id: 3,
    title: "Complaint Type",
    icon: FaExclamationCircle,
    route: "ComplaintType",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
  },
  {
    id: 4,
    title: "Department wise Complaint",
    icon: FaBuilding,
    route: "ComplaintDepartmentWise",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
  },
  {
    id: 5,
    title: "Type of Complaint",
    icon: FaListAlt,
    route: "TypeOfComplaint",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-400",
  },
  {
    id: 6,
    title: "Report Timely Reflection",
    icon: FaClock,
    route: "ReportTimelyReflection",
    iconBg: "bg-gradient-to-br from-red-500 to-orange-400",
  },
  {
    id: 7,
    title: "Complaint Report by Period",
    icon: FaCalendarAlt,
    route: "ComplaintReportByPeriod", // incomeplete
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-400",
  },
  {
    id: 8,
    title: "Complaint Report",
    icon: FaFileAlt,
    route: "ComplaintGrvRpt",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-400",
  },
  {
    id: 9,
    title: "Re open",
    icon: FaRedo,
    route: "ReOpen", // incomeplete
    iconBg: "bg-gradient-to-br from-amber-500 to-yellow-400",
  },
];

export default function CADDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const handleGoBack = () => {
    navigate("/home");
  };

  const filteredTiles = tilesData.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const openFeature = (route) => {
    const payload = { type: "navigate", route };

    if (window.ToFlutter && window.ToFlutter.postMessage) {
      window.ToFlutter.postMessage(JSON.stringify(payload));
    } else {
      if (route.startsWith("https")) {
        window.open(route, "_blank");
      } else {
        navigate(`/${route}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Complaint & Suggestion"
        subtitle="Welcome"
        onBack={handleGoBack}
      />
      <div className="mx-auto w-[100%] lg:w-[40%]">
        <section className="container mx-auto md:-mt-3 px-4">
          <div className="grid grid-cols-2 gap-3">
            {tilesData.map((item) => (
              <DashboardCard
                key={item.id}
                onClick={() => openFeature(item.route)}
                icon={item.icon}
                title={item.title}
                iconBg={item.iconBg}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
