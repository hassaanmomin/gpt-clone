import { useState, useEffect } from "react"

const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [prevChats, setPrevChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      const response = await fetch ('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (err) {
      console.error(err)
    }
  }

useEffect(() => {
  console.log(currentTitle, value, message)
  if (!currentTitle && value && message) {
    setCurrentTitle(value)
  }
  if (currentTitle && value && message) {
    setPrevChats(prevChats => (
      [...prevChats, {
        title: currentTitle,
        role: "user",
        content: value
      }, {
        title: currentTitle,
        role: message.role,
        content: message.content
      }]
    ))
  }
}, [message, currentTitle])

const currentChat = prevChats.filter(prevChat => prevChat.title === currentTitle)
const uniqueTitles = Array.from(new Set(prevChats.map(prevChat => prevChat.title)))

  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>✚ New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul>
        <nav>
          <p>Made by Momin</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>MominGPT</h1>}
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>►</div>
          </div>
          <p className="info">
            Some advisory text about GPT...
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
