import '../css/Circle.css';

export function Circle ({ circleSize = 100, top, left }) {
  return (
    <div
      className='circle'
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '30px',
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        border: 'dashed 2px rgb(203, 202, 202)',
        top,
        left
      }}
    />
  );
}
