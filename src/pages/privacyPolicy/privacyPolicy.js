import PrivacyPolicyField from './PrivacyPolicyField'

export default function PrivacyPolicy() {
	return (
		<div className='privacy-policy'>
			<PrivacyPolicyField
				title='Zbieranie danych'
				mainText='Kiedy zbieramy Twoje dane? Twój email oraz hasło zapisywane są podczas rejestracji na naszej stronie.'
			/>

			<PrivacyPolicyField
				title='Cele przetwarzania danych'
				mainText='Twoje dane zebrane podczas rejestracji przetwarzane są jedynie w celu umożliwienia korzystania ze strony. Nie
				udostępniamy ich nikomu, nie sprzedajemy ich. Rejestracja jest dobrowolna.'
			/>

			<PrivacyPolicyField
				title='Bezpieczeństwo danych'
				mainText='Twoje dane są automatycznie szyfrowane przez usługę firebase od google. Nikt nie ma dostępu do twoich danych.'
			/>

			<PrivacyPolicyField
				title='Usuwanie danych'
				mainText={`Jeśli zrezygnujesz z używania naszej aplikacji w każdym momencie możesz usunąć konto oraz swoje dane
				(settings => account details => delete account).`}
			/>

			<PrivacyPolicyField title='Pozostałe informacje' mainText='W razie jakichkolwiek pytań, prosimy o kontakt' />
		</div>
	)
}
