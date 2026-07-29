import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopHeader from "../../HOC/TopHeader/TopHeader";
import { Button } from "react-bootstrap";
import { PageHeader } from "../../Components/NewLayout";
import {
  FaBuilding,
  FaWallet,
  FaChartPie,
  FaChartBar,
  FaUniversity,
  FaHome,
  FaCheckCircle,
  FaMoneyBillAlt,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { TbMoneybag } from "react-icons/tb";
import { PiSealPercentFill } from "react-icons/pi";
import { BsGraphUp } from "react-icons/bs";
import DashboardCard from "../../Components/NewDashboardCard";

// const tilesData = [
//   {
//     id: 1,
//     title: "Daily & Weekly Tax Collection",
//     // hint: "",MGMT_Frontend_react\public\assets\dailytaxcollection.png
//     img: "/assets/dailytaxcollection.png",
//     route: "dailycollection",
//   },
//   {
//     id: 2,
//     title: "Wardwise Tax Demand",
//     // hint: "",
//     img: "/assets/wardwiswcollection.png",
//     route: "TaxCollectionDemand",
//   },
//   {
//     id: 3,
//     title: "Wardwise Tax Collection",
//     // hint: "New property demand",
//     img: "/assets/wardwisetaxcollection.png",
//     route: "TaxCollectionWardWise",
//   },
//   {
//     id: 4,
//     title: "Defaulter list",
//     // hint: "Recent transactions",
//     img: "/assets/thakbakidaryadi.png",
//     route: "DefaulterListProp",
//   },
//   {
//     id: 5,
//     title: "Division wise Percentage Report",
//     // hint: "",
//     img: "/assets/divisionwisepercentagereport.png",
//     route: "DivisionWisePrecentRpt",
//   },
//   {
//     id: 6,
//     title: "Wardwise Daily Collection",
//     // hint: "",
//     img: "/assets/wardwisedailytaxcollection.png",
//     route: "collection_graph",
//   },
//   {
//     id: 7,
//     title: "Legal / Illegal",
//     // hint: "",
//     img: "/assets/legal.png",
//     route: "LegalIllegal",
//   },
//   {
//     id: 8,
//     title: "Resident / Commercial",
//     // hint: "",
//     img: "/assets/residentcommercial.png",
//     route: "ResidentCommerical",
//   },
// ];

const tilesData = [
  {
    id: 1,
    title: "Daily & Weekly Tax Collection",
    // hint: "",MGMT_Frontend_react\public\assets\dailytaxcollection.png
    icon: FaWallet,
    route: "dailycollection",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    title: "Wardwise Tax Demand",
    // hint: "",
    icon: FaMoneyBillAlt,
    route: "TaxCollectionDemand",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-400"
  },
  {
    id: 3,
    title: "Wardwise Tax Collection",
    // hint: "New property demand",
    icon: GiMoneyStack,
    route: "TaxCollectionWardWise",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-400"
  },
  {
    id: 4,
    title: "Defaulter list",
    // hint: "Recent transactions",
    icon: TbMoneybag,
    route: "DefaulterListProp",
    iconBg: "bg-gradient-to-br from-orange-500 to-amber-400"
  },
  {
    id: 5,
    title: "Division wise Percentage Report",
    // hint: "",
    icon: PiSealPercentFill,
    route: "DivisionWisePrecentRpt",
    iconBg: "bg-gradient-to-br from-pink-500 to-rose-400"
  },
  {
    id: 6,
    title: "Wardwise Daily Collection",
    // hint: "",
    icon: BsGraphUp,
    route: "collection_graph",
    iconBg: "bg-gradient-to-br from-red-500 to-orange-400"
  },
  {
    id: 7,
    title: "Legal / Illegal",
    // hint: "",
    icon: FaUniversity,
    route: "LegalIllegal",
    iconBg: "bg-gradient-to-br from-indigo-500 to-blue-400"
  },
  {
    id: 8,
    title: "Resident / Commercial",
    // hint: "",
    icon: FaHome,
    route: "ResidentCommerical",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-400"
  },
];

export default function PropertyDashboard() {
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

    // ✅ If running inside Flutter
    if (window.ToFlutter && window.ToFlutter.postMessage) {
      window.ToFlutter.postMessage(JSON.stringify(payload));
    }
    // ✅ Otherwise, navigate using React Router
    else {
      navigate(`/${route}`);
    }
  };
  return (
    // <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4">
    //   <div className="fixed top-0 left-0 w-full z-[1000]">
    //     <TopHeader />
    //   </div>
    //   <main className="max-w-md mx-auto pt-[80px] sm:pt-[60px]">
    //     {/* Search Bar */}
    //     <div className="flex gap-4 text-center mb-8">
    //       <Button
    //         onClick={() => {
    //           navigate("/home");
    //         }}
    //       >
    //         <i className="bi bi-arrow-left"></i>
    //       </Button>
    //       <h1
    //         style={{
    //           textAlign: "center",
    //           fontWeight: 500,
    //           color: "rgb(100, 35, 200)",
    //         }}
    //       >
    //         Property Dashboard
    //       </h1>
    //     </div>

    //     {/* Tiles Grid */}
    //     <div className="grid grid-cols-2 [@media(max-width:400px)]:grid-cols-1 gap-4">
    //       {filteredTiles.map((tile) => (
    //         <button
    //           key={tile.id}
    //           onClick={() => openFeature(tile.route)}
    //           className="relative flex items-center gap-3 bg-white rounded-2xl p-3 border border-gray-200 shadow-md hover:-translate-y-1 hover:shadow-lg hover:bg-gray-50 transition-all text-left"
    //         >
    //           <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-indigo-50 overflow-hidden flex-shrink-0">
    //             {tile.img ? (
    //               <img
    //                 src={tile.img}
    //                 alt={tile.title}
    //                 className="w-full h-full object-cover"
    //               />
    //             ) : (
    //               <i className={tile.icon}></i>
    //             )}
    //           </div>
    //           <div>
    //             <div className="font-semibold text-sm sm:text-base leading-snug">
    //               {tile.title}{" "}
    //             </div>
    //             <div className="text-gray-500 text-xs sm:text-sm mt-1">
    //               {tile.hint}
    //             </div>
    //           </div>
    //         </button>
    //       ))}
    //     </div>

    //     <div className="h-20"></div>
    //   </main>
    // </div>
    <div className="min-h-screen bg-[#eef4ff] font-sans pb-6">
      <PageHeader
        title="Property Dashboard"
        subtitle="Welcome"
        onBack={handleGoBack}
      />
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
