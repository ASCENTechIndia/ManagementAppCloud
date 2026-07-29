import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../../HOC/TopHeader/TopHeader";

const tilesData = [
  {
    id: 1,
    title: "Information and Feedback Summary",
    img: "/assets/informationfeedbacksummary.png",
    route: "feedbacksummary",
  },
  {
    id: 2,
    title: "Search Information",
    img: "/assets/searchinformation.png",
    route: "MahitiSodha",
  },
];

export default function CRMInfoDashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

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
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4">
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <TopHeader />
      </div>
      <main className="max-w-md mx-auto pt-[80px] sm:pt-[60px]">
        {/* Search Bar */}
          <div className="text-center mb-8">
  {/* <h1 className="text-3xl sm:text-4xl font-extrabold text-[rgb(100,35,200)] tracking-wide">
    CRM Dashboard
  </h1> */}
  {/* <div className="w-24 h-1 bg-[rgb(140,79,255)] mx-auto mt-2 rounded-full"></div> */}
</div>

        {/* Tiles Grid */}
        <div className="grid grid-cols-2 [@media(max-width:400px)]:grid-cols-1 gap-4">
          {filteredTiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => openFeature(tile.route)}
              className="relative flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-200 shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50 transition-all text-left hover:cursor-pointer"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-indigo-50 overflow-hidden flex-shrink-0">
                {tile.img ? (
                  <img
                    src={tile.img}
                    alt={tile.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className={tile.icon}></i>
                )}
              </div>
              <div>
                <div className="font-semibold text-sm sm:text-base leading-snug">
                  {tile.title}{" "}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm mt-1">
                  {tile.hint}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="h-20"></div>
      </main>
    </div>
  );
}
