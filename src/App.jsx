import Modal from 'react-modal'
import Router from '/src/Router.jsx'

function App() {
    Modal.setAppElement('#root')

    return (
        <>
            <Router />
        </>
    )
}

export default App
