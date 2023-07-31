import '../css/FinishModal.css';
import { CustomModal } from './CustomModal';

export function FinishModal ({ id, userPoints, totalPossiblePoints, onModalToggle }) {
  return (
    <CustomModal
      id={id}
      onModalToggle={(isOpen) => {
        onModalToggle(isOpen);
      }}
    >
      <div className='finish-container'>
        <h2 className='title'>Fin del juego</h2>

        <h3>Puntos</h3>
        <div className='points'>
          <p className='user-points'>{userPoints}</p><p className='total-possible-points'>/{totalPossiblePoints}</p>
        </div>
      </div>
    </CustomModal>
  );
}
