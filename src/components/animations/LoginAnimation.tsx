
import Lottie from "lottie-react";
// import Login from "../../assets/animations/Login.json";
// import Login from "../../../public/assets/animations/Login.json";X
import Login from "../../../public/assets/animations/ZF0sumMZBn.json";


export default function LoginAnimation(){
  // return <Lottie animationData={Login} />;
  return (
    <div className="w-2xl h-2xl border-rounded-5xl ">
      <Lottie animationData={Login} loop />
    </div>
  )
};

