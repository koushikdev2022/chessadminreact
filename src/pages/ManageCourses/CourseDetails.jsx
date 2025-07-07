import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { courseDetails } from '../../Reducer/CourseSlice';
import pdfIcon from '../../assets/imagesource/pdf-download-2617.png';


const CourseDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const { loading, allCourseData, courseDetailsData } = useSelector((state) => state?.courses);
    const { id } = useParams()

    // console.log('courseId',id)
    // console.log('courseDetailsData',courseDetailsData)

    const tagColors = [
        { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
        // { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' },
        { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
        // { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
        // { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' },
        { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
        { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-300' },
    ];

    function getRandomColor() {
        return tagColors[Math.floor(Math.random() * tagColors.length)];
    }

    useEffect(() => {
        dispatch(courseDetails({ course_id: id })).then((res) => {
            console.log('res', res)
        })
    }, [])

    const formatCourseDuration = () => {
        if (courseDetailsData?.duration_string === 0) {
            return `${courseDetailsData?.duration_integer} Week(s)`;
        } else if (courseDetailsData?.duration_string === 1) {
            return `${courseDetailsData?.duration_integer} Month(s)`;
        } else {
            return `${courseDetailsData?.duration_integer} Year(s)`;
        }
    };

    const formatModuleDuration = (mod) => {
        if (mod?.duration_string === 0) {
            return `${mod?.duration_integer} Week(s)`;
        } else if (mod?.duration_string === 1) {
            return `${mod?.duration_integer} Month(s)`;
        } else {
            return `${mod?.duration_integer} Year(s)`;
        }
    };

    const handleFileOpen = (url) => {
        // navigate(`/${url}`)
        window.open(url, '_blank')
    }
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <div className="max-w-full mx-auto p-4 bg-white shadow rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">Course Details</h2>
                    </div>
                    <div className='border-2 border-solid border-gray-200 rounded-xl p-6'>
                        {/* Main Grid Layout */}
                        <div className="flex justify-between w-full items-center gap-16 mb-10 ">
                            {/* Left Column */}
                            {/* <div className="space-y-6"> */}
                            {/* Course Title & Subtitle */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Title</div>
                                <div className="text-gray-700 mb-4 break-words">{courseDetailsData?.title || 'N/A'}</div>

                            </div>
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Subtitle</div>
                                <div className="text-gray-500 break-words">{courseDetailsData?.sub_title || 'N/A'}</div>
                            </div>
                            {/* Cover Photo */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Cover Photo</div>
                                <div className="flex items-center mt-2">
                                   {
                                    courseDetailsData?.CourseBanner?.map(x=>(
                                        <div className="flex items-center border rounded-lg p-4 bg-gray-50 w-[21rem] cursor-pointer " key={x?.id} onClick={() => handleFileOpen(x?.banner_url)}>
                                            <img src={x?.banner_url} alt="Course Cover" className="w-16 h-16 object-cover rounded mr-4" />
                                            <div>
                                                <div className="font-medium text-gray-700">Course Image</div>
                                            </div>
                                        </div>
                                    ))
                                   }
                                </div>
                            </div>


                        </div>

                        <div className="flex justify-between items-center gap-16 mb-10">
                            {/* Course Tags */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Tags</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {courseDetailsData?.CourseTag?.map((tag, index) => {
                                        const color = getRandomColor();
                                        return (
                                            <span
                                                key={index}
                                                className={`${color.bg} ${color.text} px-3 py-1 rounded border ${color.border} text-sm`}
                                            >
                                                {tag?.title || 'N/A'}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Course Level*/}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Level</div>
                                <div className="text-gray-700">{courseDetailsData?.Level?.level_name}</div>
                            </div>
                            {/* Course duration */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Duration</div>
                                <div className="text-gray-700">{formatCourseDuration()}</div>
                            </div>

                        </div>
                        <div className="flex justify-between items-center gap-16 mb-10">
                            {/* Course Description */}
                            <div className='w-1/2'>
                                <div className="font-semibold text-lg mb-1">Course Description</div>
                                <div className="text-gray-700 break-words">
                                    {courseDetailsData?.course_description || 'N/A'}
                                </div>
                            </div>

                            {/* What Students Will Learn & Modules */}
                            <div className='w-1/2'>
                                <div className="flex mt-10">
                                    {/* What Students Will Learn */}
                                    <div >
                                        <div className="font-semibold text-lg mb-2">What Students will learn?</div>
                                        <ul className="list-disc ml-6 text-gray-700 space-y-1 break-words">
                                            {
                                                courseDetailsData?.student_will_learn?.map(x => (
                                                    <li key={x?.id}>{x?.name || 'N/A'}</li>
                                                ))
                                            }
                                        </ul>
                                    </div>

                                </div>
                            </div>

                        </div>


                        <div className="flex justify-between items-center gap-16 mb-10">

                            {/* Module Details */}
                            <div className="w-full">
                                {courseDetailsData?.CourseModuleMaps?.map((mod, modIdx) => (
                                    <div key={modIdx} className="mb-8 p-4 border rounded-xl bg-gray-50">
                                        <div className="flex flex-wrap justify-between gap-8 mb-4">
                                            <div>
                                                <div className="font-semibold">Module Name</div>
                                                <div className="text-gray-700 text-sm">{mod?.Topic?.topic_name}</div>
                                            </div>
                                            <div>
                                                <div className="font-semibold">Module Duration</div>
                                                <div className="text-gray-700 text-sm">{formatModuleDuration(mod)}</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {mod?.Lessions?.map((lesson, lessonIdx) => (
                                                <div key={lessonIdx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                    <div className="font-semibold text-base mb-2">Lesson 1-1 <span className="font-normal mx-2">:</span> <span className="font-normal">{lesson?.Module?.module_name}</span></div>
                                                    <div>
                                                        <div className="font-medium text-sm  mb-2">Homework File{lesson?.Homeworks?.length > 1 ? 's' : ''}</div>
                                                        {lesson?.Homeworks?.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {lesson?.Homeworks?.map((hfile, hIdx) => (
                                                                    <div key={hIdx} className="flex items-center border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition cursor-pointer overflow-hidden" onClick={() => handleFileOpen(hfile?.homework_url)}>
                                                                        <span className="mr-2 text-[20px] text-gray-400" >
                                                                            <img src={pdfIcon} alt="pdf" className="w-7 h-7" />
                                                                        </span>
                                                                        <div>
                                                                            <div className="font-medium text-gray-700 text-xs ">{hfile?.homework_name}</div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-gray-400 text-sm italic">No homework files uploaded.</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </>
    )
}

export default CourseDetails