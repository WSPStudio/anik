import { fixedElements } from "../scripts/core/variables";
import { headerTop, headerTopFixed } from "../scripts/core/variables";
import { isDesktop } from "../scripts/other/checks";
/* 
	================================================
	  
	Фиксированное меню
	
	================================================
*/

export function fixedMenu() {
	const fixedElementsArray = Array.from(fixedElements);

	let fixedElementsHas = !fixedElementsArray.includes(headerTop);
	if (!headerTop) return;

	const isFixed = isDesktop() && window.scrollY > 180;

	if (isFixed) {
		headerTop.classList.add(headerTopFixed);
		if (fixedElementsHas) fixedElements.push(headerTop);
	} else {
		headerTop.classList.remove(headerTopFixed);
		if (fixedElementsHas) {
			const index = fixedElements.indexOf(headerTop);
			if (index !== -1) {
				fixedElements.splice(index, 1);
			}
		}
	}
}

window.addEventListener('scroll', fixedMenu);
window.addEventListener('resize', fixedMenu);
