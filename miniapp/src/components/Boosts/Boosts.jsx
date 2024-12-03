import React, { useState, useEffect } from "react";
import './Boosts.css'
import { useTelegram } from "../../hooks/useTelegram";
import axios from 'axios';
import { boosts } from "..";

const Boosts = () => {
    const { user, tg } = useTelegram();
    const [userData, setUserData] = useState([]);
    const [timenow, settime] = useState(Math.floor(Date.now() / 1000));
    const [isLoading, setIsLoading] = useState(false);
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

    const buybutton = (numb) => {
        if (!(isLoading)) {
            if (userData['b' + numb] < 8) {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);

                const fetchbuy = async () => {
                    try {
                        const response = await instance.get('/buyboost', { params: { name: name_users, numb: numb } });
                        if (response.data == 'balancehack') {
                            //недостаточно метро
                        } else {
                            let numbrgbmr = 'b' + numb;
                            userData.balance -= userData[numbrgbmr] ** 2 * 50;
                            userData[numbrgbmr] += 1;
                        }
                    } catch (error) {
                        console.error('bd error(');
                    }
                };
                fetchbuy();
                tg.ready();
            }
        }
    };

    return (
        <div className={"boosts-container"}>
            <h1 className={"boosts-h1"}>BOOSTS</h1>
            <h1 className={"balance"}>{userData.balance} $METRO</h1>
            <div className={"boosts-content"}>
                {boosts.map(boost => {
                    return (
                        <div>
                            <div className={"boosts"} >
                                <div className={"img-boost"}>
                                    <div className={"image"}>
                                        {boost.image}
                                    </div>
                                    <div className={"text-content-boost"}>
                                        <div className={"x-boosts"}>
                                            <p><b>lvl {userData[boost.id]}</b> - {boost.title}</p>
                                            {boost.discription({ userData })}
                                        </div>
                                        <div className={'buy-button-boost'}>
                                            {userData.b3 < 8 ? (
                                                boost.condition( {userData, isLoading, buybutton} )
                                            ) : (
                                                <button className="Check">
                                                    MAX
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    )
                })}
            </div>
        </div >
    )
}

export default Boosts;