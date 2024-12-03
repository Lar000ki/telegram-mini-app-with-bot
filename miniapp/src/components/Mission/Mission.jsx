import React, { useState, useEffect } from "react";
import './Mission.css'
import { useTelegram } from "../../hooks/useTelegram";
import axios from 'axios';
import { missions } from "..";

const Mission = () => {
    const { user, tg } = useTelegram();
    const [userData, setUserData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFollow, setIsFollow] = useState(true);
    const instance = axios.create({
        baseURL: 'https://yourApi'
    });

    const name_users = user?.id;

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

    const checkbutton = (numb) => {
        if (!(isLoading)) {
            if ((userData['q' + numb] == null) || (numb == 3)) {
                setIsLoading(true);
                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
                const fetchcheck = async () => {
                    try {
                        const response = await instance.get('/mission', { params: { name: name_users, numb: numb } });
                        if (response.data == 'missionhack') {
                            if (numb == 1) {
                                setIsFollow(false);
                            } else {

                            }
                        } else {
                            let numbrgbmr = 'q' + numb;
                            if(numb == 3){
                                userData.balance += 100;
                                userData[numbrgbmr] = 2000000000;
                            }else{
                                userData.balance += 500;
                                userData[numbrgbmr] += 1;
                            }
                        }
                    } catch (error) {
                        console.error('bd error(');
                    }
                };
                fetchcheck();
                tg.ready();
            }
        }
    };

    return (
        <div className={"mission-container"}>
            <h1 className={"mission-h1"}>MISSION</h1>
            <h1 className={"balance"}>{userData.balance} $METRO</h1>
            <div className={"mission-content"}>
                {missions.map((mission) => {
                    return (
                        <div>
                            <div className={"mission"}>
                                <div className={"img-missoon"}>
                                    <div className={"image"}>
                                        {mission.image}
                                    </div>

                                    <div className={"text-content-mission"}>
                                        <div className={"title-mission"}>
                                            {mission.title}
                                        </div>

                                        <div className={'check-button'}>
                                            {userData[mission.id] == null || mission.id === 'q3' ? (
                                                mission.condition({ isFollow, isLoading, userData, checkbutton })
                                            ) : (
                                                <div className="SUCCESS">
                                                    SUCCESS
                                                </div>
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
        </div>
    )
}

export default Mission;