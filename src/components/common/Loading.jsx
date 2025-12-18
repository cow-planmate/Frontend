import LoadingRing from "../../assets/imgs/ring-resize.svg?react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <LoadingRing className="w-20"/>
    </div>
  )
}

export default Loading;