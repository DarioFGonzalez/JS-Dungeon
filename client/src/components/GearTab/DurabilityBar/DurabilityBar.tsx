interface DurabilityBarProps
{
    actual: number,
    total: number,
    slot: string
}

const DurabilityBar: React.FC<DurabilityBarProps> = ({ actual, total, slot }) => {
  const porcentaje = (actual / total) * 100;
  
  const barColor = porcentaje > 50 ? '#4caf50' : porcentaje > 20 ? '#ffeb3b' : '#f44336';

  return (
    <div style={{ width: '100px', height: '12px', border: '2px solid #000', background: '#333', position: 'relative' }}>
      <div style={{ 
        width: `${porcentaje}%`, 
        height: '100%', 
        backgroundColor: barColor,
        transition: 'width 0.5s ease-in-out'
      }} />
      <small style={{ position: 'absolute', top: '-2px', width: '100%', textAlign: 'center', color: '#fff', fontSize: '10px', textShadow: '1px 1px #000' }}>
        {actual}/{total}
      </small>
    </div>
  );
};

export default DurabilityBar;