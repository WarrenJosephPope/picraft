import { useState, useRef } from 'react'

function App() {
  let initImage = null
  const [image, setImage] = useState(null)

  const loadImage = () => {

  }

  return (
    <>
    <div className="flex justify-between items-center bg-gray-800 px-5 md:px-10 h-[50px]">
      <div className="text-2xl text-white font-bold">Picraft</div>
    </div>
    <div className="h-[calc(100vh-100px)] bg-gray-100">
      {
        image ? (
          <></>
        ) : (
          <div className="flex justify-center items-center h-full w-full">
            <div></div>
          </div>
        )
      }
    </div>
    <div className="flex items-center justify-center bg-gray-800 px-5 md:px-10 h-[50px]">

    </div>
    </>
  );
}

export default App;
