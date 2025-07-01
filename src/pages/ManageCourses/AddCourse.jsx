import { ToastContainer } from "react-toastify";
import AddCourseStep1 from "./AddCourseStep1";
import AddCourseStep2 from "./AddCourseStep2";
import { useState } from "react";


const AddCourse = () => {
    const [step, setStep] = useState(1);
    const [levelId, setLevelId] = useState();

    return (
        <>
            <ToastContainer />

            {step === 1 && <AddCourseStep1 onNext={() => setStep(2)} setLevelId={setLevelId} level_id={levelId}/>}
            {step === 2 && <AddCourseStep2 onBack={() => setStep(1)} levelId={levelId} />}

        </>
    )
};

export default AddCourse;