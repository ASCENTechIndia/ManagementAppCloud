import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../Components/NewLayout";
import { FaFileAlt, FaPaperPlane } from "react-icons/fa";
import DashboardCard from "../../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Miscellaneous Information",
    icon: FaFileAlt,
    route: "MiscellaneousInformation",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Outward Information",
    icon: FaPaperPlane,
    route: "OutwardInformation", // doubt three in group
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-400",
  },
];

export default function IncomeOutgoing() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const handleGoBack = () => {
    navigate("/Administrative");
  };

  const filteredTiles = tilesData.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const openFeature = (route) => {
    const payload = { type: "navigate", route };

    if (window.ToFlutter && window.ToFlutter.postMessage) {
      window.ToFlutter.postMessage(JSON.stringify(payload));
    } else {
      navigate(`/${route}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Inward / Outward Department"
        subtitle="Welcome"
        onBack={handleGoBack}
      />
      <div className="mx-auto w-full lg:w-[40%]">
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
