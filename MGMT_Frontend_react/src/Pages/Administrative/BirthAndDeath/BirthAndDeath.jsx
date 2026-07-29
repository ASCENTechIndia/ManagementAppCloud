import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../Components/NewLayout";
import { FaChild, FaNotesMedical } from "react-icons/fa";
import DashboardCard from "../../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Birth",
    icon: FaChild,
    route: "Birth",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Death",
    icon: FaNotesMedical,
    route: "Death",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
  },
];

export default function BirthAndDeath() {
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
        title="Birth & Death Department"
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
