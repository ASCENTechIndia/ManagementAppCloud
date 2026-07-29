import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../../../Components/NewLayout";
import { HiMiniDocumentMagnifyingGlass } from "react-icons/hi2";
import { CgFileDocument } from "react-icons/cg";
import { GrDocumentUser } from "react-icons/gr";
import DashboardCard from "../../../../Components/NewDashboardCard";

const tilesData = [
  {
    id: 1,
    title: "Death Registration By Date",
    // img: "/assets/death-certificate-date.png",
    icon: CgFileDocument,
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400",
    route: "DeathRegistrationByDate",
  },
  {
    id: 2,
    title: "Death Registration By Ward",
    // img: "/assets/stamp.png",
    icon: GrDocumentUser,
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400",
    route: "DeathRegistrationByWard",
  },
  {
    id: 3,
    title: "Search Information",
    // img: "/assets/seo.png",
    icon: HiMiniDocumentMagnifyingGlass,
    route: "DeathSearchInfo",
    iconBg: "bg-gradient-to-br from-red-500 to-orange-400"
  },
];

export default function Death() {
  const navigate = useNavigate();

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
        title="Death Department"
        subtitle="Birth & Death"
        onBack={() => navigate("/BirthAndDeath")}
      />

      {/* <section className="container mx-auto mt-6 px-4 max-w-4xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tilesData.map((tile) => (
            <button
              key={tile.id}
              onClick={() => openFeature(tile.route)}
              className="flex items-center gap-4 bg-white rounded-[24px] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-left hover:cursor-pointer border border-blue-50/50"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-50/80 p-2 shrink-0 border border-blue-100">
                {tile.img ? (
                  <img
                    src={tile.img}
                    alt={tile.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <i className={tile.icon}></i>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg leading-snug">
                  {tile.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </section> */}

       <div className="mx-auto w-[100%] lg:w-[40%]">
              <section class="container mx-auto md:-mt-3 px-4">
                <div class="grid grid-cols-2 gap-3">
                  {tilesData.map((item) => (
                    <DashboardCard
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
