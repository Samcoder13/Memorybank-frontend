import Login from "../Components/Login";
import Signup from "../Components/Signup";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Mycontext } from "../Context/Createcontext";
import { useState } from "react";
import Header from "../Components/Header";
import Blogs from "../Components/Blogs";
import Privateroutes from "../Components/Privateroutes";
import Myblogs from "../Components/Myblogs";
import Createblog from "../Components/Createblog";
import Edit from "../Components/Edit";

function App() {
  const [accountname, setaccountname] = useState("");
  const [accountemail, setaccountemail] = useState("");
  const [auth, setauth] = useState(false);

  return (
    <>
      <Mycontext.Provider
        value={{ accountname, setaccountname, accountemail, setaccountemail }}
      >
        {/* {auth&&token ? <Header  /> : <></>} */}
        <div>
          <Routes>
            <Route path="/" element={<Login setauth={setauth}/>}></Route>
            <Route path="/blogs" element={<Privateroutes auth={auth} />}>
              <Route path="/blogs" element={<Blogs />}></Route>
            </Route>
            <Route path="/myblogs" element={<Privateroutes auth={auth} />}>
              <Route path="/myblogs" element={<Myblogs />}></Route>
            </Route>
            <Route path="/create" element={<Privateroutes auth={auth} />}>
              <Route path="/create" element={<Createblog />}></Route>
            </Route>
            <Route path="/edit/:id" element={<Privateroutes auth={auth} />}>
              <Route path="/edit/:id" element={<Edit />}></Route>
            </Route>

            <Route path="/signup" element={<Signup />}></Route>
            <Route path="*" element={<div>Page Not Found</div>}></Route>
          </Routes>
        </div>
      </Mycontext.Provider>
      {/* {console.log(auth)} */}
    </>
  );
}

export default App;
