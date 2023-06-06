import React, { useEffect, useState } from 'react';
import LeftBar from './LeftBar';
import LoginPro from './LoginPro';
import './index.less';

const Login = (props) => {
    const { children } = props;
    const [leftShow, setLeftShow] = useState(true);

    const onWindowResize = ({ currentTarget }) => {
        if (currentTarget.innerWidth < 1200) {
            setLeftShow(false);
        } else {
            setLeftShow(true);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', onWindowResize);
        const firstSize = window.innerWidth;
        if (firstSize < 1200) {
            setLeftShow(false);
        } else {
            setLeftShow(true);
        };

        return () => {
            window.removeEventListener('resize', onWindowResize);
        }
    }, []);

    return (
        <div className='runnerGo-login'>
            {
                leftShow && <LeftBar />
            }
            <div className='right'>
                <LoginPro />
            </div>
        </div>
    )
};

export default Login;