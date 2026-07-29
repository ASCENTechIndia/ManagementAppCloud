import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../Components/NewLayout";
import {
  FaUniversity,
  FaMoneyBillAlt,
  FaBuilding,
  FaFire,
} from "react-icons/fa";
import DashboardCard from "../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Marriage Registration Department",
    icon: FaUniversity,
    route: "Marriage",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    title: "Inward Outward Department",
    icon: FaMoneyBillAlt,
    route: "IncomeOutgoing",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-400",
  },
  {
    id: 3,
    title: "Birth Death Department",
    icon: FaBuilding,
    route: "BirthAndDeath",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
  },
  {
    id: 4,
    title: "Fire Department",
    icon: FaFire,
    route: "Fire",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400",
  },
];

export default function Administrative() {
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
        title="Administrative"
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
