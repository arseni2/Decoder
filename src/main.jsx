import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
        <p className={"mt-[-100px]"}>© А. М. Воронов, 2024</p>
    </StrictMode>,
)
