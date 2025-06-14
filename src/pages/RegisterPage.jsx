import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';


const RegisterPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await register(form);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/chat');
    } catch (err) {
      alert(err.response.data.message || 'Registration failed');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen border'>
      <form onSubmit={handleSubmit} className='space-y-4 w-80 border-blue-600 border-b-2 p-3 rounded'>
        <h2 className='text-xl font-bold'>Register</h2>
        <input
          name='username'
          placeholder='Username'
          className='input'
          onChange={handleChange}
          required
        />
        <input
          name='email'
          type='email'
          placeholder='Email'
          className='input'
          onChange={handleChange}
          required
        />
        <input
          name='password'
          type='password'
          placeholder='Password'
          className='input'
          onChange={handleChange}
          required
        />
        <button className='w-full bg-blue-500 text-white py-2 rounded'>
          Register
        </button>
      </form>
      <div className='footer mt-5 flex'>
        <h5>Already have an account?</h5>
        <Link to='/' className=''>
          <span className='text-blue-500 hover:underline'>Login</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
