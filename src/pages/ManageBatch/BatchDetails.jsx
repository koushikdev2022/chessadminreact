import { Label } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { ohBatchList } from "../../Reducer/BatchSlice";
import { useSelector } from "react-redux";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const BatchDetails = () => {
  const { batchList } = useSelector((state) => state?.batch);
  const location = useLocation();
  const batch_id = location?.state?.batch_id;
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("sessions");

  useEffect(() => {
    dispatch(ohBatchList({ id: batch_id }));
  }, [batch_id]);

  // Format time display - Updated for proper 12-hour format
  const formatTime = (time, isAM) => {
    if (!time) return "N/A";

    // Extract hours and minutes from time string (assuming format like "14:30:00")
    const timeParts = time.split(":");
    let hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];

    // Convert to 12-hour format
    let period = "AM";
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours = hours - 12;
      }
    } else if (hours === 0) {
      hours = 12; // Handle midnight case
    }

    return `${hours}:${minutes} ${period}`;
  };

  // Format date display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Base column definitions for sessions and clash
  // Base columns (for Sessions & Clash tabs)
  const getBaseColumnDefs = () => [
    {
      headerName: "Session Date",
      field: "date",
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: "Day",
      valueGetter: (params) => params.data?.Day?.day || "N/A",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Start Time",
      field: "start_time",
      sortable: true,
      width: 130,
      valueFormatter: (params) =>
        formatTime(params.value, params.data?.start_time_am),
    },
    {
      headerName: "End Time",
      field: "end_time",
      sortable: true,
      width: 130,
      valueFormatter: (params) =>
        formatTime(params.value, params.data?.end_time_am),
    },
    // {
    //   headerName: "Coach",
    //   valueGetter: (params) =>
    //     params.data?.Coach
    //       ? `${params.data.Coach.f_name} ${params.data.Coach.l_name}`
    //       : "N/A",
    //   sortable: true,
    //   filter: true,
    //   width: 180,
    // },
    // {
    //   headerName: "Coach Email",
    //   valueGetter: (params) => params.data?.Coach?.email || "N/A",
    //   sortable: true,
    //   filter: true,
    //   width: 200,
    // },
    // {
    //   headerName: "Coach Mobile",
    //   valueGetter: (params) => params.data?.Coach?.mobile || "N/A",
    //   sortable: true,
    //   filter: true,
    //   width: 150,
    // },
    {
      headerName: "Meeting Link",
      field: "link",
      sortable: true,
      width: 150,
      cellRenderer: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Join
          </a>
        ) : (
          "N/A"
        ),
    },
    {
      headerName: "Reschedule Request",
      field: "reschedule_request",
      sortable: true,
      width: 160,
      cellRenderer: (params) =>
        params.value === 1 ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        ) : (
          "No"
        ),
    },
    {
      headerName: "Cancel Request",
      field: "cancel_request",
      sortable: true,
      width: 140,
      cellRenderer: (params) =>
        params.value === 1 ? (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Requested
          </span>
        ) : (
          "No"
        ),
    },
  ];

  // Column definitions for completed sessions (might have different fields)
  // Completed sessions columns
  const getCompletedColumnDefs = () => [
    {
      headerName: "Session Date",
      field: "date",
      sortable: true,
      filter: true,
      width: 150,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      headerName: "Day",
      valueGetter: (params) => params.data?.Day?.day || "N/A",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Start Time",
      field: "start_time",
      sortable: true,
      width: 130,
      valueFormatter: (params) =>
        formatTime(params.value, params.data?.start_time_am),
    },
    {
      headerName: "End Time",
      field: "end_time",
      sortable: true,
      width: 130,
      valueFormatter: (params) =>
        formatTime(params.value, params.data?.end_time_am),
    },
    // {
    //   headerName: "Coach",
    //   valueGetter: (params) =>
    //     params.data?.Coach
    //       ? `${params.data.Coach.f_name} ${params.data.Coach.l_name}`
    //       : "N/A",
    //   sortable: true,
    //   filter: true,
    //   width: 180,
    // },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 120,
      cellRenderer: () => (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Completed
        </span>
      ),
    },
    {
      headerName: "Meeting Link",
      field: "link",
      sortable: true,
      width: 150,
      cellRenderer: (params) =>
        params.value ? (
          <a
            href={params.value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View Recording
          </a>
        ) : (
          "N/A"
        ),
    },
  ];

  // Default column properties
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: false,
    }),
    []
  );

  // Grid options
  const gridOptions = {
    pagination: true,
    paginationPageSize: 10,
    domLayout: "autoHeight",
    suppressHorizontalScroll: false,
  };

  console.log("batchList", batchList?.data?.[0]);

  // FIXED: Get data for different tabs - corrected the data access
  const batchData = batchList?.data?.[0] || {};
  const sessionsData = batchData?.BatchTime || [];
  const clashData = batchData?.BatchTimeClash || [];
  const completedData = batchData?.BatchTimeComplete || [];
  const baseColumnDefs = useMemo(() => getBaseColumnDefs(), [activeTab]);
  const completedColumnDefs = useMemo(() => getCompletedColumnDefs(), []);
  // Get current tab data and columns
  // const getCurrentTabData = () => {
  //   console.log("activeTab", activeTab);

  //   switch (activeTab) {
  //     case "sessions":
  //       return { data: sessionsData, columns: getBaseColumnDefs() };
  //     case "clash":
  //       return { data: clashData, columns: getBaseColumnDefs() };
  //     case "completed":
  //       return { data: completedData, columns: getCompletedColumnDefs() };
  //     default:
  //       return { data: sessionsData, columns: getBaseColumnDefs() };
  //   }
  // };

  const getCurrentTabData = () => {
    switch (activeTab) {
      case "sessions":
        return { data: sessionsData, columns: baseColumnDefs };
      case "clash":
        return { data: clashData, columns: baseColumnDefs };
      case "completed":
        return { data: completedData, columns: completedColumnDefs };
      default:
        return { data: sessionsData, columns: baseColumnDefs };
    }
  };

  const currentTabData = getCurrentTabData();
  console.log(currentTabData, "currentTabData");

  // Tab configuration
  const tabs = [
    {
      key: "sessions",
      label: "Batch Sessions",
      count: sessionsData.length,
      color: "blue",
    },
    {
      key: "clash",
      label: "Batch Clash",
      count: clashData.length,
      color: "red",
    },
    {
      key: "completed",
      label: "Batch Completed",
      count: completedData.length,
      color: "green",
    },
  ];

  return (
    <>
      <div>
        <div className="min-h-screen bg-gray-100 field_area">
          <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Batch Details</h2>
            </div>
            <div className="space-y-4 popup_section">
              <div className="flex gap-4">
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Batch name" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {batchData?.batch_name}
                  </p>
                </div>
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Relationship Manager" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {batchData?.Oh?.f_name} {batchData?.Oh?.l_name}
                  </p>
                </div>
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Batch Coach" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {batchData?.Coach?.f_name} {batchData?.Coach?.l_name}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Batch Limit" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {batchData?.student_limit}
                  </p>
                </div>
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Country" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {batchData?.Country?.country_name}
                  </p>
                </div>
                <div className="w-6/12">
                  <div className="mb-1 block">
                    <Label value="Planned Start Date" />
                  </div>
                  <p className="text-[#8E8E8E] text-sm">
                    {formatDate(batchData?.start_date)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="max-w-full mx-auto mt-6 p-6 bg-white shadow rounded-xl">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === tab.key
                        ? `border-${tab.color}-500 text-${tab.color}-600`
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                    <span
                      className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.key
                          ? `bg-${tab.color}-100 text-${tab.color}-800`
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {tabs.find((tab) => tab.key === activeTab)?.label}
                </h3>
                <p className="text-sm text-gray-600">
                  Total Records: {currentTabData.data.length}
                </p>
              </div>

              {currentTabData.data.length > 0 ? (
                <div
                  className="ag-theme-alpine"
                  style={{ height: 600, width: "100%" }}
                >
                  <AgGridReact
                    columnDefs={currentTabData.columns}
                    rowData={currentTabData.data}
                    defaultColDef={defaultColDef}
                    gridOptions={gridOptions}
                    animateRows={true}
                    rowSelection="single"
                    suppressRowClickSelection={false}
                    // onGridReady={(params) => {
                    //   setTimeout(() => params.api.sizeColumnsToFit(), 100);
                    // }}
                    onFirstDataRendered={(params) => {
                      params.api.sizeColumnsToFit();
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">
                    No data available
                  </div>
                  <p className="text-gray-500 text-sm">
                    There are no records to display for{" "}
                    {tabs
                      .find((tab) => tab.key === activeTab)
                      ?.label.toLowerCase()}
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default BatchDetails;
