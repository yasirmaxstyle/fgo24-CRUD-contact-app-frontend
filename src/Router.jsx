import { Outlet, Route, Routes } from "react-router"
import Header from "./components/Header"
import ContactDashboard from "./pages/HomePage"

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

function Router() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<ContactDashboard />} />
      </Route>
    </Routes>
  )
}

export default Router