import React, { useEffect, useState, useCallback } from "react";
import "./Navbar.css";
import NavDropdown from "../../Components/NavDropdown/NavDropdown";
import TimeComponent from "../../Components/Time/Time";
import NavbarLogo from "../../Components/NavbarLogo/NavbarLogo";
import NavbarText from "../../Components/NavbarText/NavbarText";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import apiService from "../../../apiService";

const Navbar = () => {
  const { user } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [menuItems, setMenuItems] = useState([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [navbarText] = useState({
    text1: "Solid Waste Management",
    text2: "Department",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const deptId = user?.deptId;
  const lastLogin = user?.lastLogin || "N/A";
  const lastLogout = user?.lastLogout || "N/A";

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    let dateObj;
    if (dateString.includes("T")) {
      dateObj = new Date(dateString);
    } else {
      const parts = dateString.split(" ");
      if (parts.length === 3) {
        const [day, month, year] = parts[0].split("-").map(Number);
        const time = parts[1] + " " + parts[2];
        if (day && month && year) {
          const formattedDateString = `${year}-${month
            .toString()
            .padStart(2, "0")}-${day.toString().padStart(2, "0")} ${time}`;
          dateObj = new Date(formattedDateString);
        }
      }
    }
    if (!dateObj || isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return dateObj.toLocaleString("en-IN", { hour12: true });
  };

  const fetchMenus = useCallback(async () => {
    try {
      const params = { userId, ulbId, deptId };
      const response = await apiService.post("SWMMenus", params);
      const allMenus = Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      const menuMap = {};
      allMenus.forEach((menu) => {
        menuMap[menu.MENUID] = { ...menu, children: [] };
      });

      const structuredMenus = [];
      allMenus.forEach((menu) => {
        if (menu.PARENTID === 0 || menu.PARENTID === null) {
          structuredMenus.push(menuMap[menu.MENUID]);
        } else {
          const parent = menuMap[menu.PARENTID];
          if (parent) parent.children.push(menuMap[menu.MENUID]);
        }
      });

      setMenuItems(structuredMenus);
    } catch (error) {
      console.error("❌ Error fetching menus:", error);
    }
  }, [userId, ulbId]);

  const fetchLogo = useCallback(async () => {
    if (!ulbId) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/textlogo/${ulbId}`);
      if (response.data.success) {
        const { ULBLOGO } = response.data.data;
        setLogoUrl(ULBLOGO);
      }
    } catch (error) {
      console.error("❌ Error fetching logo:", error);
    }
  }, [ulbId]);

  useEffect(() => {
    if (!userId || !ulbId) return;
    fetchMenus();
    fetchLogo();
  }, [userId, ulbId, fetchMenus, fetchLogo]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center gap-3">
          {/* Hamburger Button */}
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className="bi bi-list text-2xl text-gray-800"></i>
          </button>

          {/* Logo */}
          <NavbarLogo src={logoUrl} />
          <NavbarText text1={navbarText.text1} text2={navbarText.text2} />
        </div>

        <div>
          <TimeComponent
            lastLogin={formatDate(lastLogin)}
            lastLogout={formatDate(lastLogout)}
          />
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 bg-violet-600 text-white flex justify-between items-center">
          <span className="font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg text-lg"></i>
          </button>
        </div>

        <ul className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-60px)]">
          <li>
            <a
              href="/dashboard"
              className="block px-3 py-2 rounded-md hover:bg-violet-100 text-gray-800 font-semibold"
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </a>
          </li>

          {menuItems.map((menu) => (
            <li key={menu.MENUID}>
              <details className="group">
                <summary className="cursor-pointer px-3 py-2 rounded-md hover:bg-violet-100 text-gray-800 font-semibold flex justify-between items-center">
                  {menu.MENUTITLE}
                  {menu.children.length > 0 && (
                    <i className="bi bi-chevron-down text-sm group-open:rotate-180 transition-transform"></i>
                  )}
                </summary>
                {menu.children.length > 0 && (
                  <ul className="pl-4 border-l border-gray-300 mt-1 space-y-1">
                    {menu.children.map((sub) => (
                      <li key={sub.MENUID}>
                        <a
                          href={sub.PAGEPATH || "#"}
                          className="block px-2 py-1 text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setSidebarOpen(false)}
                        >
                          {sub.MENUTITLE}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </details>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
