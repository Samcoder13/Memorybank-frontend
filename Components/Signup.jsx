import  { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [signupError, setSignupError] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/;

const navigate=useNavigate();
  const validateName = (name) => {
    if (!name) {
      setNameError('Name is required');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = (email) => {
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must contain at least one letter, one number, and one special character');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      try {
        const response = await fetch('http://localhost:4000/v1/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (response.status===200) {
          const errorData = await response.json();
          setSignupError(errorData.message || 'Signup failed');
        } else {
          // const data = await response.json();
          alert('Signup successful');
          setSignupError('');
          navigate('/');
        }
      } catch (error) {
        setSignupError('Server error. Please try again later.');
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={2} sx={{ boxShadow: '4px 4px 10px rgba(0, 0, 0, 0.2)',p: 9  }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Signup
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => validateName(name)}
            error={!!nameError}
            helperText={nameError}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => validateConfirmPassword(password, confirmPassword)}
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Signup
          </Button>
          {signupError && <Typography color="error">{signupError}</Typography>}
        </form>
        <br/>
        <Grid container>
          <Grid item>
            <Link to='/'>{`Already have an account? Login up`}</Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Signup;
