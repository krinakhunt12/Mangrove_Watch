import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            "/api": "https://mangrove-watch.onrender.com"
        }, // <-- missing comma fixed here
        host: "0.0.0.0", // required to expose to external devices
        allowedHosts: [
            "9c7178feddea.ngrok-free.app" // add your ngrok domain here
        ]
    }
})