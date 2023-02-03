import { useState } from 'react'
import { useAuthContext } from '../../../../../hooks/useAuthContext'
import { toast, ToastContainer } from 'react-toastify'
import { linkWithCredential, PhoneAuthProvider, updatePhoneNumber } from 'firebase/auth'
import { projectAuth } from '../../../../../firebase/config'
import { useLogin } from '../../../../../hooks/useLogin'

// Styles
import 'react-phone-input-2/lib/bootstrap.css'

// Components
import Loader from '../../../../../components/Loader/Loader'
import Modal from '../../../../../components/Modal/Modal'
import PhoneInput from 'react-phone-input-2'
import Field from '../../../../../components/Inputs/Field/Field'

const PhoneNumber = () => {
	const { user } = useAuthContext()
	const { setUpRecaptcha } = useLogin()

	const [error, setError] = useState('')
	const [isPending, setIsPending] = useState(false)

	const [phoneNumber, setPhoneNumber] = useState('')
	const [show, setShow] = useState(false)
	const [confirmUnlink, setConfirmUnlink] = useState(false)

	const [showOTP, setShowOTP] = useState(false)
	const [captchaResponse, setCaptchaResponse] = useState('')
	const [OTPCode, setOTPCode] = useState('')

	const notify = message =>
		toast.success(message, {
			position: 'bottom-right',
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: 'dark',
		})

	const unlinkPhoneNumber = () => {
		const provider = new PhoneAuthProvider(projectAuth)

		user.unlink(provider.providerId)
		notify('Successfully unlinked phone number')
	}

	const handleOTPInput = e => {
		const limit = 6
		setOTPCode(e.target.value.slice(0, limit))
	}

	const sendOTP = async () => {
		console.log(`${phoneNumber}`)
		setError(null)
		if (phoneNumber === '' || phoneNumber === undefined || phoneNumber === null) {
			setError('Please enter a valid Phone Number!')
			return
		}

		try {
			const response = await setUpRecaptcha(`+${phoneNumber}`)

			setCaptchaResponse(response)
			setShowOTP(true)
		} catch (err) {
			setError(err.message)
			console.log(err.message)
		}
	}

	const verifyOTP = async () => {
		if (OTPCode === '' || OTPCode === null) return

		try {
			setError(null)
			setIsPending(true)

			const authCredential = PhoneAuthProvider.credential(captchaResponse, OTPCode)

			if (user.phoneNumber === null || user.phoneNumber === undefined) {
				await linkWithCredential(user, authCredential)
			} else {
				await updatePhoneNumber(user, authCredential)
			}

			setIsPending(false)
			setShow(false)
			setShowOTP(false)
			setPhoneNumber('')
			setOTPCode('')
			setCaptchaResponse('')
			notify('Successfully changed phone number')
		} catch (err) {
			console.log(err.message)
			setError(err.message)
			setIsPending(false)
		}
	}

	return (
		<div className='account-details__details-field'>
			<ToastContainer />
			<h3>phone</h3>
			<p>{user.phoneNumber ? user.phoneNumber : "You haven't added a phone number yet"}</p>

			<div className='flex-row'>
				{/* <i className='fa-solid fa-pencil' onClick={() => setShow(true)}>
                <Tooltip>Edit</Tooltip>
            </i> */}
				{user.phoneNumber && (
					<button className='btn' onClick={() => setConfirmUnlink(true)}>
						remove
					</button>
				)}
				<button className='btn btn--secondary' onClick={() => setShow(true)}>
					{user.phoneNumber ? 'edit' : 'add'}
				</button>
			</div>

			<Modal show={confirmUnlink} setShow={() => setConfirmUnlink(false)}>
				<h3 className='mb05'>Remove phone number</h3>
				<p>Are you sure you want to remove your phone number from this account?</p>

				{/* // !! Require password for remove */}

				<div className='btn-group'>
					<button className='btn btn--secondary' onClick={() => setConfirmUnlink(false)}>
						cancel
					</button>
					<button className='btn' onClick={() => unlinkPhoneNumber()}>
						remove
					</button>
				</div>
			</Modal>

			<Modal
				show={show}
				setShow={() => setShow(false)}
				onClose={() => {
					setIsPending(false)
					setShow(false)
					setShowOTP(false)
					setPhoneNumber('')
					setOTPCode('')
					setCaptchaResponse('')
				}}>
				{!showOTP && (
					<>
						<h3 className='mb05'>Enter a phone number</h3>
						<p>You will recive a message containing a verification code.</p>

						<label>
							<p>Your new phone number</p>
							<PhoneInput
								country={'pl'}
								value={phoneNumber}
								onChange={setPhoneNumber}
								enableSearch={true}
								dropdownClass='custom-scrollbar'
								copyNumbersOnly={false}
								searchPlaceholder='Search for countries'
							/>
						</label>
						{isPending && <Loader />}
						{error && <div className='error'>{error}</div>}
						<div id='recaptcha-container' />

						<div className='btn-group'>
							<button className='btn btn--secondary' onClick={() => setShow(false)}>
								cancel
							</button>
							<button className='btn' onClick={() => sendOTP()}>
								Send code
							</button>
						</div>
					</>
				)}

				{showOTP && (
					<>
						<h3 className='mb05'>OTP Verification</h3>
						<p>
							Enter the OTP sent to <span style={{ fontWeight: 'bold' }}>+{phoneNumber}</span>
						</p>

						<label className='otp-code'>
							{/* <input type='number' value={OTPCode} onChange={e => handleOTPInput(e)} /> */}
							<Field value={OTPCode} setValue={setOTPCode} onChange={e => handleOTPInput(e)} type='number' />
						</label>
						{error && <div className='error'>{error}</div>}

						<div className='btn-group'>
							<button className='btn btn--secondary' onClick={() => setShowOTP(false)}>
								go back
							</button>
							<button className='btn' onClick={() => verifyOTP()}>
								Change number
							</button>
						</div>
					</>
				)}
			</Modal>
		</div>
	)
}

export default PhoneNumber
