import React from "react";
import './Frens.css'
import { useTelegram } from "../../hooks/useTelegram";
import { useEffect, useState } from "react";
import axios from 'axios';
import { PersonFrenSVG } from "../../assets/AllIcon";

const Frens = () => {
    const { user, tg } = useTelegram();
    const [userData, setUserData] = useState([]);
    const [userData2, setUserData2] = useState([]);

    const instance = axios.create({
        baseURL: 'https://yourApi'
    });

    const name_users = user?.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await instance.get('/refusers', { params: { name: name_users } });
                setUserData(response.data);
            } catch (error) {
                console.error('bd error(');
            }
        };

        fetchUserData();
        const fetchUserData2 = async () => {
            try {
                const response = await instance.get('/users', { params: { name: name_users } });
                setUserData2(response.data[0]);
            } catch (error) {
                console.error('bd error(');
            }
        };

        fetchUserData2();
        tg.ready();
    }, [tg, name_users]);

    const handleContactRequest = () => {
        const message = encodeURIComponent(`t.me/metro_coin_bot?start=video${user?.id}`);
        const url = `https://t.me/share/url?url=${message}`;

        window.open(url, '_blank', 'toolbar=no,scrollbars=yes,resizable=yes,top=100,left=100,width=600,height=400');
    };

    const totalInvited = userData.reduce((total, user) => total + user.toinvited + 100, 0);

    if(userData2.ref2 == null){userData2.ref2 = '0';}
    return (
        <div className={"frens-container"}>
            <div className="link" onClick={handleContactRequest}>
                <button>
                    Сopy referral link
                </button>
            </div>

            <h2 className="totall-lut">TOTAL EARNED: <br /> {totalInvited} $METRO</h2>

            <div className="conteiner-frens">
                <div style={{
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'black'
                }}>
                    INVITE FRIENDS - GET 100 $METRO FOR EACH AND 10% OF THEIR PROFIT FOR SENDING
                </div>
                {/* <div style={{
                    marginTop: '10px',
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'red'
                }}>
                    Invite  3 or more friends before 20.09 and you will take part in the drawing of 5 NFT
                </div>
                <div style={{
                    marginTop: '10px',
                    fontWeight: 'bold', 
                    fontSize: '20px', 
                    color: 'red'
                }}>
                    {`you invited: ${userData2.ref2}/3`}
                </div> */}
            

                {userData.map((user, index) => (
                    <div key={index}>
                        <div className={"content-frend"}>
                            <div className={"img-frens"}>
                                <PersonFrenSVG />
                            </div>
                            <div className={"text-content"}>
                                <b className={"name-frend"}>
                                    {user.ntg ? user.ntg : user.tg}
                                </b>
                                <div className={"cash-frend"}>
                                    {user.toinvited + 100} $METRO
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </div>
                ))}
            </div>
        </div>
    );

}

export default Frens;
