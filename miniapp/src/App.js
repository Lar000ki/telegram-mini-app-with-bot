import './App.css';
import Footer from './components/Footer/Footer';
import { useTelegram } from "./hooks/useTelegram";

import Main from './components/Main/Main';
import Frens from './components/Frens/Frens';
import Mission from './components/Mission/Mission';
import Boosts from './components/Boosts/Boosts';

import { Routes, Route } from 'react-router-dom';
import React from "react";
import Block from './components/Block/Block';

function App() {
    const { user, tg } = useTelegram();
    
    const pc = tg.platform;
    
    tg.expand()
    return (
        <div className="App">
            {(
                !
                ((pc == 'android') || (pc == 'ios') || (pc == 'windows_phone'))) ? (
                // ((pc == 'windows_phone'))) ? (
                <Block /> 
            ) : (
                <>
                    <Routes>
                        <Route path={'menu'} element={<Main />} />
                        <Route path={'mission'} element={<Mission />} />
                        <Route path={'boosts'} element={<Boosts />} />
                        <Route path={'frens'} element={<Frens />} />
                    </Routes>
                    <Footer />
                </>
            )}
        </div>
    );
}


export default App;