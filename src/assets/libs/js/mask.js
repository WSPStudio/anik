window.addEventListener('DOMContentLoaded', () => {
	maskPhone()
})

function maskPhone() {
	const phoneInputs = document.querySelectorAll('[type="tel"]')
	const maskPlus7 = '+7 (___) ___ ____'
	const mask8 = '8 (___) ___ ____'
	const minValidLength = 5
	const minTrimmedLength = 3

	phoneInputs.forEach(input => {
		let keyCode
		const originalPlaceholder = input.placeholder // Сохраняем оригинальный placeholder

		function applyMask(event) {
			if (event.keyCode) keyCode = event.keyCode

			const rawDigits = input.value.replace(/\D/g, '')
			const isDelete = event.inputType === 'deleteContentBackward'

			// Начало только с 7 или 8, остальные игнорируются
			let digits = rawDigits.replace(/^[^78]+/, '')
			let firstDigit = digits.charAt(0)

			let mask
			if (firstDigit === '8') {
				mask = mask8
			} else {
				digits = '7' + digits.slice(1)
				mask = maskPlus7
			}

			let i = 0
			const masked = mask.replace(/[_\d]/g, char => {
				return i < digits.length ? digits[i++] : char
			})

			const firstEmpty = masked.indexOf('_')
			const trimmed = firstEmpty !== -1
				? masked.slice(0, Math.max(firstEmpty, minTrimmedLength))
				: masked

			// Сохраняем позицию курсора при удалении
			if (isDelete) {
				const pos = input.selectionStart
				input.value = trimmed
				setTimeout(() => {
					input.setSelectionRange(pos, pos)
				}, 0)
			} else {
				input.value = trimmed
			}

			// Ошибки
			const errorContainer = input.closest('.input-item') || input
			if (trimmed.length < mask.length) {
				errorContainer.classList.add('error')
			} else {
				errorContainer.classList.remove('error')
			}

			if (event.type === 'blur') {
				if (trimmed.length < minValidLength || trimmed === '+7 (') {
					input.value = ''
					input.placeholder = originalPlaceholder // Восстанавливаем placeholder
				}
			}
		}

		// Показываем маску при фокусе, если поле пустое
		input.addEventListener('focus', function () {
			if (!this.value) {
				this.value = '+7 ('
				this.placeholder = '' // Убираем placeholder при фокусе
				// Устанавливаем курсор после "+7 ("
				setTimeout(() => {
					this.setSelectionRange(4, 4)
				}, 0)
			}
		})

		input.addEventListener('input', applyMask)
		input.addEventListener('keydown', e => keyCode = e.keyCode || e.which)

		input.addEventListener('paste', event => {
			event.preventDefault()
			let pasted = (event.clipboardData || window.clipboardData).getData('text')
			pasted = pasted.replace(/\D/g, '')
			input.value = pasted
			applyMask.call(input, { type: 'input' })
		})

		input.addEventListener('blur', function (e) {
			if (this.value === '+7 (' || this.value.length < minValidLength) {
				this.value = ''
				this.placeholder = originalPlaceholder
			}
		})

		input.addEventListener('change', () => {
			let submitButton = input.closest('form')?.querySelector('[type="submit"]')
			if (!submitButton) return

			const validLength = input.value.startsWith('8') ? mask8.length : maskPlus7.length

			if (input.value.length < validLength) {
				submitButton.setAttribute('disabled', true)
				input.classList.add('error')
			} else {
				submitButton.removeAttribute('disabled')
				input.classList.remove('error')
			}
		})
	})
}
