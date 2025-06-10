
import { body, menu, menuActive, menuLink, headerTop, bodyOpenModalClass } from "../scripts/core/variables"
import { throttle, closeOutClick } from '../scripts/core/helpers'
import { isDesktop, haveScroll, isMobile } from "../scripts/other/checks"
import { changeScrollbarGutter, changeScrollbarPadding, hideScrollbar, showScrollbar } from "../scripts/other/scroll"

/* 
	================================================
	  
	Бургер
	
	================================================
*/

export function burger() {
	if (menuLink) {
		let marginTop = 0
		let isAnimating = false
		let headerFixed = headerTop.querySelector('.header-fixed');

		menuLink.addEventListener('click', function (e) {
			if (isAnimating) return
			isAnimating = true


			marginTop = headerFixed.getBoundingClientRect().height + headerFixed.getBoundingClientRect().y
			menuLink.classList.toggle('active')
			menu.style.marginTop = marginTop + 'px'
			menu.classList.toggle(menuActive)

			if (menu.classList.contains(menuActive)) {
				hideScrollbar();
			} else {
				setTimeout(() => {
					showScrollbar();
				}, 400);
			}

			setTimeout(() => {
				isAnimating = false
			}, 500)
		})

		function checkHeaderOffset() {
			if (isMobile()) {
				changeScrollbarPadding(false)
			} else {
				if (body.classList.contains(bodyOpenModalClass)) {
					changeScrollbarPadding()
				}
			}

			if (isDesktop()) {
				menu.removeAttribute('style')
			} else {
				if (marginTop != headerFixed.getBoundingClientRect().height) {
					menu.style.marginTop = headerTop.getBoundingClientRect().height + 'px'
				}
			}
		}

		window.addEventListener('resize', throttle(checkHeaderOffset, 50))
		window.addEventListener('resize', throttle(checkHeaderOffset, 150))

		if (document.querySelector('.header__mobile')) {
			closeOutClick('.header__mobile', '.menu-link', 'active')
		}
	}
}
