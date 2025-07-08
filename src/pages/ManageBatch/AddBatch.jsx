import {
  Datepicker,
  FileInput,
  Label,
  Select,
  TextInput,
} from "flowbite-react";
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
  getDaysCoach,
  uploadBannerImage,
} from "../../Reducer/BatchSlice";
import { toast, ToastContainer } from "react-toastify";
import CoachCalender from "./CoachCalender";

const AddBatch = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();

  const { coachCountryData, coachesDatak, rmData } = useSelector(
    (state) => state?.coach
  );

  const {
    courseData,
    coachesData,
    addBatchLoading,
    coachDetailsData,
    daysData,
  } = useSelector((state) => state.batch);
  const [isCoachSelected, setIsCoachSelected] = useState(false);
  const [openCalendar, setOpenCalender] = useState(false);
  const [coachId, setCoachId] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

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
  const handleOpenCalender = () => {
    setOpenCalender(true);
    setCoachId(formData.coachId);
  };

  const [eligibleCoaches, setEligibleCoaches] = useState([]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [isCoachDropdownEnabled, setIsCoachDropdownEnabled] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [error, setError] = useState();
  const [errors, setErrors] = useState({});

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
        if (res?.payload?.data?.length > 0) {
          setError("");
        }
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

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));

      if (field === "courseId" || field === "rmId") {
        updated.coachId = "";
        setIsCoachDropdownEnabled(false);
        setEligibleCoaches([]);
      }
      if (field === "coachId") {
        setIsCoachSelected(!!value); // true if coachId is selected
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
    setErrors((prev) => ({ ...prev, startDate: null }));
  };

  const handleEndDateChange = (date) => {
    console.log("Selected End Date:", date);
    setEndDate(date); // Store the Date object for the Datepicker

    // Format the date for the API (assuming your API expects YYYY-MM-DD format)
    const formattedDate = date ? date.toISOString().split("T")[0] : "";
    console.log("Formatted End Date:", formattedDate);

    setFormData((prev) => ({ ...prev, endDate: formattedDate }));
    setErrors((prev) => ({ ...prev, endDate: null }));
  };
  useEffect(() => {
    if (formData.courseId && formData.rmId) {
      fetchEligibleCoaches(formData.courseId, formData.rmId);
    }
  }, [formData.courseId, formData.rmId]);

  useEffect(() => {
    if (formData.coachId) {
      dispatch(getDaysCoach({ coach_id: formData.coachId }));
    }
  }, [dispatch, formData.coachId]);
  console.log("day_data", daysData);
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  const handleCreateBatch = () => {
    console.log("Hello");

    const newErrors = {};
    const finalStartDate = formData.startDate || getTodayDate();

    if (!formData.courseId) newErrors.courseId = "Course name is required";
    if (!formData.rmId) newErrors.rmId = "Relationship Manager is required";
    if (!formData.coachId) newErrors.coachId = "Coach is required";
    if (!formData.countryId) newErrors.countryId = "Country is required";
    if (!formData.batchType) newErrors.batchType = "Batch type is required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.durationType && formData.durationType !== "0")
      newErrors.durationType = "Duration type is required";
    // if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (formData.batchType !== "1" && !formData.batchLimit)
      newErrors.batchLimit = "Batch limit is required";

    // Check at least one valid class slot
    const hasInvalidSlot = slots.some((slot) => {
      return (
        !slot.day ||
        !slot.startTime ||
        !slot.endTime ||
        slot.startMeridian === "" ||
        slot.endMeridian === ""
      );
    });
    if (hasInvalidSlot)
      newErrors.classSchedule = "All class schedule fields are required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // if validation passes, clear errors and proceed
    setErrors({});
    console.log("hi");

    const payload = {
      coach_id: parseInt(formData.coachId) || 1,
      course_id: parseInt(formData.courseId),
      start_date: finalStartDate,
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
        console.log(
          "parseInt(formData.durationType)",
          parseInt(formData.durationType)
        );

        const addBatchPayload = {
          course_id: parseInt(formData.courseId) || null,
          country_id: parseInt(formData.countryId) || null,
          batch_type: parseInt(formData.batchType) || null,
          duration_day: parseInt(formData.duration) || null,
          interval: parseInt(formData.durationType),
          rm_id: parseInt(formData.rmId) || null,
          no_student: parseInt(formData.batchLimit) || null,
          coach_id: parseInt(formData.coachId) || null,
          start_date: finalStartDate,
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
            if (bannerFile) {
              const formData = new FormData();
              formData.append("batch_id", res?.payload?.id);
              formData.append("image", bannerFile);
              dispatch(uploadBannerImage(formData));
            }
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

  const getDayAvailability = (dayId) => {
    if (!daysData?.data || !dayId) return null;
    return daysData.data.find((day) => day.day_id === parseInt(dayId));
  };
  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 field_area">
        <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Create New batch</h2>
            {isCoachSelected && (
              <button
                className="bg-[#52b69a] hover:bg-black px-6 py-2 text-white text-sm font-medium flex justify-center items-center rounded-md"
                onClick={() =>
                  // console.log("Selected Coach ID:", formData.coachId)
                  handleOpenCalender()
                }
              >
                Check Coach Availability
              </button>
            )}
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
                {errors.courseId && (
                  <p className="text-red-500 text-sm">{errors.courseId}</p>
                )}
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
                {errors.rmId && (
                  <p className="text-red-500 text-sm">{errors.rmId}</p>
                )}
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
                {errors.coachId && (
                  <p className="text-red-500 text-sm">{errors.coachId}</p>
                )}
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
                {errors.countryId && (
                  <p className="text-red-500 text-sm">{errors.countryId}</p>
                )}
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
                {errors.batchType && (
                  <p className="text-red-500 text-sm">{errors.batchType}</p>
                )}
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
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm">{errors.duration}</p>
                    )}

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
                    {errors.durationType && (
                      <p className="text-red-500 text-sm">
                        {errors.durationType}
                      </p>
                    )}
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
                  {errors.startDate && (
                    <p className="text-red-500 text-sm">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <div className="mb-1 block">
                    <Label value="End Date" />
                  </div>
                  <Datepicker value={endDate} onChange={handleEndDateChange} />
                  {errors.endDate && (
                    <p className="text-red-500 text-sm">{errors.endDate}</p>
                  )}
                </div>
              </div>
              <div className="w-4/12">
                <div className="mb-1 block">
                  <Label value="Batch Limit" />
                </div>
                <TextInput
                  type="number"
                  placeholder="Enter batch limit"
                  value={formData.batchLimit}
                  onChange={(e) =>
                    handleFormChange("batchLimit", e.target.value)
                  }
                  disabled={formData.batchType === "1"}
                />
                {errors.batchLimit && (
                  <p className="text-red-500 text-sm">{errors.batchLimit}</p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Batch Timings</h2>
            </div>
            {slots.map((slot, index) => {
              const selectedDayData = getDayAvailability(slot.day);
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
                          {daysData?.data?.map((days) => (
                            <option key={days?.day_id} value={days?.day_id}>
                              {days?.day_name}
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
                              className="no-time-picker"
                              type="time"
                              placeholder="Enter Start Time"
                              // type="text"
                              // placeholder="Enter Start Time (hh:mm AM/PM)"
                              value={slot.startTime}
                              onChange={(e) =>
                                handleChange(index, "startTime", e.target.value)
                              }
                              // onBlur={(e) => handleBlur(e.target.value)}
                              // maxLength={8}
                            />
                          </div>
                          <div className="w-4/12">
                            <Select
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
                  {selectedDayData && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Coach Availability for {selectedDayData.day_name}:
                      </h4>
                      <div className="mb-3">
                        <span className="font-medium text-green-600">
                          Available Time:{" "}
                        </span>
                        <span className="text-gray-600">
                          {selectedDayData.available_time?.start_time} -{" "}
                          {selectedDayData.available_time?.end_time}
                        </span>
                      </div>
                      {selectedDayData.breaks &&
                        selectedDayData.breaks.length > 0 && (
                          <div>
                            <span className="font-medium text-orange-600">
                              Break Times:{" "}
                            </span>
                            <div className="text-gray-600">
                              {selectedDayData.breaks.map(
                                (breakTime, breakIndex) => (
                                  <span
                                    key={breakIndex}
                                    className="inline-block mr-4"
                                  >
                                    {breakTime.start_time} -{" "}
                                    {breakTime.end_time}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </>
              );
            })}
            {errors.classSchedule && (
              <p className="text-red-500 text-sm mt-1">
                {errors.classSchedule}
              </p>
            )}
            <div className="mb-1 mt-10 block">
              <Label value="Upload Banner Image" />
            </div>
            <div className="w-8/12">
              <FileInput
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setBannerFile(file);
                    setBannerPreview(URL.createObjectURL(file));
                  }
                }}
              />
              {bannerPreview && (
                <img
                  src={bannerPreview}
                  alt="Preview"
                  className="mt-4 w-64 h-40 object-cover rounded border"
                />
              )}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleCreateBatch}
              className="bg-[#52b69a] hover:bg-black px-6 py-2 text-white text-sm font-medium flex justify-center items-center rounded-md"
            >
              {addBatchLoading ? "waiting..." : "Create Batch"}
            </button>
          </div>
          {openCalendar && (
            <CoachCalender
              openCalendar={openCalendar}
              setOpenCalender={setOpenCalender}
              coachId={coachId}
              setCoachId={setCoachId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AddBatch;
