export const useDates = () => {
	let today = new Date().toLocaleDateString()
	let weekday = []
	let dayOfMonth, dayOfWeek, month, year, hour, curDate

	const isCurrentWeek = date => {
		let lastMonday = new Date() // Creating new date object for today
		lastMonday.setDate(lastMonday.getDate() - (lastMonday.getDay() - 1)) // Setting date to last monday
		lastMonday.setHours(0, 0, 0, 0) // Setting Hour to 00:00:00:00

		const res = lastMonday.getTime() <= date.getTime() && date.getTime() < lastMonday.getTime() + 604800000

		return res
	}

	const formatDate = comment => {
		const date = comment.createdAt.toDate()

		weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
		dayOfWeek = weekday[date.getDay()]

		year = date.getFullYear()

		month = date.getMonth() + 1 < 10 ? '0' + date.getMonth() + 1 : date.getMonth() + 1

		dayOfMonth = date.getDate() < 10 ? '0' + date.getDate().toString() : date.getDate().toString()

		curDate = `${dayOfMonth}/${month}/${year}`
		hour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

		if (curDate === today) {
			return hour
		} else if (curDate !== today) {
			return `${dayOfWeek}. ${hour}`
		} else if (!isCurrentWeek(date)) {
			return `${dayOfMonth}.${month}.${year}, ${hour}`
		}
	}

	return { formatDate, dayOfMonth, dayOfWeek, month, year, hour, curDate }
}
