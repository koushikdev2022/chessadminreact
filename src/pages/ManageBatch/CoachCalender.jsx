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
  const [dailyDetails, setDailyDetails] = useState({});

  useEffect(() => {
    if (coachId) {
      dispatch(getCoachDetails({ coach_id: coachId }));
    }
  }, [coachId]);

  useEffect(() => {
    if (coachDetailsData?.results?.CoachTime) {
      const daysMap = {};
      const batchDatesMap = {};

      coachDetailsData.results.CoachTime.forEach((time) => {
        time.Day.forEach((day) => {
          const dayName = day.day;
          if (!daysMap[dayName]) daysMap[dayName] = [];
          daysMap[dayName].push({
            dutyStart: time.start_time,
            dutyEnd: time.end_time,
            breaks: time.CoachBreakTime,
          });
        });
      });

      coachDetailsData.results.Batch.forEach((batch) => {
        batch.BatchTime.forEach((bt) => {
          const date = bt.date;
          if (!batchDatesMap[date]) batchDatesMap[date] = [];
          batchDatesMap[date].push({
            startTime: bt.start_time,
            endTime: bt.end_time,
          });
        });
      });

      const detailMap = {};
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(today.getMonth() + 1);

      const iter = new Date(today);
      const eventsList = [];

      while (iter <= nextMonth) {
        const dateStr = iter.toISOString().split("T")[0];
        const weekday = iter.toLocaleString("en-US", { weekday: "long" });

        if (daysMap[weekday]) {
          detailMap[dateStr] = {
            duty: daysMap[weekday][0],
            classes: batchDatesMap[dateStr] || [],
          };

          eventsList.push({
            title: "Available",
            date: dateStr,
            display: "background",
            classNames: ["available-day"],
          });

          // Breaks
          daysMap[weekday][0].breaks.forEach((b, idx) => {
            eventsList.push({
              title: `Break ${formatTo12Hour(b.start_time)} - ${formatTo12Hour(
                b.end_time
              )}`,
              date: dateStr,
              classNames: ["break-time"],
            });
          });

          // Classes
          (batchDatesMap[dateStr] || []).forEach((cls) => {
            eventsList.push({
              title: `Class ${formatTo12Hour(cls.startTime)} - ${formatTo12Hour(
                cls.endTime
              )}`,
              date: dateStr,
              classNames: ["class-time"],
            });
          });
        }

        iter.setDate(iter.getDate() + 1);
      }

      setEvents(eventsList);
      setDailyDetails(detailMap);
    }
  }, [coachDetailsData]);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  const selectedInfo = dailyDetails[selectedDate];

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
