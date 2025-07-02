// import React, { useEffect, useState } from "react";
// import { Modal, Button, TextInput, Label } from "flowbite-react";
// import { ToastContainer } from "react-toastify";
// import { AgGridReact } from "ag-grid-react";
// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import userRoles from "../utils/userRoles";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import {
//   getCoachList,
//   getCoachListOperationalHead,
// } from "../../Reducer/CoachSlice";
// import { useSelector } from "react-redux";

// const ManageCoaches = () => {
//   const { getCoachOHData, allCoach } = useSelector((state) => state?.coach);
//   const [openModal, setOpenModal] = useState(false);
//   const [rowData, setRowData] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const nevigate = useNavigate();
//   const dispatch = useDispatch();
//   const currentUserRole = userRoles();
//   console.log("userRole", currentUserRole);
//   useEffect(() => {
//     if (currentUserRole === "SA") {
//       dispatch(getCoachList());
//     } else {
//       dispatch(getCoachListOperationalHead());
//     }
//   }, [dispatch, currentUserRole]);

//   console.log("getCoachOHData", getCoachOHData);

//   const currentUser = userRoles();

//   const handleAddCoach = () => {
//     nevigate("/add-coach");
//   };

//   // Checkbox cell renderer
//   const CheckboxCellRenderer = (params) => {
//     const handleCheckboxChange = (event) => {
//       const isChecked = event.target.checked;
//       const rowId = params.data.id;

//       if (isChecked) {
//         setSelectedRows((prev) => [...prev, rowId]);
//       } else {
//         setSelectedRows((prev) => prev.filter((id) => id !== rowId));
//       }
//     };

//     return (
//       <input
//         type="checkbox"
//         checked={selectedRows.includes(params.data.id)}
//         onChange={handleCheckboxChange}
//         className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//       />
//     );
//   };

//   useEffect(() => {
//     if (getCoachOHData?.results) {
//       const processedData = [];

//       getCoachOHData.results.map((coach) => {
//         // Collect all time slots and days for this coach
//         const timeSlots = [];
//         const days = [];

//         if (coach.CoachTime && coach.CoachTime.length > 0) {
//           coach.CoachTime.forEach((timeSlot) => {
//             const formattedTimeSlot = `${formatTime(
//               timeSlot.start_time,
//               timeSlot.start_time_am
//             )} - ${formatTime(timeSlot.end_time, timeSlot.end_time_am)}`;
//             timeSlots.push(formattedTimeSlot);

//             if (timeSlot.Day && timeSlot.Day.length > 0) {
//               timeSlot.Day.forEach((day) => {
//                 if (!days.includes(day.day)) {
//                   days.push(day.day);
//                 }
//               });
//             }
//           });
//         }

//         // Create a single row per coach with combined time slots and days
//         processedData.push({
//           id: coach.id,
//           coachName: `${coach.f_name} ${coach.l_name}`,
//           relationalManager: `${coach.RM.f_name} ${coach.RM.l_name}`,
//           level: coach.level_id,
//           created_at: new Date(coach.created_at).toLocaleDateString(),
//           days: days.length > 0 ? days.join(", ") : "Not specified",
//           timeSlots:
//             timeSlots.length > 0 ? timeSlots.join(" | ") : "Not specified",
//           status: coach.status === 1 ? "Active" : "Inactive",
//           fidRating: coach.fid_reating,
//           address: coach.CoachAddress?.first_line || "N/A",
//         });
//       });

//       setRowData(processedData);
//     }
//   }, [getCoachOHData]);

//   // Helper function to format time
//   const formatTime = (time, isAM) => {
//     if (!time) return "N/A";

//     // Convert 24-hour format to 12-hour format
//     const [hours, minutes] = time.split(":");
//     let hour12 = parseInt(hours);
//     const ampm = isAM ? "AM" : "PM";

//     if (hour12 === 0) {
//       hour12 = 12;
//     } else if (hour12 > 12) {
//       hour12 = hour12 - 12;
//     }

//     return `${hour12}:${minutes} ${ampm}`;
//   };

//   // Status cell renderer
//   const StatusCellRenderer = (params) => {
//     const isActive = params.value === "Active";
//     return (
//       <span
//         className={`px-2 py-1 rounded-full text-xs font-medium ${
//           isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
//         }`}
//       >
//         {params.value}
//       </span>
//     );
//   };

//   // Column definitions
//   const columnDefs = [
//     {
//       headerName: "",
//       field: "checkbox",
//       width: 50,
//       cellRenderer: CheckboxCellRenderer,
//       sortable: false,
//       filter: false,
//       resizable: false,
//       pinned: "left",
//     },
//     {
//       headerName: "Relational Manager",
//       field: "relationalManager",
//       sortable: true,
//       filter: true,
//       width: 180,
//       pinned: "left",
//     },
//     {
//       headerName: "Coach Name",
//       field: "coachName",
//       sortable: true,
//       filter: true,
//       width: 150,
//     },
//     {
//       headerName: "Created At",
//       field: "created_at",
//       sortable: true,
//       filter: true,
//       width: 120,
//     },
//     {
//       headerName: "Days",
//       field: "days",
//       sortable: true,
//       filter: true,
//       width: 150,
//     },
//     {
//       headerName: "Time Slots",
//       field: "timeSlots",
//       sortable: true,
//       filter: true,
//       width: 200,
//     },
//     {
//       headerName: "Status",
//       field: "status",
//       sortable: true,
//       filter: true,
//       width: 100,
//       cellRenderer: StatusCellRenderer,
//     },
//     {
//       headerName: "FID Rating",
//       field: "fidRating",
//       sortable: true,
//       filter: true,
//       width: 120,
//     },
//     {
//       headerName: "Address",
//       field: "address",
//       sortable: true,
//       filter: true,
//       width: 150,
//     },
//   ];

//   // Grid options
//   const defaultColDef = {
//     resizable: true,
//     sortable: true,
//     filter: true,
//   };

//   return (
//     <div>
//       <ToastContainer />
//       <div className="wrapper_area my-0 mx-auto p-6 rounded-xl bg-white">
//         <div className="h-full lg:h-screen">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-semibold">Coaches</h2>
//             {currentUser === "OH" && (
//               <>
//                 <Button
//                   onClick={() => handleAddCoach()}
//                   className="bg-[#090722] hover:bg-black px-6 py-2 text-white text-base font-semibold flex justify-center items-center rounded-md"
//                 >
//                   Register New Coach Account
//                 </Button>
//               </>
//             )}
//           </div>
//           {selectedRows.length > 0 && (
//             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//               <p className="text-sm text-blue-800">
//                 {selectedRows.length} coach(es) selected
//               </p>
//             </div>
//           )}
//           <div
//             className="ag-theme-alpine"
//             style={{ height: 600, width: "100%" }}
//           >
//             <AgGridReact
//               rowData={rowData}
//               columnDefs={columnDefs}
//               defaultColDef={defaultColDef}
//               pagination={true}
//               paginationPageSize={10}
//               domLayout="autoHeight"
//               animateRows={true}
//               rowSelection="multiple"
//               onGridReady={(params) => {
//                 // Auto-size columns to fit content
//                 params.api.sizeColumnsToFit();
//               }}
//               onFirstDataRendered={(params) => {
//                 // Auto-size columns when data is first rendered
//                 params.api.sizeColumnsToFit();
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* <Modal show={openModal} onClose={() => setOpenModal(false)}>
//         <Modal.Header>Add New Coach</Modal.Header>
//         <Modal.Body>
//           <div className="space-y-4">
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="name" value="Coach Name" />
//               </div>
//               <TextInput
//                 id="name"
//                 type="text"
//                 placeholder="Enter coach name"
//                 required
//               />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="phone" value="Phone Number" />
//               </div>
//               <TextInput
//                 id="phone"
//                 type="tel"
//                 placeholder="Enter phone number"
//                 required
//               />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="email" value="Email" />
//               </div>
//               <TextInput
//                 id="email"
//                 type="email"
//                 placeholder="Enter email"
//                 required
//               />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="address" value="Physical Address" />
//               </div>
//               <TextInput
//                 id="address"
//                 type="text"
//                 placeholder="Enter address"
//                 required
//               />
//             </div>
//             <div>
//               <div className="mb-2 block">
//                 <Label htmlFor="country" value="Country" />
//               </div>
//               <TextInput
//                 id="country"
//                 type="text"
//                 placeholder="Enter country"
//                 required
//               />
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={() => setOpenModal(false)}>Cancel</Button>
//           <Button color="success">Add Coach</Button>
//         </Modal.Footer>
//       </Modal> */}
//     </div>
//   );
// };

// export default ManageCoaches;

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
  const [openAvailabilityModal, setOpenAvailabilityModal] = useState(false);
  const [selectedCoachForCalendar, setSelectedCoachForCalendar] =
    useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [unavailableSlots, setUnavailableSlots] = useState([]);
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

  // Availability Button Cell Renderer
  const AvailabilityCellRenderer = (params) => {
    const handleAvailabilityClick = () => {
      const coachData = params.data;
      setSelectedCoachForCalendar(coachData);
      setOpenAvailabilityModal(true);
      calculateSlots(coachData, selectedDate);
    };

    return (
      <button
        onClick={handleAvailabilityClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
      >
        View Calendar
      </button>
    );
  };

  // Function to calculate both available and unavailable slots for a specific date
  const calculateSlots = (coachData, date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    // Find coach's full data from the original API response
    const fullCoachData = getCoachOHData?.results?.find(
      (coach) => coach.id === coachData.id
    );

    if (!fullCoachData || !fullCoachData.CoachTime) {
      // If no data, coach is completely available
      setUnavailableSlots([]);
      setAvailableSlots([
        {
          startTime: "Available all day",
          endTime: "",
          note: "No scheduled unavailable times",
        },
      ]);
      return;
    }

    // Get unavailable slots for this specific day
    const dayUnavailableSlots = [];

    fullCoachData.CoachTime.forEach((timeSlot) => {
      // Check if this unavailable slot applies to the selected day
      const appliesToThisDay = timeSlot.Day?.some((day) => day.day === dayName);

      if (appliesToThisDay) {
        const unavailableSlot = {
          startTime: formatTime(timeSlot.start_time, timeSlot.start_time_am),
          endTime: formatTime(timeSlot.end_time, timeSlot.end_time_am),
          timeZoneId: timeSlot.time_zone_id,
          breakTimes:
            timeSlot.CoachBreakTime?.map((breakTime) => ({
              startTime: formatTime(
                breakTime.start_time,
                breakTime.start_time_am
              ),
              endTime: formatTime(breakTime.end_time, breakTime.end_time_am),
            })) || [],
        };
        dayUnavailableSlots.push(unavailableSlot);
      }
    });

    setUnavailableSlots(dayUnavailableSlots);

    // Calculate available slots (opposite of unavailable)
    if (dayUnavailableSlots.length === 0) {
      setAvailableSlots([
        {
          startTime: "Available all day",
          endTime: "",
          note: "No scheduled unavailable times",
        },
      ]);
    } else {
      // For simplicity, just show "Available when not in unavailable slots"
      setAvailableSlots([
        {
          startTime: "Available",
          endTime: "when not unavailable",
          note: "Free time slots between unavailable periods",
        },
      ]);
    }
  };

  // Function to check if coach has unavailable slots on a specific date
  const hasUnavailableSlotsOnDate = (coachData, date) => {
    const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
    const fullCoachData = getCoachOHData?.results?.find(
      (coach) => coach.id === coachData.id
    );

    if (!fullCoachData || !fullCoachData.CoachTime) {
      return false; // No unavailable slots
    }

    // Check if there are unavailable slots for this day
    return fullCoachData.CoachTime.some((timeSlot) =>
      timeSlot.Day?.some((day) => day.day === dayName)
    );
  };

  // Custom date picker day class name - Red for unavailable, Green for available
  const getDayClassName = (date) => {
    if (selectedCoachForCalendar) {
      const hasUnavailableSlots = hasUnavailableSlotsOnDate(
        selectedCoachForCalendar,
        date
      );

      if (hasUnavailableSlots) {
        return "unavailable-day"; // Red styling
      } else {
        return "available-day"; // Green styling
      }
    }
    return "";
  };

  // Handle date selection in calendar
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedCoachForCalendar) {
      calculateSlots(selectedCoachForCalendar, date);
    }
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

  // Column definitions with added Availability column
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
    // NEW AVAILABILITY COLUMN
    {
      headerName: "Availability",
      field: "availability",
      sortable: false,
      filter: false,
      width: 120,
      cellRenderer: AvailabilityCellRenderer,
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

      {/* Availability Calendar Modal */}
      <Modal
        show={openAvailabilityModal}
        onClose={() => setOpenAvailabilityModal(false)}
        size="4xl"
      >
        <Modal.Header>
          Coach Availability Calendar
          {selectedCoachForCalendar && (
            <div className="text-sm text-gray-600 mt-1">
              Coach: {selectedCoachForCalendar.coachName}
            </div>
          )}
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Calendar Section */}
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Select Date</h3>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateSelect}
                  inline
                  dayClassName={getDayClassName}
                />
              </div>

              {/* Legend */}
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span>Available Days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                  <span>Has Unavailable Slots</span>
                </div>
              </div>
            </div>

            {/* Availability Details Section */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">
                Schedule for {selectedDate.toDateString()}
              </h3>

              {/* Show Unavailable Slots */}
              {unavailableSlots.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-red-600 mb-2">
                    🚫 Unavailable Slots:
                  </h4>
                  <div className="space-y-2">
                    {unavailableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
                      >
                        <div className="font-semibold text-red-600 text-sm">
                          {slot.startTime} - {slot.endTime}
                        </div>
                        {slot.breakTimes.length > 0 && (
                          <div className="text-xs text-red-500 mt-1">
                            <span>Break Times: </span>
                            {slot.breakTimes.map((breakTime, breakIndex) => (
                              <span key={breakIndex} className="mr-2">
                                {breakTime.startTime}-{breakTime.endTime}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show Available Status */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-green-600 mb-2">
                  ✅ Availability Status:
                </h4>
                {availableSlots.length > 0 ? (
                  <div className="space-y-3">
                    {availableSlots.map((slot, index) => (
                      <div
                        key={index}
                        className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500"
                      >
                        <div className="font-semibold text-green-600 mb-1">
                          {slot.startTime} {slot.endTime && `${slot.endTime}`}
                        </div>
                        {slot.note && (
                          <div className="text-xs text-green-600 italic">
                            {slot.note}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-3xl mb-2">⏰</div>
                    <p>Loading availability...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setOpenAvailabilityModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add custom styles for calendar */}
      <style>{`
        /* Available days - Green styling */
        .react-datepicker__day.available-day {
          background-color: #d4f8d4 !important;
          color: #2d5a2d !important;
          border-radius: 50% !important;
        }
        
        .react-datepicker__day.available-day:hover {
          background-color: #b8f0b8 !important;
          color: #1a4a1a !important;
        }

        /* Unavailable days - Red styling */
        .react-datepicker__day.unavailable-day {
          background-color: #fdd4d4 !important;
          color: #8b0000 !important;
          border-radius: 50% !important;
        }
        
        .react-datepicker__day.unavailable-day:hover {
          background-color: #f8b8b8 !important;
          color: #660000 !important;
        }

        /* Selected date styling */
        .react-datepicker__day--selected {
          background-color: #2563eb !important;
          color: white !important;
        }

        .react-datepicker__day--selected.available-day {
          background-color: #16a34a !important;
          color: white !important;
        }

        .react-datepicker__day--selected.unavailable-day {
          background-color: #dc2626 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default ManageCoaches;
