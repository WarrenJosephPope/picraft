import { useState, useRef, useEffect } from 'react'
import { TbAdjustmentsHorizontal } from 'react-icons/tb'
import { MdOutlineFilterAlt, MdCrop } from 'react-icons/md'
import { RxRotateCounterClockwise } from 'react-icons/rx'
import { FaImage } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

function App() {
  let initImage = null
  const fileInput = useRef()
  const canvas = useRef()

  const [image, setImage] = useState(null)
  const [imageStack, setImageStack] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const drawImage = () => {
    const ctx = canvas.current.getContext('2d')
    ctx.drawImage(image, 0, 0)
  }

  useEffect(() => {
    if (image !== null) {
      canvas.current.width = image.naturalWidth
      canvas.current.height = image.naturalHeight
      console.log(canvas.current.width, canvas.current.height)
      drawImage()
    }
  }, [image])

  const handleLoadImage = e => {
    setImage(initImage)
    setImageStack(stack => stack.push(initImage.src))
    setIsLoading(false)
  }

  const handleLoadFile = e => {
    initImage = new Image()
    initImage.addEventListener('load', handleLoadImage)
    initImage.src = e.target.result
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    setIsLoading(true)
    const fr = new FileReader()
    fr.addEventListener('load', handleLoadFile)
    fr.readAsDataURL(file)
  }

  return (
    <>
    <div className="flex justify-between items-center bg-gray-800 px-5 md:px-10 h-[50px]">
      <div className="text-2xl text-white font-bold">Picraft</div>
    </div>
    <div className="h-[calc(100vh-150px)] bg-gray-100 overflow-auto p-5">
      {
        image ? (
          <canvas className="w-full max-w-[500px] mx-auto" ref={canvas}></canvas>
        ) : isLoading ?  (
          <div className="flex justify-center items-center w-full h-full">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center h-full w-full">
            <div className="text-2xl font-medium">Upload Image</div>
            <div className=""><button onClick={() => fileInput.current.click()} className="px-5 py-3 bg-gray-600 duration-200 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2"><FaImage />Upload</button></div>
            <input ref={fileInput} onChange={handleFileChange} type="file" className="hidden" accept="image/*" />
          </div>
        )
      }
    </div>
    <div className="overflow-x-auto max-w-full flex items-center justify-start gap-5 bg-gray-800 px-5 md:px-10 h-[100px]">
      <div class="flex flex-col items-center justify-center gap-2">
        <button className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><TbAdjustmentsHorizontal /></button>
        <div className="text-white text-xs font-bold">Adjust</div>
      </div>
      <div class="flex flex-col items-center justify-center gap-2">
        <button className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><MdOutlineFilterAlt /></button>
        <div className="text-white text-xs font-bold">Filters</div>
      </div>
      <div class="flex flex-col items-center justify-center gap-2">
        <button className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><RxRotateCounterClockwise /></button>
        <div className="text-white text-xs font-bold">Orientation</div>
      </div>
      <div class="flex flex-col items-center justify-center gap-2">
        <button className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><MdCrop /></button>
        <div className="text-white text-xs font-bold">Crop</div>
      </div>
    </div>
    </>
  );
}

export default App;
