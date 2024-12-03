import React, { useState, useEffect } from "react";
import '../../fonts/Fonts.css';
import './Main.css'
import AllIcon from '../Icon/AllIcon/AllIcon';
import { useTelegram } from "../../hooks/useTelegram";
import axios from 'axios';
import fireImage from './fire2.gif';

const Main = () => {
    const { user, tg } = useTelegram();
    const [userData, setUserData] = useState([]);
    const [clickCount, setClickCount] = useState(0);
    const [animClass, setAnimClass] = useState('');
    const [timenow, settime] = useState(Math.floor(Date.now() / 1000));
    const [counters, setCounters] = useState([]);

    const instance = axios.create({
        baseURL: 'https://yourApi'
    });

    const name_users = user?.id;

    useEffect(() => {
        const timerID = setInterval(() => {
            settime(Math.floor(Date.now() / 1000));
        }, 1000);
        return () => {
            clearInterval(timerID);
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await instance.get('/users', { params: { name: name_users } });
                setUserData(response.data[0]);
            } catch (error) {
                console.error('bd error(');
            }
        };

        fetchUserData();
        tg.ready();
    }, [tg, name_users]);

    useEffect(() => {
        const cookieValue = getClickCountFromCookie();
        setClickCount(cookieValue);
    }, []);

    const sendbutton = () => {
        if (clickCount >= 1000) {
            setAnimClass('anim');
            setTimeout(() => {
                document.querySelector(`.trainBlue-svg-anim`).style.opacity = 0;
                setAnimClass('');
            }, 5000);
            document.cookie = `clickCount=0`;
            setClickCount(0);

            const fetchtime = async () => {
                try {
                    const response = await instance.get('/time', { params: { name: name_users } });
                    if (response.data === 'timehack') {
                    } else {
                        userData.balance += 50 * userData.b1;
                    }
                } catch (error) {
                    console.error('bd error(');
                }
            };
            fetchtime();
            tg.ready();
            userData.time = Math.floor(Date.now() / 1000);
        }
    };

    const getClickCountFromCookie = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.split('=');
            if (name.trim() === 'clickCount') {
                return parseInt(value) || 0;
            }
        }
        return 0;
    };

    let sendtimer = timenow - userData.time;
    if (sendtimer >= ((9 - userData.b3) * 3600)) {
        if (animClass === '') {
            document.querySelector(`.trainBlue-svg-`).style.opacity = 1;
            setAnimClass('back');
        }
    }

    function normtime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const rsec = seconds % 60;

        const fh = String(hours).padStart(2, '0');
        const fmin = String(minutes).padStart(2, '0');
        const fsec = String(rsec).padStart(2, '0');

        return `${fh}:${fmin}:${fsec}`;
    }

    const handleClick = (event) => {
        if (clickCount < 1000 && (timenow - userData.time) >= ((9 - userData.b3) * 3600)) {
            document.cookie = `clickCount=${clickCount + (1 * userData.b2)}`;
            setClickCount(prevCount => prevCount + (1 * userData.b2));

            const top = event.clientY - 500;
            const left = Math.min(event.clientX - 20, 280);

            const newCounter = { id: Date.now(), top, left };

            setCounters(prevCounters => [...prevCounters, newCounter]);

            setTimeout(() => {
                setCounters(prevCounters => prevCounters.filter(counter => counter.id !== newCounter.id));
            }, 1000);
        }
    };

    const generateCounterAnimationStyles = () => {
        return counters.map(counter => {
            const fromValue = counter.top > 0 ? counter.top - 150 :
                counter.top < -1 && counter.top > -75 ? counter.top - 150 :
                    counter.top < -76 && counter.top > -160 ? counter.top - 50 :
                        counter.top < -160 ? counter.top + 20 : counter.top - 30;
            const toValue = counter.top > 0 ? counter.top - 300 :
                counter.top < -1 && counter.top > -75 ? counter.top - 250 :
                    counter.top < -76 && counter.top > -160 ? counter.top - 150 :
                        counter.top < -160 ? counter.top - 80 : counter.top - 100;
            return `
                @keyframes counter-animation-${counter.id} {
                    from {
                        transform: translateY(${fromValue}px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(${toValue}px);
                        opacity: 1;
                    }
                }
            `;
        }).join('\n');
    };

    const [showMenu, setShowMenu] = useState(false);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFireClick = () => {
        setShowMenu(true);
    };

    const handleBurnClick = async () => {
        if (!amount) { return; }
        setLoading(true);
        try {
            const response = await instance.get('/burn', { params: { name: name_users, amount } });
            if (response.data === '$METRO BURNED!') {
                userData.balance = userData.balance - amount;
            }
        } catch (error) {
            console.error('bd error(', error);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setShowMenu(false);
                setAmount('');
            }, 1000);
        }
    };

    const handleCloseClick = () => {
        setShowMenu(false);
        setAmount('');
    };

    return (
        <div className={'main-container'}>
            <style>
                {generateCounterAnimationStyles()}
            </style>
            <div className={'button-send'}>
                {sendtimer < ((9 - userData.b3) * 3600) ? (
                    <button>{normtime(((9 - userData.b3) * 3600) - sendtimer)}</button>
                ) : (
                    clickCount < 1000 ? (
                        <button>{clickCount}/1000</button>
                    ) : (
                        <button onClick={sendbutton}>Send (You will receive: {50 * userData.b1} $METRO)</button>
                    )
                )}
            </div>
            <div className="amount-metro">
                <h2>Balance: {userData.balance} $METRO</h2>
            </div>
            <div className="button-container">
                <img
                    src={fireImage}
                    alt="Fire"
                    className="fire-image"
                    onClick={handleFireClick}
                />
                {showMenu && (
                    <div className="fireMenu">
                        <button className="close-button" onClick={handleCloseClick}>X</button>
                        <label htmlFor="amount">HOW MUCH?</label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button
                            className="burn-button"
                            onClick={handleBurnClick}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'BURN!'}
                        </button>
                    </div>
                )}
            </div>
            <AllIcon className="allIcon" animClass={animClass} />
            <div style={{ position: 'relative' }}>
                {counters.map(counter => (
                    <div key={counter.id} className={`counter ${animClass}`} style={{ top: `${counter.top}px`, left: `${counter.left}px`, animation: `counter-animation-${counter.id} 1s ease forwards` }}>+{userData.b2}</div>
                ))}
                <svg
                    className={'button-tap'}
                    xmlns="http://www.w3.org/2000/svg"
                    width="2007"
                    height="2018"
                    viewBox="0 0 2007 2018"
                    version="1.1"
                    onClick={handleClick}
                >
                    <path d="M 658.941 618.376 C 658.728 618.822, 654.065 1257.530, 654.036 1290.250 L 654 1331 721.031 1331 C 773.787 1331, 788.144 1330.734, 788.443 1329.750 C 788.652 1329.063, 789.372 1229.725, 790.042 1109 C 790.712 988.275, 791.539 864.075, 791.880 833 L 792.500 776.500 860.366 1053.500 C 897.693 1205.850, 928.518 1330.800, 928.866 1331.166 C 929.215 1331.533, 960.766 1331.983, 998.979 1332.166 L 1068.459 1332.500 1139.479 1055.834 C 1178.541 903.668, 1210.646 779.313, 1210.824 779.491 C 1211.001 779.668, 1210.635 904.052, 1210.009 1055.899 C 1209.384 1207.745, 1209.152 1332.437, 1209.495 1332.992 C 1209.904 1333.653, 1233.106 1334, 1276.934 1334 L 1343.749 1334 1344.376 1132.750 C 1344.721 1022.063, 1345.283 861.917, 1345.626 776.871 L 1346.250 622.241 1296.875 621.557 C 1269.719 621.180, 1220.975 621.013, 1188.556 621.186 L 1129.612 621.500 1065.858 859 C 1030.793 989.625, 1001.737 1098.029, 1001.288 1099.898 C 1000.601 1102.763, 990.618 1065.453, 937.610 861.898 C 903.035 729.129, 874.466 620.215, 874.123 619.866 C 873.635 619.370, 659.176 617.885, 658.941 618.376" stroke="none" fill="#535456" fill-rule="evenodd" />
                    <path d="M 959.500 12.185 C 918.849 13.599, 863.578 20.236, 815.537 29.474 C 393.576 110.609, 70.536 453.692, 15.051 879.627 C 10.816 912.133, 9.774 923.632, 7.984 957.627 C 6.075 993.874, 5.984 1001.001, 6.984 1036 C 10.043 1143.087, 29.147 1244.861, 64.927 1344.688 C 173.211 1646.805, 419.484 1878.148, 727.369 1966.968 C 782.246 1982.799, 826.655 1991.870, 883.500 1998.859 C 964.579 2008.828, 1031.273 2009.270, 1113 2000.378 C 1150.148 1996.337, 1158.747 1995.038, 1195 1987.997 C 1250.382 1977.241, 1294.883 1964.891, 1347.746 1945.606 C 1674.146 1826.534, 1915.568 1544.972, 1983.540 1204.103 C 1990.005 1171.684, 1991.716 1160.709, 1995.951 1124.500 C 2000.407 1086.407, 2000.981 1078.941, 2002.122 1044.243 C 2004.781 963.339, 1998.949 891.473, 1983.396 813.500 C 1899.179 391.290, 1552.158 70.132, 1124.500 18.615 C 1067.627 11.764, 1022.360 10, 959.500 12.185 M 977.479 77.085 C 959.891 112.299, 944.707 141.836, 943.737 142.722 C 942.394 143.949, 933.840 145.249, 907.859 148.175 C 511.839 192.767, 197.552 502.024, 146.708 897.145 C 142.423 930.444, 142.412 930.501, 139.958 930.847 C 137.608 931.179, 7.640 996.981, 8.220 997.546 C 9.517 998.808, 138.222 1066, 139.343 1066 C 141.065 1066, 140.956 1065.277, 145.055 1104 C 149.403 1145.077, 158.089 1190.435, 169.974 1234.125 C 249.116 1525.056, 474.232 1753.788, 764 1837.694 C 807.784 1850.372, 855.830 1860.196, 900.500 1865.604 C 918.220 1867.749, 932.394 1869.927, 933.588 1870.687 C 934.901 1871.524, 947.514 1896.682, 967.573 1938.473 C 985.117 1975.024, 999.751 2004.607, 1000.092 2004.214 C 1000.434 2003.821, 1014.976 1974.475, 1032.408 1939 C 1049.840 1903.525, 1065.092 1873.523, 1066.301 1872.329 C 1068.285 1870.370, 1071.683 1869.802, 1101 1866.532 C 1401.303 1833.035, 1663.109 1644.370, 1790.023 1370 C 1827.715 1288.515, 1853.337 1198.266, 1863.410 1111.500 C 1867.935 1072.525, 1867.685 1073.985, 1869.792 1074.269 C 1870.731 1074.396, 1900.848 1059.426, 1936.718 1041.002 L 2001.937 1007.503 1997.218 1005.109 C 1994.623 1003.791, 1965.120 988.378, 1931.655 970.857 C 1898.190 953.336, 1870.186 939, 1869.424 939 C 1867.559 939, 1867.541 938.893, 1863.420 903.500 C 1855.863 838.593, 1839.535 771.021, 1816.057 707.500 C 1704.190 404.828, 1432.871 189.754, 1112.049 149.432 C 1092.550 146.981, 1075.779 144.419, 1074.779 143.738 C 1073.779 143.057, 1058.970 113.700, 1041.871 78.500 C 1024.771 43.300, 1010.483 14.176, 1010.119 13.779 C 1009.756 13.383, 995.068 41.870, 977.479 77.085" stroke="none" fill="#535456" fill-rule="evenodd" />
                </svg>
            </div>
            <div className="button-rafl-nft">
                <form action="https://dedust.io" className={'button-presale'}>
                    <button type="submit">DEX HERE</button>
                </form>
                <form action="https://getgems.io" className={'button-nft'}>
                    <button type="submit">NFT HERE</button>
                </form>
            </div>
        </div>
    )
}

export default Main;
