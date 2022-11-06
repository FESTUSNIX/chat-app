import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext'

// Styles
import './App.scss'

// Components && Pages
import Dashboard from './pages/dashboard/Dashboard'
import Chat from './pages/chat/Chat'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import PrivacyPolicy from './pages/privacyPolicy/privacyPolicy'
import ResetPassword from './pages/login/ResetPassword'
import Chats from './components/Chats'

function App() {
	const { user, authIsReady } = useAuthContext()

	return (
		<div className='App'>
			{authIsReady && (
				<BrowserRouter>
					{user && <Chats />}

					<Switch>
						<Route exact path='/'>
							{!user && <Redirect to='/login' />}
							{user && <Dashboard />}
						</Route>

						<Route path='/projects/:id'>
							{!user && <Redirect to='/login' />}
							{user && <Chat />}
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
					</Switch>
				</BrowserRouter>
			)}
		</div>
	)
}

export default App
