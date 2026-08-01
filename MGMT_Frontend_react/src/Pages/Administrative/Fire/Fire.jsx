import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../Components/NewLayout";
import { FaRupeeSign , FaListAlt } from "react-icons/fa";
import DashboardCard from "../../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Zonewise Collection",
    icon: FaRupeeSign,
    route: "TypesOfComplaint",
    iconBg: "bg-gradient-to-br from-red-500 to-orange-400",
  },
  {
    id: 2,
    title: "List of Applications",
    icon: FaListAlt,
    route: "ComplaintType2",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
  },
];

export default function Fire() {
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
      navigate(`/${route}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Fire Department"
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
