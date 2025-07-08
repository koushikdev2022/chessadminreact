// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { getCoachDetails } from "../../Reducer/BatchSlice";
// import { useSelector } from "react-redux";

// const CoachCalender = ({
//   openCalendar,
//   setOpenCalender,
//   coachId,
//   setCoachId,
// }) => {
//   const { coachDetailsData } = useSelector((state) => state?.batch);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getCoachDetails({ coach_id: coachId }));
//   }, [dispatch, coachId]);
//   console.log("coachDetailsData", coachDetailsData?.results);

//   return <></>;
// };
// export default CoachCalender;

// CoachCalendarModal.jsx
// import React, { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { Modal } from "flowbite-react";
// import { useDispatch, useSelector } from "react-redux";
// import { getCoachDetails } from "../../Reducer/BatchSlice";

// const formatTo12Hour = (timeStr) => {
//   if (!timeStr) return "";
//   const [hour, minute] = timeStr.split(":");
//   const date = new Date();
//   date.setHours(+hour);
//   date.setMinutes(+minute);
//   return date.toLocaleTimeString("en-US", {
//     hour: "numeric",
//     minute: "2-digit",
//     hour12: true,
//   });
// };

// const CoachCalendar = ({ openCalendar, setOpenCalender, coachId }) => {
//   const dispatch = useDispatch();
//   const { coachDetailsData } = useSelector((state) => state.batch);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [dailyDetails, setDailyDetails] = useState({});

//   useEffect(() => {
//     if (coachId) {
//       dispatch(getCoachDetails({ coach_id: coachId }));
//     }
//   }, [coachId]);

//   useEffect(() => {
//     if (coachDetailsData?.results?.CoachTime) {
//       const daysMap = {};
//       const batchDatesMap = {};

//       coachDetailsData.results.CoachTime.forEach((time) => {
//         time.Day.forEach((day) => {
//           const dayName = day.day;
//           if (!daysMap[dayName]) daysMap[dayName] = [];
//           daysMap[dayName].push({
//             dutyStart: time.start_time,
//             dutyEnd: time.end_time,
//             breaks: time.CoachBreakTime,
//           });
//         });
//       });

//       coachDetailsData.results.Batch.forEach((batch) => {
//         batch.BatchTime.forEach((bt) => {
//           const date = bt.date;
//           if (!batchDatesMap[date]) batchDatesMap[date] = [];
//           batchDatesMap[date].push({
//             startTime: bt.start_time,
//             endTime: bt.end_time,
//           });
//         });
//       });

//       const detailMap = {};
//       const today = new Date();
//       const nextMonth = new Date();
//       nextMonth.setMonth(today.getMonth() + 1);

//       const iter = new Date(today);
//       const eventsList = [];

//       while (iter <= nextMonth) {
//         const dateStr = iter.toISOString().split("T")[0];
//         const weekday = iter.toLocaleString("en-US", { weekday: "long" });

//         if (daysMap[weekday]) {
//           detailMap[dateStr] = {
//             duty: daysMap[weekday][0],
//             classes: batchDatesMap[dateStr] || [],
//           };

//           eventsList.push({
//             title: "Available",
//             date: dateStr,
//             display: "background",
//             classNames: ["available-day"],
//           });

//           // Breaks
//           daysMap[weekday][0].breaks.forEach((b, idx) => {
//             eventsList.push({
//               title: `Break ${formatTo12Hour(b.start_time)} - ${formatTo12Hour(
//                 b.end_time
//               )}`,
//               date: dateStr,
//               classNames: ["break-time"],
//             });
//           });

//           // Classes
//           (batchDatesMap[dateStr] || []).forEach((cls) => {
//             eventsList.push({
//               title: `Class ${formatTo12Hour(cls.startTime)} - ${formatTo12Hour(
//                 cls.endTime
//               )}`,
//               date: dateStr,
//               classNames: ["class-time"],
//             });
//           });
//         }

//         iter.setDate(iter.getDate() + 1);
//       }

//       setEvents(eventsList);
//       setDailyDetails(detailMap);
//     }
//   }, [coachDetailsData]);

//   const handleDateClick = (info) => {
//     setSelectedDate(info.dateStr);
//   };

//   const selectedInfo = dailyDetails[selectedDate];

//   return (
//     <Modal
//       show={openCalendar}
//       onClose={() => setOpenCalender(false)}
//       size="7xl"
//     >
//       <Modal.Header>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Coach Availability</h2>
//           <button
//             onClick={() => setOpenCalender(false)}
//             className="text-red-500 text-xl font-bold"
//           >
//             &times;
//           </button>
//         </div>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="flex flex-col lg:flex-row gap-6">
//           <div className="w-full lg:w-2/3">
//             <FullCalendar
//               plugins={[dayGridPlugin, interactionPlugin]}
//               initialView="dayGridMonth"
//               events={events}
//               dateClick={handleDateClick}
//               height="auto"
//             />
//           </div>
//           <div className="w-full lg:w-1/3 border-l pl-4">
//             {selectedDate ? (
//               <>
//                 <h3 className="text-lg font-semibold mb-2">
//                   Details for {selectedDate}:
//                 </h3>
//                 {selectedInfo ? (
//                   <>
//                     <p>
//                       <strong>Duty:</strong>{" "}
//                       {formatTo12Hour(selectedInfo.duty.dutyStart)} -{" "}
//                       {formatTo12Hour(selectedInfo.duty.dutyEnd)}
//                     </p>
//                     <p className="mt-2">
//                       <strong className="text-red-500">Breaks:</strong>
//                     </p>
//                     <ul className="list-disc ml-5 text-red-500">
//                       {selectedInfo.duty.breaks.map((b, idx) => (
//                         <li key={idx}>
//                           {formatTo12Hour(b.start_time)} -{" "}
//                           {formatTo12Hour(b.end_time)}
//                         </li>
//                       ))}
//                     </ul>
//                     <p className="mt-2">
//                       <strong>Scheduled Classes:</strong>
//                     </p>
//                     {selectedInfo.classes.length > 0 ? (
//                       <ul className="list-disc ml-5">
//                         {selectedInfo.classes.map((cls, idx) => (
//                           <li key={idx}>
//                             {formatTo12Hour(cls.startTime)} -{" "}
//                             {formatTo12Hour(cls.endTime)}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p>No classes scheduled.</p>
//                     )}
//                   </>
//                 ) : (
//                   <p>No availability info.</p>
//                 )}
//               </>
//             ) : (
//               <p>Select a date to view details.</p>
//             )}
//           </div>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default CoachCalendar;

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { getCoachDetails } from "../../Reducer/BatchSlice";
const formatTo12Hour = (timeStr) => {
  if (!timeStr) return "";
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
const CoachCalendar = ({ openCalendar, setOpenCalender, coachId }) => {
  const dispatch = useDispatch();
  const { coachDetailsData } = useSelector((state) => state.batch);
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [daysMap, setDaysMap] = useState({});
  const [batchDatesMap, setBatchDatesMap] = useState({});
  useEffect(() => {
    if (coachId) {
      dispatch(getCoachDetails({ coach_id: coachId }));
    }
  }, [coachId]);
  useEffect(() => {
    if (coachDetailsData?.results?.CoachTime) {
      const daysMapTemp = {};
      const batchDatesMapTemp = {};
      coachDetailsData.results.CoachTime.forEach((time) => {
        time.Day.forEach((day) => {
          const dayName = day.day;
          if (!daysMapTemp[dayName]) daysMapTemp[dayName] = [];
          daysMapTemp[dayName].push({
            dutyStart: time.start_time,
            dutyEnd: time.end_time,
            breaks: time.CoachBreakTime,
          });
        });
      });
      coachDetailsData.results.Batch.forEach((batch) => {
        batch.BatchTime.forEach((bt) => {
          const date = bt.date;
          if (!batchDatesMapTemp[date]) batchDatesMapTemp[date] = [];
          batchDatesMapTemp[date].push({
            startTime: bt.start_time,
            endTime: bt.end_time,
          });
        });
      });
      setDaysMap(daysMapTemp);
      setBatchDatesMap(batchDatesMapTemp);

      // Generate initial events for current month view
      generateInitialEvents(daysMapTemp, batchDatesMapTemp);
    }
  }, [coachDetailsData]);

  // Function to generate initial events for current month view (including prev/next month days)
  const generateInitialEvents = (daysMapTemp, batchDatesMapTemp) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Get the last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Find the first Sunday of the calendar view (might be from previous month)
    const firstSunday = new Date(firstDayOfMonth);
    firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

    // Find the last Saturday of the calendar view (might be from next month)
    const lastSaturday = new Date(lastDayOfMonth);
    lastSaturday.setDate(
      lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay())
    );

    const eventsList = [];
    const iter = new Date(firstSunday);

    while (iter <= lastSaturday) {
      const dateStr = iter.toISOString().split("T")[0];
      const eventsForDate = generateEventsForDateWithData(
        dateStr,
        daysMapTemp,
        batchDatesMapTemp
      );
      eventsList.push(...eventsForDate);
      iter.setDate(iter.getDate() + 1);
    }

    setEvents(eventsList);
  };

  // Function to generate events for a specific date with provided data
  const generateEventsForDateWithData = (
    dateStr,
    daysMapData,
    batchDatesMapData
  ) => {
    const date = new Date(dateStr);
    const weekday = date.toLocaleString("en-US", { weekday: "long" });
    const eventsForDate = [];

    if (daysMapData[weekday]) {
      // Add availability background
      eventsForDate.push({
        title: "Available",
        date: dateStr,
        display: "background",
        classNames: ["available-day"],
      });

      // Add breaks
      daysMapData[weekday][0].breaks.forEach((b, idx) => {
        eventsForDate.push({
          title: `Break ${formatTo12Hour(b.start_time)} - ${formatTo12Hour(
            b.end_time
          )}`,
          date: dateStr,
          classNames: ["break-time"],
        });
      });

      // Add classes for specific dates
      (batchDatesMapData[dateStr] || []).forEach((cls) => {
        eventsForDate.push({
          title: `Class ${formatTo12Hour(cls.startTime)} - ${formatTo12Hour(
            cls.endTime
          )}`,
          date: dateStr,
          classNames: ["class-time"],
        });
      });
    }

    return eventsForDate;
  };

  // Function to generate events for a specific date
  const generateEventsForDate = (dateStr) => {
    return generateEventsForDateWithData(dateStr, daysMap, batchDatesMap);
  };

  // Function to handle date range changes (when user navigates to different months/years)
  const handleDatesSet = (dateInfo) => {
    const { start, end } = dateInfo;
    const eventsList = [];

    const iter = new Date(start);
    while (iter < end) {
      const dateStr = iter.toISOString().split("T")[0];
      const eventsForDate = generateEventsForDate(dateStr);
      eventsList.push(...eventsForDate);
      iter.setDate(iter.getDate() + 1);
    }

    setEvents(eventsList);
  };
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };
  // Function to get details for selected date
  const getSelectedInfo = (dateStr) => {
    if (!dateStr) return null;

    const date = new Date(dateStr);
    const weekday = date.toLocaleString("en-US", { weekday: "long" });

    if (daysMap[weekday]) {
      return {
        duty: daysMap[weekday][0],
        classes: batchDatesMap[dateStr] || [],
      };
    }

    return null;
  };

  const selectedInfo = getSelectedInfo(selectedDate);
  return (
    <Modal
      show={openCalendar}
      onClose={() => setOpenCalender(false)}
      size="7xl"
    >
      <Modal.Header>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Coach Availability</h2>
          <button
            onClick={() => setOpenCalender(false)}
            className="text-red-500 text-xl font-bold"
          >
            &times;
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              height="auto"
            />
          </div>
          <div className="w-full lg:w-1/3 border-l pl-4">
            {selectedDate ? (
              <>
                <h3 className="text-lg font-semibold mb-2">
                  Details for {selectedDate}:
                </h3>
                {selectedInfo ? (
                  <>
                    <p>
                      <strong>Duty:</strong>{" "}
                      {formatTo12Hour(selectedInfo.duty.dutyStart)} -{" "}
                      {formatTo12Hour(selectedInfo.duty.dutyEnd)}
                    </p>
                    <p className="mt-2">
                      <strong className="text-red-500">Breaks:</strong>
                    </p>
                    <ul className="list-disc ml-5 text-red-500">
                      {selectedInfo.duty.breaks.map((b, idx) => (
                        <li key={idx}>
                          {formatTo12Hour(b.start_time)} -{" "}
                          {formatTo12Hour(b.end_time)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2">
                      <strong>Scheduled Classes:</strong>
                    </p>
                    {selectedInfo.classes.length > 0 ? (
                      <ul className="list-disc ml-5">
                        {selectedInfo.classes.map((cls, idx) => (
                          <li key={idx}>
                            {formatTo12Hour(cls.startTime)} -{" "}
                            {formatTo12Hour(cls.endTime)}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No classes scheduled.</p>
                    )}
                  </>
                ) : (
                  <p>No availability info.</p>
                )}
              </>
            ) : (
              <p>Select a date to view details.</p>
            )}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CoachCalendar;
