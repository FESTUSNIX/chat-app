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
import Dashboard from './pages/dashboard/Dashboard'
import Chat from './pages/chat/Chat'
import Login from './pages/auth/login/Login'
import Signup from './pages/auth/signup/Signup'
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy'
import ResetPassword from './pages/auth/resetPassword/ResetPassword'
import SetNewPassword from './pages/auth/resetPassword/SetNewPassword'
import Chats from './components/Chats/Chats'
import ToolBar from './components/ToolBar/ToolBar'
import Profile from './pages/profile/Profile'
import Settings from './pages/settings/Settings'
import Friends from './pages/friends/Friends'

import MediaQuery from 'react-responsive'
import TabBar from './components/Mobile/TabBar/TabBar'

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
				: setTheme(filterTheme({ name: 'default', isCustom: false }))
		} else if (themes) {
			setTheme(filterTheme({ name: 'default', isCustom: false }))
		}
	}, [themes, currentChat])

	const [showChat, setShowChat] = useState(false)

	// // Admin tools
	// const { addDocument: addTheme } = useFirestore('themes')
	// const { document: adminTheme } = useDocument('themes', 'default')
	// const { document: adminConversation } = useDocument(
	// 	'projects',
	// 	'cM8CaZG73ENA7ABO8AhkIwsRQSl1ZpVutXM9nTMk4zt2m6peODLoOml2'
	// )

	// const addThemeAdmin = async () => {
	// 	try {
	// 		const themeToAdd = {
	// 			id: 'default',
	// 			name: 'default',
	// 			colors: {
	// 				textPrimary: '#d9d9d9',
	// 				buttonColor: '#dedede',
	// 				msgBorder: '#1e1e1e',
	// 				inputBorder: '#1e1e1e',
	// 				msgBg: '#1e1e1e',
	// 				messageColor: '#cacaca',
	// 				textAccent: '#5b3ba5',
	// 				bgDark: '#0e0f10',
	// 				inputBg: '#1e1e1e',
	// 				inputText: '#c4c4c4',
	// 				textLowContrast: '#646464',
	// 				messageColorOwner: '#e8e8e8',
	// 				msgBgOwner: [
	// 					{
	// 						value: '#533e7a',
	// 						id: 0,
	// 					},
	// 					{
	// 						value: '#14545c',
	// 						id: 1,
	// 					},
	// 				],
	// 				msgBorderOwner: '#121212',
	// 				bgSecondary: '#18191b',
	// 			},
	// 			borderRadius: '15',
	// 			isCustom: true,
	// 		}

	// 		await setDoc(doc(projectFirestore, 'themes', themeToAdd.id), themeToAdd)

	// 		console.log('added theme')
	// 	} catch (error) {
	// 		console.log(error.message)
	// 	}
	// }

	return (
		authIsReady &&
		theme && (
			<ThemeProvider theme={theme}>
				<GlobalStyles />

				<div className='App'>
					{/* <button
						style={{ position: 'fixed', top: '0', left: '0', padding: '10px', zIndex: '100000' }}
						onClick={() => addThemeAdmin()}>
						add theme
					</button> */}

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
