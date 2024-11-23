import { Outlet,Navigate } from "react-router-dom"

// eslint-disable-next-line react/prop-types
const Privateroutes = ({auth}) => {
  const token = localStorage.getItem('token');
  return  auth&&token?
  <>
  <Outlet/>
  </>
  :<Navigate to='/' />

}

export default Privateroutes
