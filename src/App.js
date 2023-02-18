import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'
import { GlobalStyles } from './theme/GlobalStyles'
import { useCollection } from './hooks/useCollection'
import { ThemeProvider } from 'styled-components'

// Styles
import './App.scss'
import 'react-toastify/dist/ReactToastify.css'

// Components && Pages
import MediaQuery from 'react-responsive'
import Dashboard from './pages/dashboard/Dashboard'
import Chat from './pages/chat/Chat'
import Login from './pages/auth/login/Login'
import Signup from './pages/auth/signup/Signup'
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy'
import ResetPassword from './pages/auth/resetPassword/ResetPassword'
import SetNewPassword from './pages/auth/resetPassword/SetNewPassword'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'
import Friends from './pages/friends/Friends'
import { Loader, TabBar, Chats, ToolBar } from './components'

function App() {
	const inputRef = useRef(null)

	const { user, authIsReady } = useAuthContext()
	const { documents: themes } = useCollection('themes')

	const [currentChat, setCurrentChat] = useState(null)
	const [theme, setTheme] = useState(themes)

	const filterTheme = themeToSet => {
		if (themeToSet.isCustom) {
			return currentChat?.customThemes?.filter(theme => theme.id === themeToSet.name)[0]
		}

		return themes?.filter(theme => theme.id === themeToSet.name)[0]
	}

	useEffect(() => {
		setTheme(filterTheme(currentChat?.theme ?? { name: 'default', isCustom: false }))
	}, [themes, currentChat])

	const [showChat, setShowChat] = useState(false)

	if (!theme) {
		return <Loader />
	}

	return (
		authIsReady &&
		theme && (
			<ThemeProvider theme={theme}>
				<GlobalStyles />
				<div className={`App ${window?.process?.type ? 'electron-app' : ''}`}>
					<BrowserRouter>
						<MediaQuery minWidth={769}>{user && <ToolBar />}</MediaQuery>
						<Routes>
							<Route path='/' element={user ? <Dashboard /> : <Navigate to='/login' />} />
							<Route
								path='/u/:id'
								element={
									user ? (
										[
											<Chats currentChat={currentChat} inputRef={inputRef} key='chats' setShowChat={setShowChat} />,
											<Chat
												setCurrentChat={setCurrentChat}
												inputRef={inputRef}
												currentTheme={theme}
												key='chat'
												showChat={showChat}
												setShowChat={setShowChat}
											/>
										]
									) : (
										<Navigate to='/' />
									)
								}
							/>
							<Route
								path='/u/'
								element={
									<div className='no-chats absolute-center '>
										<h2>no chats yet</h2>
										<Link to='/friends/'>
											<button className='btn btn--secondary'>add friends</button>
										</Link>
									</div>
								}
							/>
							<Route path='/profile/:id' element={user ? <Profile /> : <Navigate to='/' />} />
							<Route path='/friends' element={user ? <Friends /> : <Navigate to='/' />} />
							<Route path='/settings/*' element={user ? <Settings /> : <Navigate to='/' />} />
							<Route path='/privacy-policy' element={<PrivacyPolicy />} />
							<Route path='/recover-password' element={<ResetPassword />} />
							<Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
							<Route path='/signup' element={user ? <Navigate to='/' /> : <Signup />} />
							<Route path='/set-new-password' element={<SetNewPassword />} />
						</Routes>

						<MediaQuery maxWidth={768}>{user && <TabBar />}</MediaQuery>
					</BrowserRouter>
				</div>
			</ThemeProvider>
		)
	)
}

export default App
