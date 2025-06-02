import React from 'react';
import { eventLog } from '../types/global';
import './ConsoleTab.css';

interface CtabProps
{
    events: eventLog[];
};

const ConsoleTab: React.FC<CtabProps> = ( { events } ) =>
{

    return(
    <div className="log-window-floating">

        <ul>
        {events.map((log, i) => (
            <li key={i} style={{ color: log.color || 'inherit' }}>
            {log.message}
            </li>
        ))}
        </ul>

    </div>
    );
}

export default ConsoleTab;