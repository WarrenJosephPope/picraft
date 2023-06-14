import { useState, useRef, useEffect } from 'react'
import { TbAdjustmentsHorizontal } from 'react-icons/tb'
import { MdOutlineFilterAlt, MdCrop } from 'react-icons/md'
import { RxRotateCounterClockwise } from 'react-icons/rx'
import { FaImage, FaDownload, FaUpload } from 'react-icons/fa'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { LuUndo2, LuRedo2 } from 'react-icons/lu'
import Alien from './images/alien.png'
import Exposed from './images/exposed.png'
import Faded from './images/faded.png'
import Grayscale from './images/grayscale.png'
import Sepia from './images/sepia.png'
import Vintage from './images/vintage.png'

function App() {
  let initImage = null

  // Ref Hooks

  const fileInput = useRef()
  const canvas = useRef()
  const submenu = useRef()


  // State Hooks

  const [image, setImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [subMenu, setSubmenu] = useState('')
  const [debounce, setDebounce] = useState(null)
  const [debounceTime, setDebounceTime] = useState(500)
  const [imageStack, setImageStack] = useState([])
  const [stackPos, setStackPos] = useState(0)
  const [adjustSettings, setAdjustSettings] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    grayscale: 0,
    sepia: 0,
    huerotate: 0
  })


  // Functions

  const changeFilter = (filterName) => {

  }

  const resetAdjustSettings = () => {
    setAdjustSettings({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      grayscale: 0,
      sepia: 0,
      huerotate: 0
    })
  }

  const resetAllSettings = () => {
    setImage(null)
    setImageStack([])
    setStackPos(0)
    setDebounce(null)
    setSubmenu('')
    resetAdjustSettings()
  }

  const applyAdjustFilters = () => {
    setImageStack(prev => {
      const currentStack = prev.filter((item, index) => index <= stackPos)
      setStackPos(prev => prev+1)
      return [...currentStack, canvas.current.toDataURL()]
    })
  }

  const drawImage = () => {
    return new Promise((resolve, reject) => {
      if (!canvas.current || imageStack.length === 0) return
      const newImage = new Image()
      newImage.onload = () => {
        const ctx = canvas.current.getContext('2d')
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
        ctx.drawImage(newImage, 0, 0)
        resolve()
      }
      newImage.onerror = () => reject()
      newImage.src = imageStack[stackPos]
    })
  }

  const handleAdjustSettingsChange = () => {
    if (debounce !== null) {
      clearTimeout(debounce)
    }
    setDebounce(setTimeout(() => {
      const currentImage = new Image()
      currentImage.onload = e => {
        if (canvas.current) {
          const ctx = canvas.current.getContext('2d')
          ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
          ctx.filter = `brightness(${adjustSettings.brightness}%) saturate(${adjustSettings.saturation}%) contrast(${adjustSettings.contrast}%) grayscale(${adjustSettings.grayscale}%) sepia(${adjustSettings.sepia}%) hue-rotate(${adjustSettings.huerotate}deg)`
          ctx.drawImage(currentImage, 0, 0)
        }
      }
      currentImage.src = imageStack[stackPos]
    }, debounceTime))
  }

  const resizeCanvas = () => {
    const width = canvas.current.width
    const height = canvas.current.height
    
    const preferredWidth = window.innerWidth - 40
    const preferredHeight = window.innerHeight - 200

    const calculatedWidth = Math.round(width * preferredHeight / height)
    const calculatedHeight = Math.round(height * preferredWidth / width)

    if (calculatedWidth <= preferredWidth) {
      canvas.current.style.width = null
      canvas.current.style.height = `${preferredHeight}px`
    } else if (calculatedHeight <= preferredHeight) {
      canvas.current.style.height = null
      canvas.current.style.width = `${preferredWidth}px`
    }
  }

  const handleLoadImage = e => {
    setImage(initImage)
    setImageStack(prev => [...prev, initImage.src])
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


  // Effect Hooks

  useEffect(() => {
    handleAdjustSettingsChange()
  }, [adjustSettings])

  useEffect(() => {
    drawImage()
    resetAdjustSettings()
  }, [stackPos])

  useEffect(() => {
    if (debounceTime !== 0) return
    (async () => {
      try {
        await drawImage()
        resetAdjustSettings()
      } catch (err) {
        console.log(err)
      }
    })()
  }, [debounceTime])

  useEffect(() => {
    setDebounceTime(0)
    setTimeout(() => {
      setDebounceTime(500)
    }, 200)
  }, [imageStack, subMenu])

  useEffect(() => {
    if (image !== null) {
      canvas.current.width = image.naturalWidth
      canvas.current.height = image.naturalHeight
      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)
      canvas.current.addEventListener('scroll', e => {
        console.log(e)
      })
      drawImage()
    }
  }, [image])

  return (
    <>
    <div className="flex justify-between items-center bg-gray-800 px-5 md:px-10 h-[60px]">
      <div className="text-2xl text-white font-bold">Picraft</div>
      {
        image && (
          <div className="flex gap-2">
            <button onClick={() => resetAllSettings()} className="text-white flex gap-2 items-center px-5 py-2 bg-yellow-600 rounded-[4px] duration-200 hover:bg-yellow-500">Pick another image</button>
            <select className="bg-gray-600 outline-none border-none px-5 py-2 text-white">
              <option>JPG</option>
              <option>PNG</option>
              <option>WebP</option>
            </select>
            <button className="text-white flex gap-2 items-center px-5 py-2 bg-gray-600 rounded-[4px] duration-200 hover:bg-gray-500">Download <FaDownload /></button>
          </div>
        )
      }
    </div>
    <div className="h-[calc(100vh-160px)] bg-gray-100 overflow-auto p-5">
      {
        image ? (
          <canvas className="mx-auto border-2 border-gray-400 border-dashed" ref={canvas}></canvas>
        ) : isLoading ?  (
          <div className="flex justify-center items-center w-full h-full">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 justify-center items-center h-full w-full">
            <div className="text-2xl font-medium flex items-center gap-2"><FaImage /> Upload Image</div>
            <div className=""><button onClick={() => fileInput.current.click()} className="px-5 py-3 bg-gray-600 duration-200 hover:bg-gray-500 text-white rounded-lg flex items-center gap-2"><FaUpload />Upload</button></div>
            <input ref={fileInput} onChange={handleFileChange} type="file" className="hidden" accept="image/*" />
          </div>
        )
      }
    </div>
    <div className="relative">
      <div className="overflow-x-auto max-w-full flex items-center justify-start gap-8 bg-gray-800 px-5 md:px-10 h-[100px]">
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setStackPos(prev => prev === 0 ? prev : prev-1)} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><LuUndo2 /></button>
          <div className="text-white text-xs font-bold">Undo</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setStackPos(prev => prev === imageStack.length-1 ? prev : prev+1)} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><LuRedo2 /></button>
          <div className="text-white text-xs font-bold">Redo</div>
        </div>
        <div className="border-l border-gray-400 h-[60%]"></div>
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setSubmenu(prev => prev === 'adjust' ? '' : 'adjust')} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><TbAdjustmentsHorizontal /></button>
          <div className="text-white text-xs font-bold">Adjust</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setSubmenu(prev => prev === 'filters' ? '' : 'filters')} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><MdOutlineFilterAlt /></button>
          <div className="text-white text-xs font-bold">Filters</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setSubmenu(prev => prev === 'orientation' ? '' : 'orientation')} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><RxRotateCounterClockwise /></button>
          <div className="text-white text-xs font-bold">Orientation</div>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <button disabled={image===null} onClick={() => setSubmenu(prev => prev === 'crop' ? '' : 'crop')} className="bg-gray-700 duration-200 hover:bg-gray-600 text-white p-2 text-2xl rounded-full"><MdCrop /></button>
          <div className="text-white text-xs font-bold">Crop</div>
        </div>
      </div>
      <div ref={submenu} className={`absolute flex flex-wrap justify-center items-center gap-5 top-0 left-0 w-full duration-200 px-5 md:px-10 py-5 bg-gray-800 bg-opacity-75 ${subMenu !== '' ? '-translate-y-full' : 'opacity-0 pointer-events-none'}`}>
        {
          subMenu === 'adjust' ? (
            <>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Brightness</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, brightness: e.target.value}})} type="range" min="0" max="300" value={adjustSettings.brightness} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Contrast</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, contrast: e.target.value}})} type="range" min="0" max="200" value={adjustSettings.contrast} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Saturation</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, saturation: e.target.value}})} type="range" min="0" max="300" value={adjustSettings.saturation} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Grayscale</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, grayscale: e.target.value}})} type="range" min="0" max="100" value={adjustSettings.grayscale} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Sepia</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, sepia: e.target.value}})} type="range" min="0" max="100" value={adjustSettings.sepia} /></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-sm text-white font-semibold">Hue Rotate</div>
                <div className=""><input onChange={e => setAdjustSettings(prev => {return {...prev, huerotate: e.target.value}})} type="range" min="0" max="360" value={adjustSettings.huerotate} /></div>
              </div>
              <div className="flex flex-wrap gap-2 items-end justify-start h-full">
                <button onClick={applyAdjustFilters} className="px-5 py-2 bg-blue-600 rounded-[5px] font-semibold duration-200 hover:bg-blue-500 text-sm text-white">Apply</button>
                <button onClick={() => {
                  setDebounceTime(0)
                  setTimeout(() => {
                    setDebounceTime(500)
                  }, 200)
                }} className="px-5 py-2 bg-yellow-600 rounded-[5px] font-semibold duration-200 hover:bg-yellow-500 text-sm text-white">Reset</button>
              </div>
            </>
          ) :
          subMenu === 'filters' ? (
            <>
            <div onClick={() => changeFilter('exposed')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Exposed} /></div>
              <div className="text-sm text-white font-bold">Exposed</div>
            </div>
            <div onClick={() => changeFilter('alien')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Alien} /></div>
              <div className="text-sm text-white font-bold">Alien</div>
            </div>
            <div onClick={() => changeFilter('faded')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Faded} /></div>
              <div className="text-sm text-white font-bold">Faded</div>
            </div>
            <div onClick={() => changeFilter('grayscale')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Grayscale} /></div>
              <div className="text-sm text-white font-bold">Grayscale</div>
            </div>
            <div onClick={() => changeFilter('sepia')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Sepia} /></div>
              <div className="text-sm text-white font-bold">Sepia</div>
            </div>
            <div onClick={() => changeFilter('vintage')} className="flex flex-col gap-2 justify-center items-center cursor-pointer opacity-75 duration-200 hover:opacity-100">
              <div className="aspect-video w-[150px] rounded-lg overflow-hidden"><img src={Vintage} /></div>
              <div className="text-sm text-white font-bold">Vintage</div>
            </div>
            </>
          ) :
          subMenu === 'orientation' ? (
            <>Orientation</>
          ) :
          subMenu === 'crop' ? (
            <>Crop</>
          ) : (<></>)
        }
      </div>
    </div>
    </>
  );
}

export default App;

// Brightness
// Contrast
// Saturation
// Grayscale
// Sepia
// Hue