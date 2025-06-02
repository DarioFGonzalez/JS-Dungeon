interface mapaProp
{
    mapa: string[][];
};


const Board: React.FC<mapaProp> = ( { mapa } ) =>
{
    return(
        <div>
            {mapa}
        </div>
    )
};

export default Board;