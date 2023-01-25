// Styles & assets
import './AuthTemplate.scss'
import logo from '../../assets/logo-no-bg.png'

const AuthTemplate = ({ children }) => {
	return (
		<div className='auth'>
			<div className='wrapper'>
				<div className='auth__logo'>
					<img src={logo} alt='someapp logo' />
					<h1>Someapp</h1>
				</div>
				<div className='auth__background-canvas'>
					<div className='auth__background-canvas-container'>
						<svg id='visual' viewBox='0 0 1920 1080' version='1.1' className='one'>
							<g transform='translate(1920, 0)'>
								<path
									d='M0 756C-87 722 -174.1 688.1 -272.9 658.7C-371.6 629.4 -482.1 604.7 -534.6 534.6C-587.1 464.4 -581.6 348.9 -608.8 252.2C-636.1 155.5 -696 77.8 -756 0L0 0Z'
									fill='#1d1f20'></path>
							</g>
						</svg>
						<svg id='visual' viewBox='0 0 1920 1080' version='1.1' className='two'>
							<g transform='translate(0, 1080)'>
								<path
									d='M0 -756C92.7 -731.4 185.5 -706.7 279.4 -674.4C373.2 -642.1 468.2 -602.2 534.6 -534.6C600.9 -466.9 638.6 -371.5 670.7 -277.8C702.9 -184.1 729.4 -92.1 756 0L0 0Z'
									fill='#1d1f20'></path>
							</g>
						</svg>
					</div>
				</div>

				<div className='auth__form'>{children}</div>
			</div>
		</div>
	)
}

export default AuthTemplate
