// import React from 'react'
// import Sidebar from './Component/Sidebar'
import { Route, Routes } from 'react-router-dom'
import {Dashboard} from './Pages/Dashboard'
import { UploadResume } from './Pages/UploadResume'
import DashboardLayout from './layout/DashboardLayout'
import Home from './Pages/Home'
import Login from './Pages/Login'
// import Signup from './Pages/Signup'
import AuthLayout from './layout/Authlayout'
import ResumeAnalysis from './Pages/ResumeAnalysis'
import CoverLetter from './Pages/CoverLetter'
import SkillGap from './Pages/SkillGap'
import Interview from './Pages/Interview'
import ResumeBuilder from './Pages/ResumeBuilder'
import {ToastContainer} from 'react-toastify'
import SkillProgress from './Pages/skillProgress'

const App = () => {
  return (
  <>
  <ToastContainer/>
   <Routes>

        {/* Home (public) */}
        <Route path="/" element={<Home />} />

        {/* Auth pages */}
        {/* <Route element={<AuthLayout />}> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
        {/* </Route> */}

        {/* Dashboard pages */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<UploadResume />} />
          <Route path="analysis" element={<ResumeAnalysis/>} />
          <Route path="cover-letter" element={<CoverLetter/>} />
          <Route path="skill-gap" element={<SkillGap/>} />
          <Route path="interview" element={<Interview/>} />
          <Route path="create" element={<ResumeBuilder/>} />
          <Route path="skill-progress" element={<SkillProgress />} />

        </Route>

      </Routes>
  </>
  )
}

export default App
