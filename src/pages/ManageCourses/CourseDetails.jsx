import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { courseDetails } from '../../Reducer/CourseSlice';

const CourseDetails = ({courseId}) => {
    const navigate = useNavigate();
  const dispatch = useDispatch()
  const { loading, allCourseData } = useSelector((state) => state?.courses);

  useEffect(() => {
    dispatch(courseDetails({course_id:courseId})).then((res) => {
      console.log('res', res)
    })
  }, [])
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
                                <div className="text-gray-700 mb-4">Opening Moves: A Beginner's Guide to Chess</div>

                            </div>
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Subtitle</div>
                                <div className="text-gray-500">Learn the rules, strategies, and confidence to start playing chess like a pro—even if you've never touched a board before.</div>
                            </div>
                            {/* Cover Photo */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Cover Photo</div>
                                <div className="flex items-center mt-2">
                                    <div className="flex items-center border rounded-lg p-4 bg-gray-50 w-[21rem]">
                                        <span className="mr-3 text-2xl text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l2.09 2.09m0 0l.72-.72a2.25 2.25 0 013.18 0L21 16.5m-8.25-2.25h.008v.008H12v-.008z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <div className="font-medium text-gray-700">KDP Course Image .Jpg</div>
                                            <div className="text-xs text-gray-500">3.8 MB</div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="flex justify-between items-center gap-16 mb-10">
                            {/* Course Tags */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Tags</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded border border-green-300 text-sm">Beginner Course</span>
                                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded border border-red-300 text-sm">Live Class</span>
                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded border border-yellow-300 text-sm">Chess Tactics</span>
                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded border border-blue-300 text-sm">Interactive Chess Lessons</span>
                                </div>
                            </div>
                            {/* Course Level*/}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Level</div>
                                <div className="text-gray-700">Basic Level</div>
                            </div>
                            {/* Course duration */}
                            <div className='w-1/3'>
                                <div className="font-semibold text-lg mb-1">Course Duration</div>
                                <div className="text-gray-700">4 Months</div>
                            </div>

                        </div>
                        <div className="flex justify-between items-center gap-16 mb-10">
                            {/* Course Description */}
                            <div className='w-1/2'>
                                <div className="font-semibold text-lg mb-1">Course Description</div>
                                <div className="text-gray-700">
                                    Opening Moves: A Beginner's Guide to Chess is the perfect starting point for anyone who wants to learn chess from scratch. Whether you've never touched a chessboard or just want to sharpen your basics, this course breaks everything down into easy, bite-sized lessons.
                                </div>
                            </div>

                            {/* What Students Will Learn & Modules */}
                            <div className='w-1/2'>
                                <div className="flex mt-10">
                                    {/* What Students Will Learn */}
                                    <div >
                                        <div className="font-semibold text-lg mb-2">What Students will learn?</div>
                                        <ul className="list-disc ml-6 text-gray-700 space-y-1">
                                            <li>The rules of the game and how each piece moves</li>
                                            <li>Essential opening principles and beginner strategies</li>
                                            <li>Common mistakes to avoid and how to think ahead</li>
                                        </ul>
                                    </div>

                                </div>
                            </div>

                        </div>


                        <div className="flex justify-between items-center gap-16 mb-10">

                            {/* Module Details */}
                            <div>
                                {[1, 2].map((mod) => (
                                    <div key={mod} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center pb-4 ">
                                        <div>
                                            <div className="font-semibold">Module 1 Name</div>
                                            <div className="text-gray-700 text-sm">Opening Moves: A Beginner's Guide to Chess</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">Lesson 1-1</div>
                                            <div className="text-gray-700 text-sm">What Is Chess? A Game of Kings and Strategy</div>
                                        </div>
                                        <div>
                                            <div className="font-semibold">Module Duration</div>
                                            <div className="text-gray-700 text-sm">2 hours</div>
                                        </div>
                                        <div className='w-64'>
                                            <div className="font-semibold">Homework File</div>
                                            <div className="flex items-center border rounded-lg p-3 bg-gray-50 mt-1">
                                                <span className="mr-2 text-2xl text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5M3 16.5A2.25 2.25 0 005.25 18.75h13.5A2.25 2.25 0 0021 16.5M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0l2.09 2.09m0 0l.72-.72a2.25 2.25 0 013.18 0L21 16.5m-8.25-2.25h.008v.008H12v-.008z" />
                                                    </svg>
                                                </span>
                                                <div className='w-[350px]'>
                                                    <div className="font-medium text-gray-700">Module 1 Homework .Pdf</div>
                                                    <div className="text-xs text-gray-500">3.8 MB</div>
                                                </div>
                                            </div>
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