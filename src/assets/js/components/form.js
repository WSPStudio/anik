import { body } from "../scripts/core/variables";
import { fadeIn, fadeOut } from "../scripts/other/animation";

/* 
	================================================
	  
	Отправка форм
	
	================================================
*/

export function form() {
	const allForms = document.querySelectorAll('form')

	allForms.forEach(form => {
		if (!form.classList.contains('wpcf7-form')) {
			form.addEventListener('submit', formSend);

			async function formSend(e) {
				e.preventDefault();

				let formData = new FormData(form);

				form.classList.add('sending');
				let response = await fetch('/mail.php', {
					method: 'POST',
					body: formData
				});

				if (response.ok) {
					fadeOut('.popup')

					setTimeout(() => {
						fadeIn('.popup-thank')
					}, 1000);

					setTimeout(() => {
						fadeOut('.popup')
					}, 3000);

					setTimeout(() => {
						body.classList.remove('no-scroll')
					}, 3500);

					form.reset();
				}
			}
		}
	});
}
