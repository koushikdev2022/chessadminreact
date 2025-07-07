import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegImage } from "react-icons/fa";
import Select from "react-select";
import { Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
    addCourseStep1,
    addCourseStep2,
    courseLevelDropdown,
    courseTagsDropdown,
    searchLession,
    searchModule,
} from "../../Reducer/CourseSlice";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";


const AddCourseStep2 = ({ onBack, levelId, course_id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, addCourseStep2loading, searchModulesData, searchLessionData } = useSelector((state) => state?.courses);

    // Fetch all modules for the level on mount or when levelId changes
    useEffect(() => {
        if (levelId) {
            dispatch(searchModule({ course_level_id: levelId, module_search: "" }));
        }
    }, [dispatch, levelId]);

    // Store multiple module forms, each with multiple lessons
    const [moduleForms, setModuleForms] = useState([
        {
            moduleSearchTerm: '',
            moduleId: '',
            selectedModule: null,
            moduleOptions: [],
            module_duration_n: '',
            module_duration: '',
            lessons: [
                {
                    lessionSearchTerm: '',
                    lessionId: '',
                    selectedLession: null,
                    lessionOptions: [],
                    files: [],
                },
            ],
        },
    ]);

    // Error state for each module form
    const [formErrors, setFormErrors] = useState([]);

    // Helper to update a module by index
    const updateModuleForm = (idx, changes) => {
        setModuleForms((prev) => prev.map((f, i) => (i === idx ? { ...f, ...changes } : f)));
    };
    // Helper to update a lesson by module and lesson index
    const updateLesson = (modIdx, lessonIdx, changes) => {
        setModuleForms((prev) =>
            prev.map((mod, i) =>
                i === modIdx
                    ? {
                        ...mod,
                        lessons: mod.lessons.map((les, j) => (j === lessonIdx ? { ...les, ...changes } : les)),
                    }
                    : mod
            )
        );
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    // Dropdown search handlers
    const handleModuleSearch = (idx, searchTerm) => {
        if (!searchTerm) {
            // Use all modules from Redux for default dropdown
            const options = (searchModulesData?.res || []).map((mod) => ({ value: mod.id, label: mod.topic_name }));
            updateModuleForm(idx, { moduleOptions: options });
            return;
        }
        dispatch(searchModule({ course_level_id: levelId, module_search: searchTerm })).then((res) => {
            const options = res?.payload?.res?.map((mod) => ({ value: mod.id, label: mod.topic_name })) || [];
            updateModuleForm(idx, { moduleOptions: options });
        });
    };
    const handleLessionSearch = (modIdx, moduleId, searchTerm) => {
        if (!searchTerm || !moduleId) {
            // Use all lessons from Redux for default dropdown
            const options = (searchLessionData?.res || []).map((les) => ({ value: les.id, label: les.module_name }));
            updateLesson(modIdx, 0, { lessionOptions: options });
            return;
        }
        dispatch(searchLession({ module_id: moduleId, lession_search: searchTerm })).then((res) => {
            const options = res?.payload?.res?.map((les) => ({ value: les.id, label: les.module_name })) || [];
            updateLesson(modIdx, 0, { lessionOptions: options });
        });
    };

    // When a module is selected, fetch all lessons for that module
    const handleModuleChange = (modIdx, option) => {
        updateModuleForm(modIdx, {
            selectedModule: option,
            moduleId: option ? option.value : '',
        });
        if (option && option.value) {
            dispatch(searchLession({ module_id: option.value, lession_search: "" }));
        }
    };

    // Add new module form
    const handleAddModuleForm = () => {
        setModuleForms((prev) => [
            ...prev,
            {
                moduleSearchTerm: '',
                moduleId: '',
                selectedModule: null,
                moduleOptions: [],
                module_duration_n: '',
                module_duration: '',
                lessons: [
                    {
                        lessionSearchTerm: '',
                        lessionId: '',
                        selectedLession: null,
                        lessionOptions: [],
                        files: [],
                    },
                ],
            },
        ]);
    };
    // Remove module
    const handleRemoveModule = (idx) => {
        setModuleForms((prev) => prev.filter((_, i) => i !== idx));
    };
    // Add lesson to a module
    const handleAddLesson = (modIdx) => {
        setModuleForms((prev) =>
            prev.map((mod, i) =>
                i === modIdx
                    ? {
                        ...mod,
                        lessons: [
                            ...mod.lessons,
                            {
                                lessionSearchTerm: '',
                                lessionId: '',
                                selectedLession: null,
                                lessionOptions: [],
                                files: [],
                            },
                        ],
                    }
                    : mod
            )
        );
    };
    // Remove lesson from a module
    const handleRemoveLesson = (modIdx, lessonIdx) => {
        setModuleForms((prev) =>
            prev.map((mod, i) =>
                i === modIdx
                    ? {
                        ...mod,
                        lessons: mod.lessons.filter((_, j) => j !== lessonIdx),
                    }
                    : mod
            )
        );
    };
    // File handlers per lesson
    const handleFileChange = (modIdx, lessonIdx, e) => {
        const files = Array.from(e.target.files).filter((f) => f.type === 'application/pdf');
        updateLesson(modIdx, lessonIdx, { files });
    };
    const removeFile = (modIdx, lessonIdx, fileIdx) => {
        setModuleForms((prev) =>
            prev.map((mod, i) =>
                i === modIdx
                    ? {
                        ...mod,
                        lessons: mod.lessons.map((les, j) =>
                            j === lessonIdx
                                ? { ...les, files: (les.files || []).filter((_, k) => k !== fileIdx) }
                                : les
                        ),
                    }
                    : mod
            )
        );
    };

    // 1. Real-time error clearing helpers
    const clearModuleError = (modIdx, field) => {
        setFormErrors((prev) => prev.map((err, i) =>
            i === modIdx ? { ...err, [field]: undefined } : err
        ));
    };
    const clearLessonError = (modIdx, lessonIdx, field) => {
        setFormErrors((prev) => prev.map((err, i) =>
            i === modIdx
                ? { ...err, lessons: err.lessons.map((lerr, j) => j === lessonIdx ? { ...lerr, [field]: undefined } : lerr) }
                : err
        ));
    };

    const onSubmit = (data) => {
        // Validate all fields for each module form
        const errors = moduleForms.map((form) => {
            const err = {};
            if (!form.selectedModule) err.module = 'Module is required';
            if (!form.module_duration_n) err.durationInput = 'Module duration is required';
            if (!form.module_duration || form.module_duration === '') err.durationSelect = 'Please select duration type';
            err.lessons = form.lessons.map((lesson) => {
                const lerr = {};
                if (!lesson.selectedLession) lerr.lession = 'Lession is required';
                if (!lesson.files || lesson.files.length === 0) lerr.files = 'At least one PDF file is required';
                return lerr;
            });
            return err;
        });
        setFormErrors(errors);
        if (errors.some(e => Object.keys(e).length > 1 || (e.lessons && e.lessons.some(l => Object.keys(l).length > 0)))) return;

        const formData = new FormData();
        formData.append('course_id', course_id);
        moduleForms.forEach((mod, modIdx) => {
            formData.append(`module_id[${modIdx}]`, mod.selectedModule.value);
            formData.append(`module_duration[${modIdx}]`, `${mod.module_duration_n} ${mod.module_duration}`.trim());
            mod.lessons.forEach((lesson, lessonIdx) => {
                formData.append(`lession_id[${modIdx}][${lessonIdx}]`, lesson.selectedLession.value);
                (lesson.files || []).forEach((file) => {
                    formData.append(`homework[${modIdx}][${lessonIdx}]`, file);
                });
            });
        });
        dispatch(addCourseStep2(formData))
            .then((res) => {
                if (res?.payload?.status_code === 200) {
                    toast.success(res?.payload?.message);
                    setTimeout(() => {
                        navigate('/manage-courses')
                    }, 1000)
                } else {
                    toast.error(res?.payload?.response?.data?.message);
                }
            });
    };

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-full mx-auto p-6 bg-white shadow rounded-xl">
                    <div className="flex justify-between items-center">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold">Create New Course</h2>
                        </div>
                        <button type="button" className="border border-[#52b69a] text-[#52b69a] w-[15rem] px-3 py-1 font-medium rounded hover:bg-gray-100 mb-6" onClick={handleAddModuleForm}>
                            + Add Module
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {moduleForms.map((form, modIdx) => (
                            <div key={modIdx} className="mb-8 border rounded-lg p-4 relative flex flex-col">
                                {/* Remove Module Button at bottom right */}
                                {modIdx > 0 && (
                                    <div className="flex justify-end mt-2">
                                        <button type="button"
                                            className="border border-red-500 text-red-500 px-4 py-1 rounded hover:bg-gray-100 transition font-medium"
                                            onClick={() => handleRemoveModule(modIdx)}
                                        >
                                            Remove Module
                                        </button>
                                    </div>
                                )}
                                <label className="block text-sm font-medium mb-1">Module Name</label>
                                <div className="flex justify-between gap-3 mb-4">
                                    <div className="w-full">
                                        <Select
                                            isClearable
                                            placeholder="Search module..."
                                            value={form.selectedModule}
                                            onMenuOpen={() => {
                                                // Reset search and show all modules
                                                updateModuleForm(modIdx, { moduleOptions: (searchModulesData?.res || []).map((mod) => ({ value: mod.id, label: mod.topic_name })), moduleSearchTerm: '' });
                                                clearModuleError(modIdx, 'module');
                                            }}
                                            onInputChange={(inputValue, { action }) => {
                                                if (action === 'input-change') {
                                                    updateModuleForm(modIdx, { moduleSearchTerm: inputValue });
                                                    clearModuleError(modIdx, 'module');
                                                    if (inputValue) {
                                                        handleModuleSearch(modIdx, inputValue);
                                                    } else {
                                                        updateModuleForm(modIdx, { moduleOptions: (searchModulesData?.res || []).map((mod) => ({ value: mod.id, label: mod.topic_name })), selectedModule: null, moduleId: '', });
                                                    }
                                                }
                                            }}
                                            onChange={(option) => {
                                                handleModuleChange(modIdx, option);
                                                clearModuleError(modIdx, 'module');
                                            }}
                                            options={form.moduleOptions.length ? form.moduleOptions : (searchModulesData?.res || []).map((mod) => ({ value: mod.id, label: mod.topic_name }))}
                                            isLoading={loading}
                                            noOptionsMessage={() => form.moduleSearchTerm ? 'No modules found' : 'Type to search'}
                                            styles={{ menu: (base) => ({ ...base, maxHeight: 180, overflowY: 'auto' }), menuList: (base) => ({ ...base, maxHeight: 180, overflowY: 'auto' }) }}
                                        />
                                        {formErrors[modIdx]?.module && <p className="text-red-500 text-sm mt-1">{formErrors[modIdx].module}</p>}
                                    </div>
                                </div>
                                {form.lessons.map((lesson, lessonIdx) => (
                                    <div key={lessonIdx} className="mb-4 border-b pb-4 relative flex flex-col">
                                        {/* Remove Lesson Button at bottom right */}
                                        {lessonIdx > 0 && (
                                            <div className="flex justify-end mt-2">
                                                <button type="button"
                                                    className="border border-red-500 text-red-500 px-4 py-1 rounded hover:bg-gray-100 transition font-medium"
                                                    onClick={() => handleRemoveLesson(modIdx, lessonIdx)}
                                                >
                                                    Remove Lesson
                                                </button>
                                            </div>
                                        )}
                                        <label className="block text-sm font-medium mb-1">Lession 1-1</label>
                                        <Select
                                            isClearable
                                            placeholder={form.moduleId ? 'Search lession...' : 'Select a module first'}
                                            value={lesson.selectedLession}
                                            onMenuOpen={() => {
                                                // Reset search and show all lessons
                                                updateLesson(modIdx, lessonIdx, { lessionOptions: (searchLessionData?.res || []).map((les) => ({ value: les.id, label: les.module_name })), lessionSearchTerm: '' });
                                                clearLessonError(modIdx, lessonIdx, 'lession');
                                            }}
                                            onInputChange={(inputValue, { action }) => {
                                                if (action === 'input-change') {
                                                    updateLesson(modIdx, lessonIdx, { lessionSearchTerm: inputValue });
                                                    clearLessonError(modIdx, lessonIdx, 'lession');
                                                    if (inputValue && form.moduleId) {
                                                        handleLessionSearch(modIdx, form.moduleId, inputValue);
                                                    } else {
                                                        updateLesson(modIdx, lessonIdx, { lessionOptions: (searchLessionData?.res || []).map((les) => ({ value: les.id, label: les.module_name })), selectedLession: null });
                                                    }
                                                }
                                            }}
                                            onChange={(option) => {
                                                updateLesson(modIdx, lessonIdx, { selectedLession: option, lessionId: option ? option.value : '' });
                                                clearLessonError(modIdx, lessonIdx, 'lession');
                                            }}
                                            options={lesson.lessionOptions.length ? lesson.lessionOptions : (searchLessionData?.res || []).map((les) => ({ value: les.id, label: les.module_name }))}
                                            isDisabled={!form.moduleId}
                                            isLoading={loading && !!form.moduleId}
                                            noOptionsMessage={() => lesson.lessionSearchTerm ? 'No lessions found' : (form.moduleId ? 'Type to search' : 'Select a module first')}
                                            styles={{ menu: (base) => ({ ...base, maxHeight: 180, overflowY: 'auto' }), menuList: (base) => ({ ...base, maxHeight: 180, overflowY: 'auto' }) }}
                                        />
                                        {formErrors[modIdx]?.lessons?.[lessonIdx]?.lession && <p className="text-red-500 text-sm mt-1">{formErrors[modIdx].lessons[lessonIdx].lession}</p>}
                                        <label className="block text-sm font-medium mb-2 mt-2">Homework File</label>
                                        <div className="flex flex-col md:flex-row gap-4 mb-1">
                                            <label className="w-full md:w-1/2 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-blue-50 cursor-pointer hover:border-blue-400">
                                                <input type="file" className="hidden" accept="application/pdf" multiple onChange={(e) => { handleFileChange(modIdx, lessonIdx, e); clearLessonError(modIdx, lessonIdx, 'files'); }} />
                                                <FaRegImage size={36} className="text-[#52b69a] mb-2" />
                                                <span className="text-sm text-gray-600">
                                                    Drag and Drop PDF files or <span className="text-[#52b69a] font-medium">Browse</span><br />
                                                    <span className="text-xs text-gray-400">PDF only (max 30 MB each)</span>
                                                </span>
                                            </label>
                                            {lesson.files && lesson.files.length > 0 && (
                                                <div className="relative flex-1 border rounded-lg p-4">
                                                    {lesson.files.map((file, fileIdx) => (
                                                        <div key={fileIdx} className="mb-4">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div>
                                                                    <p className="font-medium text-sm">{file.name}</p>
                                                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                                                                </div>
                                                                <button onClick={() => removeFile(modIdx, lessonIdx, fileIdx)} className="text-gray-500 hover:text-red-600 text-lg mb-3" type="button">
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <div className="w-full bg-gray-200 h-2 rounded">
                                                                <div className="h-2 bg-blue-800 rounded" style={{ width: `100%` }}></div>
                                                            </div>
                                                            <p className="text-right text-xs text-gray-600 mt-1">100%</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="text-[#52b69a] text-sm mt-2 hover:underline text-left"
                                            onClick={() => handleAddLesson(modIdx)}
                                        >
                                            + Add More
                                        </button>
                                        {formErrors[modIdx]?.lessons?.[lessonIdx]?.files && <p className="text-red-500 text-sm mt-1">{formErrors[modIdx].lessons[lessonIdx].files}</p>}
                                    </div>
                                ))}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Module Duration</label>
                                    <div className="flex justify-start items-center gap-4 mb-4">
                                        <div className="flex flex-col ">
                                            <input
                                                type="number"
                                                placeholder="Enter module duration"
                                                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={form.module_duration_n}
                                                onChange={e => {
                                                    updateModuleForm(modIdx, { module_duration_n: e.target.value });
                                                    clearModuleError(modIdx, 'durationInput');
                                                }}
                                            />
                                            <div className="min-h-[24px]">
                                                {formErrors[modIdx]?.durationInput && <p className="text-red-500 text-sm mt-1">{formErrors[modIdx].durationInput}</p>}
                                            </div>
                                        </div>
                                        <div className="flex flex-col w-[200px]">
                                            <select
                                                className="w-full border rounded px-4 py-2"
                                                value={form.module_duration}
                                                onChange={e => {
                                                    updateModuleForm(modIdx, { module_duration: e.target.value });
                                                    clearModuleError(modIdx, 'durationSelect');
                                                }}
                                            >
                                                <option value="">Select</option>
                                                <option value="week">Week(s)</option>
                                                <option value="month">Month(s)</option>
                                                <option value="year">Year(s)</option>
                                            </select>
                                            <div className="min-h-[24px]">
                                                {formErrors[modIdx]?.durationSelect && <p className="text-red-500 text-sm mt-1">{formErrors[modIdx].durationSelect}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-end gap-4 mb-6">
                            <button onClick={onBack} className="bg-black text-white px-5 py-2 rounded hover:bg-[#8f8f8f]">
                                Cancel
                            </button>
                            <button type="submit" className="bg-[#52b69a] text-white px-6 py-2 rounded hover:bg-black">
                                {addCourseStep2loading ? 'Publishing please wait...' : 'Publish Course →'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddCourseStep2;
