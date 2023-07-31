export function CursorCircle ({ positionX, positionY }) {
  return (
    <div
      className='cursor-circle'
      style={{
        position: 'absolute',
        backgroundColor: 'red',
        border: '1px solid #fff',
        borderRadius: '50%',
        opacity: '0.7',
        pointerEvents: 'none',
        left: -25,
        top: -25,
        width: 50,
        height: 50,
        transform: `translate(${positionX}px, ${positionY}px)`
      }}
    />
  );
}
