import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { RoutePages } from './router';
import Header from '@pages/Layout/Header';
import LeftBar from '@pages/Layout/LeftBar';
import GlobalModal from '@modals/GlobalModal';
import useGlobal from './pages/hooks/useGlobal';
import { isLogin } from '@utils';
import "@arco-design/web-react/dist/css/arco.css";
import './App.less';
import React from 'react';

function App() {
  useGlobal(null);
  const navigate = useNavigate();
  const location = useLocation();
  const _ignorePage = ['/login'];

  const ignorePage = ['/login', '/register', '/find', '/reset', '/linkoverstep', '/wx'];
  useEffect(() => {
    let is_login = isLogin();
    if (!ignorePage.includes(location.pathname)) {
      if (!is_login) {
        navigate('/login');
      }
    } else if (is_login) {
      navigate('/work');
    }

  }, [location.pathname]);


  return (
    <>
      <div className="preloader">
        <img src="/loading.gif" />
      </div>
      <GlobalModal />
      {_ignorePage.includes(`/${location.pathname.split('/')[1]}`) ?
        <>
          <Routes>
            {
              RoutePages.map(item =>
                <Route key={item.name} path={item.path} element={<item.element />} />
              )
            }
            <Route path='/' element={<Navigate to="login" />} />
          </Routes>
        </> :
        <>
          <Header />
          <div className='page-main'>
            <LeftBar />
            <div className='page-container'>
              <Routes>
                {
                  RoutePages.map(item =>
                    <Route key={item.name} path={item.path} element={<item.element />} />
                  )
                }
                <Route path='/' element={<Navigate to="work" />} />
              </Routes>
            </div>
          </div>
        </>}
    </>
  )
}

export default App
