import {
    MissionSVG,
    BoostsSVG,
    MenuSVG,
    FrensSVG,
    FirMissionSVG,
    SecMissionSVG,
    SendTimeSVG,
    ProfitClickSVG,
    ProfitSendSVG
} from '../assets/AllIcon.jsx'

export const footers = [
    {
        titleLink: "mission",
        img: <MissionSVG />,
        title: "Mission",
    },
    {
        titleLink: "boosts",
        img: <BoostsSVG />,
        title: "Boosts",
    },
    {
        titleLink: "menu",
        img: <MenuSVG />,
        title: "Menu",
    },
    {
        titleLink: "frens",
        img: <FrensSVG />,
        title: "Frens",
    },
]

const timenow = Math.floor(Date.now() / 1000);
export const missions = [
    {
        title: "Daily check in",
        image: <ProfitSendSVG />,
        id: "q3",
        condition: ({ userData, isLoading, checkbutton }) => (
            (timenow >= (userData.q3 + 72000)) || (userData.q3 == null) ? (
                <button className="Check" onClick={() => { checkbutton('3'); }}>
                    {isLoading ? 'Loading...' : '100 $METRO'}
                </button>
            ) : (
                <div className="NO">
                    not now (once every day)
                </div>
            )
        ),
    },
    // {
    //     title: "Invite 3 frens before 20.09",
    //     image: <SecMissionSVG />,
    //     id: "q4",
    //     condition: ({ userData, isLoading, checkbutton }) => (
    //         userData.ref2 >= 3 ? (
    //             <button className="Check" onClick={() => { checkbutton('4'); }}>
    //                 {isLoading ? 'Loading...' : '500 $METRO'}
    //             </button>
    //         ) : (
    //             <div className="NO">
    //                 conditions not met
    //             </div>
    //         )
    //     ),
    // },
    {
        title: "Sub to the news",
        image: <FirMissionSVG />,
        id: "q1",
        condition: ({ isFollow, isLoading, checkbutton }) => (
            isFollow ? (
                <button className="Check" onClick={() => { checkbutton('1'); }}>
                    {isLoading ? 'Loading...' : '500 $METRO'}
                </button>
            ) : (
                <button className="Check" onClick={() => { checkbutton('1'); }}>
                    <a href="https://t.me/metro_coin_news">FOLLOW</a>
                </button>
            )
        ),
    },
    {
        title: "Invite 5 frens",
        image: <SecMissionSVG />,
        id: "q2",
        condition: ({ userData, isLoading, checkbutton }) => (
            userData.ref >= 5 ? (
                <button className="Check" onClick={() => { checkbutton('2'); }}>
                    {isLoading ? 'Loading...' : '500 $METRO'}
                </button>
            ) : (
                <div className="NO">
                    conditions not met
                </div>
            )
        ),
    }
]

export const boosts = [
    {
        id: "b1",
        title: "profit for sending",
        image: <ProfitSendSVG />,
        discription: ({ userData }) => (
            `${50 * userData.b1} $METRO ${userData.b1 >= 8 ? '' : `-> ${50 * (userData.b1 + 1)} $METRO`}`
        ),
        condition: ({ userData, isLoading, buybutton }) => (
            userData.balance >= (userData.b1) ** 2 * 50 ? (
                <button className="Check" onClick={() => { buybutton('1'); }}>
                    {isLoading ? 'Loading...' : `Buy (${(userData.b1) ** 2 * 50} $METRO)`}
                </button>
            ) : (
                <div className="NO">
                    {(userData.b1) ** 2 * 50} $METRO
                </div>
            )
        )
    },
    {
        id: "b2",
        title: "profit per click",
        image: <ProfitClickSVG />,
        discription: ({ userData }) => (
            `${userData.b2} points ${userData.b2 >= 8 ? '' : `-> ${userData.b2 + 1} points`}`
        ),
        condition: ({ userData, isLoading, buybutton }) => (
            userData.balance >= (userData.b2) ** 2 * 50 ? (
                <button className="Check" onClick={() => { buybutton('2'); }}>
                    {isLoading ? 'Loading...' : `Buy (${(userData.b2) ** 2 * 50} $METRO)`}
                </button>
            ) : (
                <div className="NO">
                    {(userData.b2) ** 2 * 50} $METRO
                </div>
            )
        )
    },
    {
        id: "b3",
        title: "sending time",
        image: <SendTimeSVG />,
        discription: ({ userData }) => (
            `${9 - userData.b3}h ${userData.b3 >= 8 ? '' : `-> ${8 - userData.b3}h`}`
        ),
        condition: ({ userData, isLoading, buybutton }) => (
            userData.balance >= (userData.b3) ** 2 * 50 ? (
                <button className="Check" onClick={() => { buybutton('3'); }}>
                    {isLoading ? 'Loading...' : `Buy (${(userData.b3) ** 2 * 50} $METRO)`}
                </button>
            ) : (
                <div className="NO">
                    {(userData.b3) ** 2 * 50} $METRO
                </div>
            )
        )
    },
]