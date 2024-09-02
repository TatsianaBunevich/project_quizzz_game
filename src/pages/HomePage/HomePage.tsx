import useBoundStore from '../../store/boundStore'
import Blobs from '../../components/Blobs/Blobs'
import Toggle from '../../components/Toggle/Toggle'
import Footer from '../../components/Footer/Footer'
import PathConstants from '../../routes/pathConstants'
import ControlButton from '../../components/ControlButton/ControlButton'
import styles from './HomePage.module.css'

const HomePage = () => {
  const toggleIsPlay = useBoundStore((state) => state.toggleIsPlay)

  return (
    <>
      <Blobs />
      <div className={styles.container}>
        <header>
          <Toggle />
        </header>
        <main>
          <h1>Quizzz Game</h1>
        </main>
        <Footer>
          <ControlButton
            className={styles.startButton}
            to={PathConstants.SETTINGS}
            onClick={toggleIsPlay}
          >
            START
          </ControlButton>
        </Footer>
      </div>
      <div className={styles.contacts}>
        <p>Feeling fun? Got an idea?</p>
        <p>
          <a
            className={styles.contactLink}
            href="https://www.linkedin.com/in/tatsiana-bunevich/"
            target="_blank"
            rel="noreferrer"
          >
            contact the creator
          </a>
        </p>
      </div>
    </>
  )
}

export default HomePage
