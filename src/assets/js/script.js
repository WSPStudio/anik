
import './scripts/init.js';
import './scripts/components.js';


//
//
//
//
// Общие скрипты


// Меню в подвале
document.addEventListener('DOMContentLoaded', function () {
	const menu = document.querySelector('.footer__menu');

	if (!menu) return;

	menu.querySelectorAll('li > a').forEach(link => {
		const submenu = link.nextElementSibling;

		if (submenu && submenu.classList.contains('sub-menu')) {
			link.addEventListener('click', function (e) {
				e.preventDefault();

				menu.querySelectorAll('.sub-menu').forEach(sm => {
					if (sm !== submenu) sm.classList.remove('active');
				});
				menu.querySelectorAll('li > a').forEach(a => {
					if (a !== link) a.classList.remove('active');
				});

				submenu.classList.toggle('active');
				link.classList.toggle('active');
			});
		}
	});
});

