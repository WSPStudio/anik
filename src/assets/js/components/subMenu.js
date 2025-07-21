import { isDesktop } from "../scripts/other/checks";
import { throttle } from "../scripts/core/helpers";
import { offset } from "../scripts/core/helpers";
import { _slideDown, _slideUp } from "../scripts/other/animation"
import { windowWidth } from "../scripts/core/variables";

/* 
	================================================
	  
	Многоуровневое меню
	
	================================================
*/

export function subMenu() {
	subMenuInit()

	let mediaSwitcher = false; // проверка перехода с мобилки на десктоп и обратно
	let isResize;

	function subMenuResize() {

		if (isDesktop()) {
			subMenuInit(isResize = true)

			if (!mediaSwitcher) {
				document.querySelectorAll('.menu-item-arrow').forEach(item => {
					item.classList.remove('active')
					if (item.parentElement.nextElementSibling) {
						item.parentElement.nextElementSibling.classList.remove('active');
						item.parentElement.nextElementSibling.style.display = 'block'
					}
				});

				mediaSwitcher = true
			}
		} else {
			let menuItemHasChildren = document.querySelectorAll('.menu-item-has-children');

			menuItemHasChildren.forEach(item => {
				item.querySelector('.sub-menu-wrapper').style.display = 'block'
				toggleSubMenuVisible(item)
			})

			mediaSwitcher = false
		}
	}

	window.addEventListener('resize', throttle(subMenuResize, 100));

	// инициализация подменю	
	function subMenuInit(isResize = false) {
		let menuItemHasChildren = document.querySelectorAll('.menu-item-has-children');

		menuItemHasChildren.forEach(item => {
			let timeoutId = null;

			if (isDesktop()) {
				item.addEventListener('mouseover', function (e) {
					clearTimeout(timeoutId);
					menuMouseOverInit(item, e, isResize);
				});

				item.addEventListener('focusin', function (e) {
					clearTimeout(timeoutId);
					menuMouseOverInit(item, e, isResize);
				});

				item.addEventListener('mouseout', function (e) {
					// проверка ушла ли мышь в область подменю
					timeoutId = setTimeout(() => {
						if (!item.contains(e.relatedTarget)) {
							item.classList.remove('active');
						}
					}, 300);
				});

				item.addEventListener('focusout', function (e) {
					// Проверяем, ушел ли фокус с элемента и подменю
					timeoutId = setTimeout(() => {
						if (!item.contains(document.activeElement)) {
							item.classList.remove('active');
						}
					}, 500); // Задержка 500 мс
				});
			}

			toggleSubMenuVisible(item, !isDesktop());
		});
	}

	function menuMouseOverInit(item, e, isResize) {

		// закрыть все открытые меню, кроме текущего
		document.querySelectorAll('.menu>.menu-item-has-children').forEach(li => {
			if (li != item) {
				li.classList.remove('active');
			}
		});

		if (isDesktop()) {
			if (!isResize) {
				item.classList.add('active');
			}

			// если это самый верхний уровень, то определить сторону и добавить соответствующий класс 
			if (item.closest('.menu')) {
				if (getPageSideMenu(e) == 'left') {
					item.classList.add('left');
				} else {
					item.classList.add('right');
				}
			}

			if (item == getTargetElementTag(e)) {
				// если нет места, чтобы добавить подменю скраю, то добавить снизу
				if ((getPageSideMenu(e) == 'left' && offset(item).right < item.offsetWidth) || (getPageSideMenu(e) == 'right' && offset(item).left < item.offsetWidth)) {
					item.classList.add('top', 'menu-item-has-children_not-relative');
				}

			}
		}
	}

	// раскрытие подменю при клике на стрелку на мобилке
	let menuItemArrow = document.querySelectorAll('.menu-item-arrow');
	let isClicked = false

	menuItemArrow.forEach(item => {
		item.addEventListener('click', function (e) {
			e.preventDefault()
			if (!isDesktop()) {
				if (!isClicked) {
					isClicked = true

					if (!item.classList.contains('active')) {
						item.classList.add('active')
						item.parentElement.nextElementSibling.classList.add('active');
						_slideDown(item.parentElement.nextElementSibling, 200)
					} else {
						item.classList.remove('active')
						item.parentElement.nextElementSibling.classList.remove('remove');
						_slideUp(item.parentElement.nextElementSibling, 200)
					}

					setTimeout(() => {
						isClicked = false
					}, 300);
				}
			}
		});
	})

	// Клик по пустой области раскрывает подменю
	document.querySelectorAll('.menu-item-has-children > a').forEach(link => {
		link.addEventListener('click', function (e) {
			let textNode = link.childNodes[0];
			let textRange = document.createRange();
			textRange.selectNodeContents(textNode);
			let textRect = textRange.getBoundingClientRect();

			if (e.clientX >= textRect.left && e.clientX <= textRect.right && e.clientY >= textRect.top && e.clientY <= textRect.bottom) {
				return;
			}

			e.preventDefault();
			let arrow = link.querySelector('.menu-item-arrow');
			if (arrow) arrow.click();
		});
	});

	// переключение видимости подменю
	function toggleSubMenuVisible(item, state = true) {
		let subMenu = item.querySelectorAll('.sub-menu-wrapper');
		subMenu.forEach(element => {
			element.style.display = state ? 'none' : 'block'
		});
	}

	// тег элемента, над которым курсор
	function getTargetElementTag(e) {
		return e.target.parentElement.tagName == "LI" ? e.target.parentElement : e.target
	}

	// сторона страницы
	function getPageSideMenu(e) {
		return e.target.closest('.menu') ? offset(e.target.closest('.menu>.menu-item-has-children')).left > (windowWidth / 2) ? 'right' : 'left' : 'left'
	}
}

