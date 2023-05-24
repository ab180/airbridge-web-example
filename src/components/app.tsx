import airbridge from 'airbridge-web-sdk-loader'
import { useEffect, useState } from 'react'
import { extract, optional } from 'tyfell'
import { AIRBRIDGE_TOKEN } from '../constants/airbridge_token'
import { AppContext } from '../entities/app_context'
import '../styles/app.css'

function App() {
    const [context, setContext] = useState<AppContext | undefined>()

    useEffect(() => {
        // To use your app and webToken, comment this part
        // ---
        const url = new URL(window.location.href)
        const app = (
            optional.actual(url.searchParams.get('app'), 'exabr')
        )
        if (app === undefined) {
            setContext(undefined)
            return
        }

        setContext({
            app,
            webToken: AIRBRIDGE_TOKEN[app],
        })
        // ---

        // To use your app and webToken, uncomment this part
        // ---
        // setContext({
        //     app: 'YOUR_APP',
        //     webToken: 'YOUR_WEB_TOKEN',
        // })
        // ---
    }, [])

    useEffect(() => {
        if (context === undefined) {
            return
        }

        airbridge.init({
            app: context.app,
            webToken: context.webToken,
        })
    }, [context])

    const trackEvent = (category: string) => {
        airbridge.events.send(category)
    }

    const openDeeplink = (url: URL) => {
        airbridge.openDeeplink({
            type: 'click',
            deeplinks: {
                ios: url.href,
                android: url.href,
                desktop: 'https://airbridge.io',
            },
            fallbacks: {
                ios: 'itunes-appstore',
                android: 'google-play',
            },
        })
    }

    return context !== undefined ? (
        <div className="App">
            <header className="App-header">
                <p>Airbridge Web Example ({context.app})</p>
                <button onClick={() => {
                    trackEvent('example-event')
                }}>Track Event</button>
                { extract(window, 'AirbridgeNative') === undefined ? (
                    <button onClick={() => {
                        openDeeplink(new URL(`${context.app}://deeplink`)!)
                    }}>Open Deeplink</button>
                ) : undefined }
            </header>
        </div>
    ) : (
        <div className="App">
            <header className="App-header">
                <p>Airbridge Web Example (Select)</p>
                <button onClick={() => {
                    window.location.search = '?app=exabr'
                }}>exabr</button>
            </header>
        </div>
    )
}

export default App
