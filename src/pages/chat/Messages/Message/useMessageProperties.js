import { useAuthContext } from '../../../../hooks/useAuthContext'

export const useMessageProperties = (message, elements, i) => {
	const { user } = useAuthContext()

	const showSendDatePrev = () => {
		if (elements?.[i] && elements[i - 1]) {
			const value1 = elements[i].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i - 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each message.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when message was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			} else {
				return false
			}
		}
	}

	const showSendDateNext = () => {
		if (elements?.[i + 1] && elements[i]) {
			const value1 = elements[i + 1].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
			const value2 = elements[i].createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

			// Get miliseconds of each message.createdAt
			const date1 = new Date('01/01/2022 ' + value1 + ':00').getTime()
			const date2 = new Date('01/01/2022 ' + value2 + ':00').getTime()

			const minuteDiff = Math.abs(date1 - date2)

			// Check if difference between when message was created is greater than 15 minutes
			if (minuteDiff >= 900000) {
				return true
			} else {
				return false
			}
		}
	}

	const isTop = () => {
		if (
			elements[i + 1] &&
			(!elements[i - 1] ||
				elements[i - 1].createdBy !== message.createdBy ||
				elements[i + 1].response !== null ||
				showSendDatePrev() ||
				message.response !== null) &&
			elements[i + 1].createdBy === message.createdBy &&
			elements[i + 1].response === null &&
			!showSendDateNext()
		) {
			return true
		}

		return false
	}

	const isMiddle = () => {
		if (
			elements[i - 1] &&
			elements[i + 1] &&
			(elements[i - 1].createdBy === message.createdBy || elements[i - 1].response !== null) &&
			elements[i + 1].createdBy === message.createdBy &&
			elements[i + 1].response === null &&
			!showSendDatePrev() &&
			!showSendDateNext()
		) {
			return true
		}

		return false
	}

	const isBottom = () => {
		if (
			elements[i - 1] &&
			elements[i - 1].createdBy === message.createdBy &&
			message.response === null &&
			((!elements[i + 1] && message.response === null) ||
				(elements[i + 1] &&
					(elements[i + 1].response !== null ||
						elements[i + 1].createdBy !== message.createdBy ||
						showSendDateNext()))) &&
			!showSendDatePrev()
		) {
			return true
		}

		return false
	}

	const handleMessageStyle = () => {
		if (isTop()) {
			if (message.createdBy === user.uid) {
				return 'group-top owner'
			} else {
				return 'group-top'
			}
		} else if (isMiddle()) {
			if (message.createdBy === user.uid) {
				return 'group-middle owner'
			} else {
				return 'group-middle'
			}
		} else if (isBottom()) {
			if (message.createdBy === user.uid) {
				return 'group-bottom owner'
			} else {
				return 'group-bottom'
			}
		} else {
			if (message.createdBy === user.uid) {
				return 'owner'
			} else {
				return ''
			}
		}
	}

	return { isTop, isMiddle, isBottom, showSendDatePrev, showSendDateNext, handleMessageStyle }
}
