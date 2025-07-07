import { Datepicker, Label, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { FaCircleMinus } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getCounrtyForCoach,
  getDays,
  getRMForCoach,
} from "../../Reducer/CoachSlice";

import {
  addBatch,
  batchValidation,
  courseListForBatch,
  eligibleCoach,
} from "../../Reducer/BatchSlice";
import { toast, ToastContainer } from "react-toastify";

const AddBatch = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();

  const { coachCountryData, daysData, coachesDatak, rmData } = useSelector(
    (state) => state?.coach
  );

  const { courseData, coachesData, addBatchLoading } = useSelector(
    (state) => state.batch
  );

  const [formData, setFormData] = useState({
    batchName: "",
    courseId: "",
    rmId: "",
    coachId: "",
    countryId: "",
    batchType: "",
    duration: "",
    durationType: "",
    startDate: "",
    endDate: "",
    batchLimit: "",
  });

  const [eligibleCoaches, setEligibleCoaches] = useState([]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [isCoachDropdownEnabled, setIsCoachDropdownEnabled] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    dispatch(getRMForCoach());
    dispatch(getCounrtyForCoach());
    dispatch(getDays());
    dispatch(courseListForBatch());
  }, []);
  console.log("courseData", courseData);

  const [slots, setSlots] = useState([
    {
      day: "",
      startTime: "",
      startMeridian: "",
      endTime: "",
      endMeridian: "",
    },
  ]);

  const handleAddSlot = () => {
    setSlots([
      ...slots,
      {
        day: "",
        startTime: "",
        startMeridian: "",
        endTime: "",
        endMeridian: "",
      },
    ]);
  };

  const handleRemoveSlot = (index) => {
    const updatedSlots = [...slots];
    updatedSlots.splice(index, 1);
    setSlots(updatedSlots);
  };

  const handleChange = (index, field, value) => {
    const updatedSlots = [...slots];
    updatedSlots[index][field] = value;
    setSlots(updatedSlots);
    console.log("updatedSlots", updatedSlots);
  };

  const fetchEligibleCoaches = async (courseId, rmId) => {
    setIsCoachLoading(true);
    dispatch(
      eligibleCoach({ course_id: parseInt(courseId), rm_id: parseInt(rmId) })
    ).then((res) => {
      console.log("resCoach", res);
      if (res?.payload?.status_code === 200) {
        setEligibleCoaches(res?.payload?.data || []);
        setIsCoachDropdownEnabled(true);
        setIsCoachLoading(false);
        if (res?.payload?.data?.length <= 0) {
          setError("Coach not found");
        }
      } else {
        console.error("Failed to fetch eligible coaches");
        setEligibleCoaches([]);
        setIsCoachDropdownEnabled(false);
        setIsCoachLoading(false);
        setError("Coach not found");
      }
    });
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      if (field === "courseId" || field === "rmId") {
        updated.coachId = "";
        setIsCoachDropdownEnabled(false);
        setEligibleCoaches([]);
      }

      return updated;
    });
  };

  const handleStartDateChange = (date) => {
    console.log("hello");

    console.log("Selected Start Date:", date);
    setStartDate(date); // Store the Date object for the Datepicker

    // Format the date for the API (assuming your API expects YYYY-MM-DD format)
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    console.log("Formatted Start Date:", formattedDate);

    setFormData((prev) => ({ ...prev, startDate: formattedDate }));
  };

  const handleEndDateChange = (date) => {
    console.log("Selected End Date:", date);
    setEndDate(date); // Store the Date object for the Datepicker

    // Format the date for the API (assuming your API expects YYYY-MM-DD format)
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    console.log("Formatted End Date:", formattedDate);

    setFormData((prev) => ({ ...prev, endDate: formattedDate }));
  };
  useEffect(() => {
    if (formData.courseId && formData.rmId) {
      fetchEligibleCoaches(formData.courseId, formData.rmId);
    }
  }, [formData.courseId, formData.rmId]);

  const handleCreateBatch = () => {
    const payload = {
      coach_id: parseInt(formData.coachId) || 1,
      course_id: parseInt(formData.courseId),
      start_date: formData.startDate,
      end_date: formData.endDate,
      class_schedule: slots.map((slot) => ({
        day_id: parseInt(slot.day),
        start_time: slot.startTime,
        start_time_am: parseInt(slot.startMeridian),
        end_time: slot.endTime,
        end_time_am: parseInt(slot.endMeridian),
      })),
    };

    dispatch(batchValidation(payload)).then((res) => {
      console.log("Res:", res);
      // Optionally navigate or show success message
      if (res?.payload?.status_code === 200) {
        const addBatchPayload = {
          course_id: parseInt(formData.courseId) || null,
          country_id: parseInt(formData.countryId) || null,
          batch_type: parseInt(formData.batchType) || null,
          duration_day: parseInt(formData.duration) || null,
          interval: parseInt(formData.durationType) || null,
          rm_id: parseInt(formData.rmId) || null,
          no_student: parseInt(formData.batchLimit) || null,
          coach_id: parseInt(formData.coachId) || null,
          start_date: formData.startDate || "",
          end_date: formData.endDate || "",
          class: slots.map((slot) => ({
            day: parseInt(slot.day) || null,
            start_time: slot.startTime || "",
            start_time_am: parseInt(slot.startMeridian),
            end_time: slot.endTime || "",
            end_time_am: parseInt(slot.endMeridian),
          })),
        };
        dispatch(addBatch(addBatchPayload)).then((res) => {
          console.log("res", res);
          if (res?.payload?.status_code === 201) {
            nevigate("/manage-batch");
          } else {
            toast.error("something went wrong");
          }
        });
      } else if (res?.payload?.response?.data?.status_code === 422) {
        const errorMessages = res?.payload?.response?.data?.message;
        toast.error(errorMessages, { autoClose: false });
      }
    });
  };

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 field_area">
        <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create New batch</h2>
          </div>
          <div className="space-y-4 popup_section">
            <div className="flex gap-4">
              {/* <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch name" />
                </div>
                <TextInput
                  type="text"
                  placeholder="Enter batch name"
                  value={formData.batchName}
                  onChange={(e) =>
                    handleFormChange("batchName", e.target.value)
                  }
                  required
                />
              </div> */}
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Course Name" />
                </div>
                <Select
                  value={formData.courseId}
                  onChange={(e) => handleFormChange("courseId", e.target.value)}
                >
                  <option>Select Course Name</option>
                  {courseData?.data?.map((courseName) => {
                    return (
                      <>
                        <option key={courseName?.id} value={courseName?.id}>
                          {courseName?.title}
                        </option>
                      </>
                    );
                  })}
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Relationship Manager" />
                </div>
                <Select
                  value={formData.rmId}
                  onChange={(e) => handleFormChange("rmId", e.target.value)}
                >
                  <option>Select relationship manager</option>
                  {rmData?.results?.map((rm) => {
                    return (
                      <>
                        <option key={rm?.id} value={rm?.id}>
                          {rm?.f_name} {rm?.l_name}
                        </option>
                      </>
                    );
                  })}
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <Select
                  disabled={!isCoachDropdownEnabled}
                  value={formData.coachId}
                  onChange={(e) => handleFormChange("coachId", e.target.value)}
                  className={
                    !isCoachDropdownEnabled ? "cursor-not-allowed" : ""
                  }
                >
                  <option value="">
                    {isCoachLoading
                      ? "Loading coaches..."
                      : !isCoachDropdownEnabled
                      ? "Select Course & RM first"
                      : "Choose coach"}
                  </option>
                  {eligibleCoaches.map((coach) => (
                    <option key={coach?.id} value={coach?.id}>
                      {coach?.name || `${coach?.f_name} ${coach?.l_name}`}
                    </option>
                  ))}
                </Select>
                {console.log("error", error)}
                {error && <p className="text-red-600">{error}</p>}
              </div>
            </div>
            <div className="flex gap-4">
              {/* <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Coach" />
                </div>
                <Select
                  disabled={!isCoachDropdownEnabled}
                  value={formData.coachId}
                  onChange={(e) => handleFormChange("coachId", e.target.value)}
                  className={
                    !isCoachDropdownEnabled ? "cursor-not-allowed" : ""
                  }
                >
                  <option value="">
                    {isCoachLoading
                      ? "Loading coaches..."
                      : !isCoachDropdownEnabled
                      ? "Select Course & RM first"
                      : "Choose coach"}
                  </option>
                  {eligibleCoaches.map((coach) => (
                    <option key={coach?.id} value={coach?.id}>
                      {coach?.name || `${coach?.f_name} ${coach?.l_name}`}
                    </option>
                  ))}
                </Select>
                {console.log("error", error)}
                {error && <p className="text-red-600">{error}</p>}
              </div> */}
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Country" />
                </div>
                <Select
                  required
                  value={formData.countryId}
                  onChange={(e) =>
                    handleFormChange("countryId", e.target.value)
                  }
                >
                  <option>Select Country</option>
                  {coachCountryData?.results?.map((country) => {
                    return (
                      <>
                        <option key={country?.id} value={country?.id}>
                          {country?.country_name}
                        </option>
                      </>
                    );
                  })}
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Type" />
                </div>
                <Select
                  value={formData.batchType}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "1") {
                      handleFormChange("batchType", value);
                      handleFormChange("batchLimit", 1);
                    } else {
                      handleFormChange("batchType", value);
                      handleFormChange("batchLimit", ""); // clear or retain previous if needed
                    }
                  }}
                  required
                >
                  <option value="">Select Batch Type</option>
                  <option value={1}>Individual</option>
                  <option value={2}>Grouped</option>
                </Select>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Duration" />
                </div>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Course Duration"
                      className="w-full border rounded px-4 py-2"
                      value={formData.duration}
                      onChange={(e) =>
                        handleFormChange("duration", e.target.value)
                      }
                      required
                    />

                    <select
                      value={formData.durationType}
                      onChange={(e) =>
                        handleFormChange("durationType", e.target.value)
                      }
                      className="w-1/2 border rounded px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option value={0}>Week(s)</option>
                      <option value={1}>Month(s)</option>
                      <option value={2}>Year(s)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              {/* <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Duration" />
                </div>
                <div className="mb-4">
                  <div className="flex gap-2">
                   
                    <input
                      type="text"
                      placeholder="Enter Course Duration"
                      className="w-full border rounded px-4 py-2"
                      value={formData.duration}
                      onChange={(e) =>
                        handleFormChange("duration", e.target.value)
                      }
                      required
                    />

               
                    <select
                      value={formData.durationType}
                      onChange={(e) =>
                        handleFormChange("durationType", e.target.value)
                      }
                      className="w-1/2 border rounded px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option value={0}>Week(s)</option>
                      <option value={1}>Month(s)</option>
                      <option value={2}>Year(s)</option>
                    </select>
                  </div>
                </div>
              </div> */}
              <div className="w-4/12 flex gap-4">
                <div>
                  <div className="mb-1 block">
                    <Label value="Start Date" />
                  </div>
                  <Datepicker
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div>
                  <div className="mb-1 block">
                    <Label value="End Date" />
                  </div>
                  <Datepicker value={endDate} onChange={handleEndDateChange} />
                </div>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <TextInput
                  type="number"
                  placeholder="Enter batch limit"
                  required
                  value={formData.batchLimit}
                  onChange={(e) =>
                    handleFormChange("batchLimit", e.target.value)
                  }
                  disabled={formData.batchType === "1"}
                />
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Batch Timings</h2>
            </div>
            {slots.map((slot, index) => {
              return (
                <>
                  <div className="flex gap-8" key={index}>
                    <div className="flex gap-4 w-6/12">
                      <div className="w-4/12">
                        <div className="mb-1 block">
                          <Label value="Day" />
                        </div>
                        <Select
                          required
                          value={slot.day}
                          onChange={(e) =>
                            handleChange(index, "day", e.target.value)
                          }
                        >
                          <option>Select Day</option>
                          {daysData?.results?.map((days) => (
                            <option key={days?.id} value={days?.id}>
                              {days?.day}
                            </option>
                          ))}
                        </Select>
                      </div>
                      <div className="w-8/12">
                        <div className="mb-1 block">
                          <Label value="Start Time" />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8/12">
                            <TextInput
                              type="time"
                              placeholder="Enter Start Time"
                              required
                              value={slot.startTime}
                              onChange={(e) =>
                                handleChange(index, "startTime", e.target.value)
                              }
                            />
                          </div>
                          <div className="w-4/12">
                            <Select
                              required
                              value={slot.startMeridian}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "startMeridian",
                                  e.target.value
                                )
                              }
                            >
                              <option>Select</option>
                              <option value={1}>AM</option>
                              <option value={0}>PM</option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 w-4/12">
                      <div className="w-full">
                        <div className="mb-1 block">
                          <Label value="End Time" />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-8/12">
                            <TextInput
                              type="time"
                              placeholder="Enter End Time"
                              required
                              value={slot.endTime}
                              onChange={(e) =>
                                handleChange(index, "endTime", e.target.value)
                              }
                            />
                          </div>
                          <div className="w-4/12">
                            <Select
                              required
                              value={slot.endMeridian}
                              onChange={(e) =>
                                handleChange(
                                  index,
                                  "endMeridian",
                                  e.target.value
                                )
                              }
                            >
                              <option>Select</option>
                              <option value={1}>AM</option>
                              <option value={0}>PM</option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-2/12 flex gap-2 pt-6">
                      <button type="button" onClick={handleAddSlot}>
                        <BsFillPlusCircleFill className="text-[#009d42] hover:text-black text-2xl" />
                      </button>
                      {slots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSlot(index)}
                        >
                          <FaCircleMinus className="text-[#ca0000] hover:text-black text-2xl" />
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleCreateBatch}
              className="bg-[#52b69a] hover:bg-black px-6 py-2 text-white text-sm font-medium flex justify-center items-center rounded-md"
            >
              {addBatchLoading ? "waiting..." : "Create Batch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
