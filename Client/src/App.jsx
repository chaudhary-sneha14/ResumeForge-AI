// import React from 'react'
// import Sidebar from './Component/Sidebar'
import { Route, Routes } from 'react-router-dom'
import {Dashboard} from './Pages/Dashboard'
import { UploadResume } from './Pages/UploadResume'
import DashboardLayout from './layout/DashboardLayout'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import AuthLayout from './layout/Authlayout'

const App = () => {
  return (
  <>
   <Routes>

        {/* Home (public) */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Dashboard pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadResume />} />
        </Route>

      </Routes>
  </>
  )
}

export default App
