const DayWiseAvailabilityModal = () => {
  const daySchedule = selectedCoachForCalendar
    ? getDayScheduleDetails(selectedCoachForCalendar, selectedDate)
    : null;

  return (
    <Modal
      show={openAvailabilityModal}
      onClose={() => setOpenAvailabilityModal(false)}
      size="5xl"
    >
      <Modal.Header>
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Coach Availability Calendar</h2>
          {selectedCoachForCalendar && (
            <div className="text-sm text-gray-600 mt-1">
              Coach: {selectedCoachForCalendar.coachName}
            </div>
          )}
        </div>
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
                filterDate={filterDate}
              />
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-sm mt-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>Available Days</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded"></div>
                <span>Unavailable Days</span>
              </div>
            </div>
          </div>

          {/* Day-specific Schedule Section */}
          <div className="flex-1">
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Schedule for {daySchedule?.dayName} -{" "}
                {selectedDate.toLocaleDateString()}
              </h3>
            </div>

            {!daySchedule?.isAvailable ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-lg font-medium">Not Available</p>
                <p className="text-sm">
                  Coach is not scheduled to work on {daySchedule?.dayName}
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {daySchedule.sessions.map((session, sessionIndex) => (
                  <div
                    key={session.sessionId}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    {/* Session Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-blue-600 flex items-center">
                        <span className="bg-blue-100 px-2 py-1 rounded text-sm">
                          Session {session.sessionNumber}
                        </span>
                      </h4>
                      <span className="text-xs text-gray-500">
                        ID: {session.sessionId}
                      </span>
                    </div>

                    {/* Working Hours */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          🕒 Working Hours:
                        </span>
                      </div>
                      <div className="bg-green-50 px-3 py-2 rounded border-l-4 border-green-500">
                        <div className="font-semibold text-green-700">
                          {session.workingHours.start} -{" "}
                          {session.workingHours.end}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          Total working time available
                        </div>
                      </div>
                    </div>

                    {/* Break Times */}
                    {session.breakTimes.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            ☕ Break Times:
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            {session.breakTimes.length} break(s)
                          </span>
                        </div>
                        <div className="space-y-2">
                          {session.breakTimes.map((breakTime, breakIndex) => (
                            <div
                              key={breakTime.id}
                              className="bg-red-50 px-3 py-2 rounded border-l-4 border-red-500"
                            >
                              <div className="font-semibold text-red-700">
                                {breakTime.start} - {breakTime.end}
                              </div>
                              <div className="text-xs text-red-600 mt-1">
                                Break #{breakIndex + 1} - Not available for
                                booking
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Available Slots */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          ✅ Available Booking Slots:
                        </span>
                      </div>
                      <div className="space-y-2">
                        {availableSlots
                          .filter(
                            (slot) => slot.sessionId === session.sessionId
                          )
                          .map((slot, slotIndex) => (
                            <div
                              key={slotIndex}
                              className="bg-blue-50 px-3 py-2 rounded border-l-4 border-blue-500"
                            >
                              <div className="font-semibold text-blue-700">
                                {slot.startTime} - {slot.endTime}
                              </div>
                              <div className="text-xs text-blue-600 mt-1">
                                Available for booking
                              </div>
                            </div>
                          ))}
                        {availableSlots.filter(
                          (slot) => slot.sessionId === session.sessionId
                        ).length === 0 && (
                          <div className="text-center py-4 text-gray-500">
                            <span className="text-sm">
                              No available slots (all time is break time)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenAvailabilityModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default DayWiseAvailabilityModal;
