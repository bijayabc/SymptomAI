import './App.css'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from "./pages/home"
import { Page1 } from "./pages/page1"
import { Page2 } from "./pages/page2"

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/page1' element={<Page1 />} />
        <Route path='/page2' element={<Page2 />} />
      </Routes>
    </Router>
  )
}

export default App