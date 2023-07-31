import '../css/SettingsModal.css';
import { CustomModal } from './CustomModal';
import { useEffect, useState } from 'react';

import difficulties from '../data/difficulties.json';

export function SettingsModal ({ id, onSelect, onModalToggle }) {
  const starIcon = 'star-icon fa fa-solid fa-star';
  const downArrowIcon = 'down-arrow-icon fa fa-solid fa-arrow-down';

  const [gameSettings, setGameSettings] = useState([]);

  useEffect(() => {
    setGameSettings(difficulties);
  }, []);

  const handleClick = (item) => {
    onSelect({
      id: item.id,
      name: item.name,
      milisecondsInterval: item.milisecondsInterval,
      circleSize: item.circleSize,
      difficultyStars: item.difficultyStars
    });
  };

  return (
    <CustomModal
      id={id}
      onModalToggle={(isOpen) => {
        onModalToggle(isOpen);
      }}
    >
      <div className='settings-container'>
        <h2 className='title'>Seleccionar dificultad</h2>

        {gameSettings &&
          gameSettings.map((item) => (
            <div key={item.id} className='difficulty-box' tabIndex='0'>
              <aside>
                {Array.from({ length: item.difficultyStars }).map(
                  (_, index) => (
                    <i key={index} className={starIcon} />
                  )
                )}
              </aside>
              <p style={{ fontSize: '20px' }}>{item.name}</p>
              <div className='additional-content'>
                <h4>Velocidad</h4>
                <p>{item.milisecondsInterval / 1000} seg.</p>
                <h4>Círculos</h4>
                <p>{item.circleDescription}</p>
                <label
                  className='difficulty-btn'
                  htmlFor={'modal-' + id}
                  onClick={() => handleClick(item)}
                >
                  Seleccionar
                </label>
              </div>
              <i className={downArrowIcon} />
            </div>
          ))}
      </div>
    </CustomModal>
  );
}
