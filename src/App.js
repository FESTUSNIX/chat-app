import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Redirect, Routes, Navigate } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { GlobalStyles } from './theme/GlobalStyles'
import { useCollection } from './hooks/useCollection'
import styled, { ThemeProvider } from 'styled-components'

// Styles
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'

// Components && Pages
import Dashboard from './pages/dashboard/Dashboard'
import Chat from './pages/chat/Chat'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy'
import ResetPassword from './pages/resetPassword/ResetPassword'
import SetNewPassword from './pages/resetPassword/SetNewPassword'
import Chats from './components/Chats/Chats'
import ToolBar from './components/ToolBar/ToolBar'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'


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
						{user && <ToolBar />}
						<Routes>
							<Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
							<Route
								path='/u/:id'
								element={
									user ? (
										[
											<Chats currentChat={currentChat} inputRef={inputRef} key='chats' />,
											<Chat setCurrentChat={setCurrentChat} inputRef={inputRef} currentTheme={theme} key='chat' />,
										]
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route path='/profile/:id' element={user ? <Profile /> : <Navigate to='/' />} />
							<Route path='/settings/*' element={user ? <Settings /> : <Navigate to='/' />} />
							<Route path='/privacy-policy' element={<PrivacyPolicy />} />
							<Route path='/recover-password' element={<ResetPassword />} />
							<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
							<Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
							<Route path='/set-new-password' element={<SetNewPassword />} />
						</Routes>
					</BrowserRouter>
				</div>
			</ThemeProvider>
		)
	)
}

export default App
