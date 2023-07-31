import './App.css';
import { useEffect, useState } from 'react';
import { Circle } from './components/Circle';
import { CursorCircle } from './components/CursorCircle';
import { SettingsModal } from './components/SettingsModal';
import { FinishModal } from './components/FinishModal';

import settingsIcon from './assets/settings.svg';

function App () {
  const localStorageKey = 'userRecords';
  const timerSeconds = 10;

  const [circlePosition, setCirclePosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [difficulty, setDifficulty] = useState({
    id: 0,
    name: 'Difícil',
    milisecondsInterval: 500,
    circleSize: 100,
    difficultyStars: 3
  });

  const [userPoints, setUserPoints] = useState(0);
  const [lastUserPoints, setLastUserPoints] = useState(0);

  const [userRecords, setUserRecords] = useState(() => {
    const savedUserRecords = window.localStorage.getItem(localStorageKey);
    return savedUserRecords !== null
      ? JSON.parse(savedUserRecords)
      : { easy: 0, medium: 0, hard: 0 };
  });

  const [gameActive, setgameActive] = useState(false);
  const [gameTimer, setGameTimer] = useState(timerSeconds);
  const [isInside, setIsInside] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Creación del localstorage
  useEffect(() => {
    window.localStorage.setItem(localStorageKey, JSON.stringify(userRecords));
  }, [userRecords, localStorageKey]);

  // Disminuye cada segundo un punto al timer del juego
  useEffect(() => {
    if (gameActive) {
      const timer = setInterval(() => {
        setGameTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameActive]);

  // Si el timer llega a 0 se llama al modal y se resetea el juego
  useEffect(() => {
    if (gameTimer === 0) {
      setLastUserPoints(userPoints);
      setShowFinishModal(true);
      resetGame();
    }
  }, [gameTimer]);

  // Cocolar los círculos de forma aleatoria cada X intervalo
  useEffect(() => {
    if (gameActive) {
      const interval = setInterval(() => {
        setCirclePosition(getRandomPosition());
      }, difficulty.milisecondsInterval);

      return () => clearInterval(interval);
    }
  }, [gameActive]);

  // Hacer que el círculo rojo siga al cursor
  useEffect(() => {
    if (gameActive) {
      const handleMove = (event) => {
        const { clientX, clientY } = event;
        setMousePosition({ x: clientX, y: clientY });
      };
      window.addEventListener('pointermove', handleMove);

      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [gameActive]);

  // Esconder el cursor
  useEffect(() => {
    document.body.classList.toggle('no-cursor', gameActive);

    return () => document.body.classList.remove('no-cursor');
  }, [gameActive]);

  // En cada movimiento de cursor o cambio de posición de círculo se verifica si está dentro
  useEffect(() => {
    if (gameActive && circlePosition.x !== 0 && circlePosition.y !== 0) {
      setIsInside(checkIsCursorInsideCircle());
    }
  }, [mousePosition, circlePosition]);

  // Si en cada cambio de círculo el cursor se encontraba dentro, se sumará 1 punto
  useEffect(() => {
    if (gameActive && circlePosition.x !== 0 && circlePosition.y !== 0) {
      if (isInside) setUserPoints((prevUserPoints) => prevUserPoints + 1);
    }
  }, [circlePosition]);

  // Actualiza el record del usuario según la dificultad en la que esté
  useEffect(() => {
    const userRecordKey =
      difficulty.id === 1
        ? userRecords.easy
        : difficulty.id === 2
          ? userRecords.medium
          : userRecords.hard;

    if (userPoints > userRecordKey) {
      const difficultyKey =
        difficulty.id === 1 ? 'easy' : difficulty.id === 2 ? 'medium' : 'hard';

      setUserRecords((prevUserRecords) => ({
        ...prevUserRecords,
        [difficultyKey]: userPoints
      }));
    }
  }, [userPoints, difficulty, userRecords]);

  // Obtener una posición random dentro del game-zone y respetando los límites
  function getRandomPosition () {
    const gameZone = document.querySelector('.game-zone');
    const gameZoneRect = gameZone.getBoundingClientRect();

    const width = gameZone.clientWidth;
    const height = gameZone.clientHeight;

    const x = Math.random() * (width - difficulty.circleSize);
    const y = Math.random() * (height - difficulty.circleSize);

    const adjustedX = parseFloat((x + gameZoneRect.left).toFixed(2));
    const adjustedY = parseFloat((y + gameZoneRect.top).toFixed(2));

    return { x: adjustedX, y: adjustedY };
  }

  // Verifica si el círculo del cursor se encuentra dentro del círculo del game-zone
  function checkIsCursorInsideCircle () {
    const circleZone = document.querySelector('.circle');
    const circleZoneRect = circleZone.getBoundingClientRect();
    const circleRadius = circleZoneRect.width / 2;

    const cursorCircle = document.querySelector('.cursor-circle');
    const cursorCircleRect = cursorCircle.getBoundingClientRect();
    const cursorCircleRadius = cursorCircleRect.width / 2;

    const circleCenterX = circleZoneRect.left + circleRadius;
    const circleCenterY = circleZoneRect.top + circleRadius;

    const cursorCircleCenterX = cursorCircleRect.left + cursorCircleRadius;
    const cursorCircleCenterY = cursorCircleRect.top + cursorCircleRadius;

    const distanceX = Math.abs(circleCenterX - cursorCircleCenterX);
    const distanceY = Math.abs(circleCenterY - cursorCircleCenterY);

    const totalDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

    const isCursorInsideCircle =
      totalDistance + cursorCircleRadius <= circleRadius;

    return isCursorInsideCircle;
  }

  function getTotalPossiblePoints () {
    const timer = gameTimer * 1000; // in MS

    const total = Math.floor(timer / difficulty.milisecondsInterval);
    const rest = timer % difficulty.milisecondsInterval === 0;

    return rest ? total - 1 : total;
  }

  function resetGame () {
    setCirclePosition({ x: 0, y: 0 });
    setMousePosition({ x: 0, y: 0 });
    setUserPoints(0);
    setgameActive(false);
    setIsInside(false);
    setGameTimer(timerSeconds);
  }

  const handleGameActive = () => {
    const newGameActive = !gameActive;
    setgameActive(newGameActive);

    if (!newGameActive) resetGame();
  };

  const handleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
  };

  const handleShowFinishModal = (isOpen) => {
    setShowFinishModal(isOpen);
  };

  const handleShowSettingsModal = (isOpen) => {
    setShowSettingsModal(isOpen);
  };

  const handleDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    setShowSettingsModal(!showSettingsModal);
  };

  return (
    <>
      {gameActive && (
        <CursorCircle positionX={mousePosition.x} positionY={mousePosition.y} />
      )}
      {showSettingsModal && (
        <SettingsModal id={1} onSelect={handleDifficulty} onModalToggle={handleShowSettingsModal} />
      )}
      {showFinishModal && (
        <FinishModal id={2} userPoints={lastUserPoints} totalPossiblePoints={getTotalPossiblePoints()} onModalToggle={handleShowFinishModal} />
      )}

      <div className='container'>
        <section className='info-zone'>
          <div className='left'>
            <button className='game-active-btn' onClick={handleGameActive}>
              {gameActive ? 'Detener' : 'Iniciar'}
            </button>
            <div className='timer'>
              <h2>{gameTimer}</h2>
            </div>
            <img
              className={`settings-icon ${gameActive ? 'disabled' : ''}`}
              src={settingsIcon}
              alt='settings'
              onClick={!gameActive ? handleSettingsModal : null}
            />
          </div>
          <div className='right'>
            <header className='diff'>
              <h2>Dificultad: </h2>
              <div className='stars'>
                {Array.from({ length: difficulty.difficultyStars }).map(
                  (_, index) => (
                    <i key={index} className='star-icon fa fa-solid fa-star' />
                  )
                )}
              </div>
            </header>
            <aside className='points'>
              <h2>Puntos: {userPoints}</h2>
              <h2 style={{ color: 'gray' }}>
                Record:{' '}
                {difficulty.id === 1
                  ? userRecords.easy
                  : difficulty.id === 2
                    ? userRecords.medium
                    : userRecords.hard}
              </h2>
            </aside>
          </div>
        </section>

        <section className='game-zone'>
          {circlePosition.x !== 0 && circlePosition.y !== 0 && (
            <Circle
              circleSize={difficulty.circleSize}
              left={circlePosition.x}
              top={circlePosition.y}
            />
          )}
        </section>
      </div>
    </>
  );
}

export default App;
