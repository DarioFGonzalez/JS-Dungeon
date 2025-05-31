import React from 'react';
import { eventLog } from '../types/global';
import './ConsoleTab.css';

interface CtabProps
{
    events: eventLog;
};

const ConsoleTab: React.FC<CtabProps> = ( { events } ) =>
{

    return(
        <div>
            hola
        </div>
    );
}

export default ConsoleTab;