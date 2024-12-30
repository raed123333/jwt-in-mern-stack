// eslint-disable-next-line no-unused-vars
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Registration from './Registration'
import { BrowserRouter , Routes,Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Dashboard from './Dashboard'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/register' element={<Registration />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/> 
      
    </Routes>
    </BrowserRouter>
  )
}

export default App