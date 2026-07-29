import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../../Components/NewLayout";
import DashboardCard from "../../../../Components/NewDashboardCard";
import { FaCalendarAlt, FaMapMarkedAlt, FaSearch } from "react-icons/fa";

const tilesData = [
  {
    id: 1,
    title: "Birth Registration By Date",
    icon: FaCalendarAlt,
    route: "BirthRegistrationByDate",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Birth Registration By Ward",
    icon: FaMapMarkedAlt,
    route: "BirthRegistrationByWard",
    iconBg: "bg-gradient-to-br from-green-500 to-teal-400",
  },
  {
    id: 3,
    title: "Search Information",
    icon: FaSearch,
    route: "BirthSearchInfo", // 126~126 value doubt
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
  },
];

export default function Birth() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const filteredTiles = tilesData.filter((tile) =>
    tile.title.toLowerCase().includes(query.toLowerCase()),
  );

  const openFeature = (route) => {
    const payload = { type: "navigate", route };

    if (window.ToFlutter && window.ToFlutter.postMessage) {
      window.ToFlutter.postMessage(JSON.stringify(payload));
    } else {
      navigate(`/${route}`);
    }
  };

  const handleGoBack = () => {
    navigate("/BirthAndDeath");
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Birth Department"
        subtitle="Birth & Death"
        onBack={handleGoBack}
      />

      <div className="mx-auto w-full lg:w-[40%]">
        <section className="container mx-auto md:-mt-3 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTiles.map((tile) => (
              <DashboardCard
                key={tile.id}
                onClick={() => openFeature(tile.route)}
                icon={tile.icon}
                title={tile.title}
                iconBg={tile.iconBg}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
