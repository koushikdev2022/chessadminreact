import React, { useEffect, useState } from "react";
import { Modal, Button, TextInput, Label } from "flowbite-react";
import { ToastContainer } from "react-toastify";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userRoles from "../utils/userRoles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getCoachList,
  getCoachListOperationalHead,
} from "../../Reducer/CoachSlice";
import { useSelector } from "react-redux";

const ManageCoaches = () => {
  const { getCoachOHData, allCoach } = useSelector((state) => state?.coach);
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const nevigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserRole = userRoles();
  console.log("userRole", currentUserRole);
  useEffect(() => {
    if (currentUserRole === "SA") {
      dispatch(getCoachList());
    } else {
      dispatch(getCoachListOperationalHead());
    }
  }, [dispatch, currentUserRole]);

  console.log("getCoachOHData", getCoachOHData);

  const currentUser = userRoles();

  const handleAddCoach = () => {
    nevigate("/add-coach");
  };

  // Checkbox cell renderer
  const CheckboxCellRenderer = (params) => {
    const handleCheckboxChange = (event) => {
      const isChecked = event.target.checked;
      const rowId = params.data.id;

      if (isChecked) {
        setSelectedRows((prev) => [...prev, rowId]);
      } else {
        setSelectedRows((prev) => prev.filter((id) => id !== rowId));
      }
    };

    return (
      <input
        type="checkbox"
        checked={selectedRows.includes(params.data.id)}
        onChange={handleCheckboxChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
    );
  };

  useEffect(() => {
    if (getCoachOHData?.results) {
      const processedData = [];

      getCoachOHData.results.map((coach) => {
        // Collect all time slots and days for this coach
        const timeSlots = [];
        const days = [];

        if (coach.CoachTime && coach.CoachTime.length > 0) {
          coach.CoachTime.forEach((timeSlot) => {
            const formattedTimeSlot = `${formatTime(
              timeSlot.start_time,
              timeSlot.start_time_am
            )} - ${formatTime(timeSlot.end_time, timeSlot.end_time_am)}`;
            timeSlots.push(formattedTimeSlot);

            if (timeSlot.Day && timeSlot.Day.length > 0) {
              timeSlot.Day.forEach((day) => {
                if (!days.includes(day.day)) {
                  days.push(day.day);
                }
              });
            }
          });
        }

        // Create a single row per coach with combined time slots and days
        processedData.push({
          id: coach.id,
          coachName: `${coach.f_name} ${coach.l_name}`,
          relationalManager: `${coach.RM.f_name} ${coach.RM.l_name}`,
          level: coach.level_id,
          created_at: new Date(coach.created_at).toLocaleDateString(),
          days: days.length > 0 ? days.join(", ") : "Not specified",
          timeSlots:
            timeSlots.length > 0 ? timeSlots.join(" | ") : "Not specified",
          status: coach.status === 1 ? "Active" : "Inactive",
          fidRating: coach.fid_reating,
          address: coach.CoachAddress?.first_line || "N/A",
        });
      });

      setRowData(processedData);
    }
  }, [getCoachOHData]);

  // Helper function to format time
  const formatTime = (time, isAM) => {
    if (!time) return "N/A";

    // Convert 24-hour format to 12-hour format
    const [hours, minutes] = time.split(":");
    let hour12 = parseInt(hours);
    const ampm = isAM ? "AM" : "PM";

    if (hour12 === 0) {
      hour12 = 12;
    } else if (hour12 > 12) {
      hour12 = hour12 - 12;
    }

    return `${hour12}:${minutes} ${ampm}`;
  };

  // Status cell renderer
  const StatusCellRenderer = (params) => {
    const isActive = params.value === "Active";
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {params.value}
      </span>
    );
  };

  // Column definitions
  const columnDefs = [
    {
      headerName: "",
      field: "checkbox",
      width: 50,
      cellRenderer: CheckboxCellRenderer,
      sortable: false,
      filter: false,
      resizable: false,
      pinned: "left",
    },
    {
      headerName: "Relational Manager",
      field: "relationalManager",
      sortable: true,
      filter: true,
      width: 180,
      pinned: "left",
    },
    {
      headerName: "Coach Name",
      field: "coachName",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Created At",
      field: "created_at",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Days",
      field: "days",
      sortable: true,
      filter: true,
      width: 150,
    },
    {
      headerName: "Time Slots",
      field: "timeSlots",
      sortable: true,
      filter: true,
      width: 200,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      width: 100,
      cellRenderer: StatusCellRenderer,
    },
    {
      headerName: "FID Rating",
      field: "fidRating",
      sortable: true,
      filter: true,
      width: 120,
    },
    {
      headerName: "Address",
      field: "address",
      sortable: true,
      filter: true,
      width: 150,
    },
  ];

  // Grid options
  const defaultColDef = {
    resizable: true,
    sortable: true,
    filter: true,
  };

  return (
    <div>
      <ToastContainer />
      <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
        <div className="h-full lg:h-screen">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Coaches</h2>
            {currentUser === "OH" && (
              <>
                <Button
                  onClick={() => handleAddCoach()}
                  className="bg-[#090722] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
                >
                  Register New Coach Account
                </Button>
              </>
            )}
          </div>
          {selectedRows.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                {selectedRows.length} coach(es) selected
              </p>
            </div>
          )}
          <div
            className="ag-theme-alpine"
            style={{ height: 600, width: "100%" }}
          >
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              domLayout="autoHeight"
              animateRows={true}
              rowSelection="multiple"
              onGridReady={(params) => {
                // Auto-size columns to fit content
                params.api.sizeColumnsToFit();
              }}
              onFirstDataRendered={(params) => {
                // Auto-size columns when data is first rendered
                params.api.sizeColumnsToFit();
              }}
            />
          </div>
        </div>
      </div>

      {/* <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Coach</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Coach Name" />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="Enter coach name"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="phone" value="Phone Number" />
              </div>
              <TextInput
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="address" value="Physical Address" />
              </div>
              <TextInput
                id="address"
                type="text"
                placeholder="Enter address"
                required
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="country" value="Country" />
              </div>
              <TextInput
                id="country"
                type="text"
                placeholder="Enter country"
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button color="success">Add Coach</Button>
        </Modal.Footer>
      </Modal> */}
    </div>
  );
};

export default ManageCoaches;
