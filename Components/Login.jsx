import { useContext, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Mycontext } from "../Context/Createcontext";
// eslint-disable-next-line react/prop-types
const Login = ({setauth}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/;
  const { setaccountname,setaccountemail } = useContext(Mycontext);
  const navigate = useNavigate();
  localStorage.removeItem("token");
  localStorage.removeItem("tokenExpiry");

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one letter, one number, and one special character"
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      const response = await fetch("http://localhost:4000/v1/login", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (response.status === 200) {
        const expiryTime = new Date().getTime() + data.expiresIn;
        localStorage.setItem("token", `Bearer ${data.token}`);
        localStorage.setItem("tokenExpiry", expiryTime);
        setaccountname(data.name);
        setaccountemail(data.email);
        setauth(true);
        navigate("/blogs");
      } else {
        alert(`Bad Credentials : ${data.msg}`);
      }
    }
  };
  return (
    <Container maxWidth="sm">
      <Box mt={5} sx={{ boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)", p: 10 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validateEmail(email)}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => validatePassword(password)}
            error={!!passwordError}
            helperText={passwordError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "16px" }}
          >
            Login
          </Button>
        </form>
        <br />
        <Grid container>
          <Grid item>
            <Link to="/signup">{`Don't have an account? Sign up`}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
