import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { GlobalStyles } from './theme/GlobalStyles'
import styled, { ThemeProvider } from 'styled-components'
import { useCollection } from './hooks/useCollection'

// Styles
import './App.scss'

// Components && Pages
import Dashboard from './pages/dashboard/Dashboard'
import Chat from './pages/chat/Chat'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy'
import ResetPassword from './pages/resetPassword/ResetPassword'
import SetNewPassword from './pages/resetPassword/SetNewPassword'
import Chats from './components/Chats'

function App() {
	const inputRef = useRef(null)

	const { user, authIsReady } = useAuthContext()
	const { documents: themes } = useCollection('themes')

	const [currentChat, setCurrentChat] = useState(null)
	const [theme, setTheme] = useState(themes)

	const filterTheme = themeToSet => {
		let filteredTheme

		if (themeToSet.isCustom === true) {
			if (currentChat.customThemes) {
				currentChat.customThemes.forEach(theme => {
					if (theme.id === themeToSet.name) filteredTheme = theme
				})
			} 
		} else {
			if (themes) {
				themes.forEach(theme => {
					if (theme.id === themeToSet.name) filteredTheme = theme
				})
			}
		}
		return filteredTheme
	}

	useEffect(() => {
		if (currentChat) {
			currentChat.theme
				? setTheme(filterTheme(currentChat.theme))
				: setTheme(filterTheme({ name: 'frosty', isCustom: false }))
		} else if (themes) {
			setTheme(filterTheme({ name: 'frosty', isCustom: false }))
		}
	}, [themes, currentChat])

	return (
		authIsReady &&
		theme && (
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<div className='App'>
					<BrowserRouter>
						{user && <Chats currentChat={currentChat} inputRef={inputRef} />}

						<Switch>
							<Route exact path='/'>
								{!user && <Redirect to='/login' />}
								{user && <Dashboard />}
							</Route>

							<Route path='/u/:id'>
								{!user && <Redirect to='/login' />}
								{user && <Chat setCurrentChat={setCurrentChat} inputRef={inputRef} currentTheme={theme} />}
							</Route>

							<Route path='/privacy-policy'>
								<PrivacyPolicy />
							</Route>

							<Route path='/recover-password'>
								<ResetPassword />
							</Route>

							<Route path='/login'>
								{user && <Redirect to='/' />}
								{!user && <Login />}
							</Route>

							<Route path='/signup'>
								{user && <Redirect to='/' />}
								{!user && <Signup />}
							</Route>

							<Route path='/set-new-password'>
								<SetNewPassword />
							</Route>
						</Switch>
					</BrowserRouter>
				</div>
			</ThemeProvider>
		)
	)
}

export default App
