import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/api';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/chat');
    } catch (err) {
      alert(err.response.data.message || 'Login failed');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <form onSubmit={handleSubmit} className='space-y-4 w-80'>
        <h2 className='text-xl font-bold'>Login</h2>
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
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
