import { useEffect, useState } from "react"

export function AsyncTest() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsButtonVisible(true)
    }, 1000)
  }, [])
  return (
    <div>
      <div>Hello World</div>
      { isButtonVisible && <button>Button</button>}
    </div>
  )
}