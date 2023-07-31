import '../css/CustomModal.css';

export function CustomModal ({ children, id, onModalToggle }) {
  const handleClick = () => {
    onModalToggle(false);
  };

  return (
    <>
      <div className='modal'>
        <label
          className='modal__bg'
          htmlFor={'modal-' + id}
          onClick={handleClick}
        />
        <div className='modal__inner'>
          <label
            id={'close-modal-' + id}
            className='modal__close'
            htmlFor={'modal-' + id}
            onClick={handleClick}
          />
          <div className='main-content'>{children}</div>
        </div>
      </div>
    </>
  );
}
