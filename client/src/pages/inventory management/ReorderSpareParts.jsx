import React, { useState } from "react";
import LowStockParts from "./LowStockParts";
import RequestedReorders from "./RequestedReorders";

const ReorderSpareParts = () => {
  const [activeTab, setActiveTab] = useState("lowStock");

  return (
    <div className="bg-PrimaryColor min-h-screen p-8">
      <h1 className="text-extra-dark text-3xl mb-8 font-bold">
        Reorder Spare Parts
      </h1>

      {/* Toggle Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-6 py-2 text-dark ${
            activeTab === "lowStock" ? "border-b-2 border-dark font-bold" : ""
          }`}
          onClick={() => setActiveTab("lowStock")}
        >
          Low Stock Items
        </button>
        <button
          className={`px-6 py-2 text-dark ${
            activeTab === "reorderRequests"
              ? "border-b-2 border-dark font-bold"
              : ""
          }`}
          onClick={() => setActiveTab("reorderRequests")}
        >
          Requested Reorders
        </button>
      </div>

      {/* Conditional Rendering */}
      {activeTab === "lowStock" ? <LowStockParts /> : <RequestedReorders />}
    </div>
  );
};

export default ReorderSpareParts;
