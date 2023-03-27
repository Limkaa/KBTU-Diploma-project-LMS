import React from 'react';
import Login from '../../components/Login/Login'
import './LoginPage.css'

const LoginPage = () => {
    return (
        <div className='login'>
            <section id='main'>
                <div className="inner-con">
                    <Login/>
                    <div className="graphics">
                        <svg width="520" height="486" viewBox="0 0 520 486" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M477.287 175.87C534.398 206.961 532.527 289.583 474.067 318.056L309.029 398.44L143.106 475.618C68.618 510.266 -13.6189 445.272 2.51771 364.72C17.3534 290.663 30.8992 221.417 31.8048 211.065C32.3491 204.844 32.3015 174.475 31.938 133.228C30.9207 17.7984 169.113 -42.8955 252.63 36.7906L289.751 72.2083C292.295 74.6363 295.149 76.7181 298.238 78.3998L477.287 175.87Z" fill="#163A61"/>
                        </svg>
                        {/*<div className="svg"><img src="https://media.istockphoto.com/id/1165150697/photo/portrait-of-happy-exchange-student-facing-camera-smiling-while-holding-his-notebook-at-the.jpg?s=612x612&w=0&k=20&c=_2jF1Ql41WqH7HUEtCdg_r16wIC95sjqT27NBaVcVW4=" alt=""/></div>*/}
                        <svg id='image' width="474" height="447" viewBox="0 0 474 447" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                            <path d="M60.8511 314.329C-13.6534 281.836 -20.3251 178.748 49.3696 136.923L173.5 62.4291L246.005 20.6605C352.783 -40.8517 483.787 45.5724 471.103 168.146C468.008 198.055 466 219.538 466 224.929C466 231.174 468.694 261.423 472.651 302.482C483.725 417.383 351.348 489.891 261.204 417.787L221.138 385.739C218.391 383.542 215.367 381.717 212.143 380.311L60.8511 314.329Z" fill="url(#pattern0)"/>
                            <defs>
                                <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                                    {/*<use xlinkHref="#image0_8_122"/>*/}
                                    <image id="image0_8_122" width="612" height="479" xlinkHref="https://media.istockphoto.com/id/1165150697/photo/portrait-of-happy-exchange-student-facing-camera-smiling-while-holding-his-notebook-at-the.jpg?s=612x612&w=0&k=20&c=_2jF1Ql41WqH7HUEtCdg_r16wIC95sjqT27NBaVcVW4="/>
                                </pattern>
                                {/*<image id="image0_8_122" width="612" height="479" xlinkHref="https://media.istockphoto.com/id/1165150697/photo/portrait-of-happy-exchange-student-facing-camera-smiling-while-holding-his-notebook-at-the.jpg?s=612x612&w=0&k=20&c=_2jF1Ql41WqH7HUEtCdg_r16wIC95sjqT27NBaVcVW4="/>*/}
                            </defs>
                        </svg>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LoginPage;