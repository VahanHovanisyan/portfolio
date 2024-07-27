// import { langList } from "./langList.js";
import { URL } from "../index.js";
import { rating } from "../index.js";
const buttonRu = document.querySelectorAll(".language__button--ru");
const buttonEng = document.querySelectorAll(".language__button--eng");

let currentLanguage =
	localStorage.getItem("language") ||
	window.location.hash.substring(1) ||
	window.navigator.language.substring(0, 2) ||
	"en";

function changeLanguage(lang) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				fetch(
					`${URL}/api/${entry.target.dataset.langs}?populate=*&locale=${lang}`
				)
					.then((res) => res.json())
					.then(({ data }) => {
						if (entry.target.dataset.langs === "header") {
							const navList = document.querySelector(".nav__list");
							navList.innerHTML = "";
							data.links.forEach((link) => {
								const li = document.createElement("li");
								li.classList.add("nav__item");
								li.innerHTML = `<a class="nav__link link" href="${link.link}">${link.text}</a>`;
								navList.appendChild(li);
							});
						}

						if (entry.target.dataset.langs === "hero") {
							const name = document.querySelector(".hero__name");
							name.textContent = data.name;
							const lastname = document.querySelector(".hero__lastname");
							lastname.textContent = data.lastname;
							const text = document.querySelector(".hero__text");
							text.innerHTML = data.text;
						}

						if (entry.target.dataset.langs === "about") {
							const title = document.querySelector(".about__title");
							title.innerHTML = data.title;
							const text1 = document.querySelector(".about__text");
							text1.innerHTML = data.text;
						}

						if (entry.target.dataset.langs === "portfolio") {
							const title = document.querySelector(".portfolio__title");
							title.textContent = data.title;
							data.portfolioitems.forEach((item, index) => {
								document.querySelectorAll(".portfolio__slide-link")[
									index
								].textContent = item.title;
							});
						}

						if (entry.target.dataset.langs === "skill") {
							const title = document.querySelector(".skills__title");
							title.textContent = data.title;
							const text = document.querySelector(".skills__text");
							text.innerHTML = data.text;
							console.log(data.skillitems);

							document
								.querySelectorAll(".skills__item-title")
								.forEach((card, index) => {
									if (card.textContent === item.title) {
										card.textContent = data.skillitems[index].text;
									}
								});
						}

						if (entry.target.dataset.langs === "contact") {
							const title = document.querySelector(".contacts__title");
							title.textContent = data.title;
							const text = document.querySelector(".contacts__text");
							text.innerHTML = data.text;
							const button = document.querySelector(".contacts__button");
							button.textContent = data.buttontext;
						}

						if (entry.target.dataset.langs === "footer") {
							const text = document.querySelector(".footer__text");
							text.innerHTML = data.text;
						}
					});

				observer.unobserve(entry.target);
			}
		});
	});
	localStorage.setItem("language", lang);
	window.location.hash = lang;
	document.querySelectorAll("[data-langs]").forEach((item) => {
		observer.observe(item);
	});
}

changeLanguage(currentLanguage);

buttonRu.forEach((button, index) => {
	button.classList.toggle("language__button_active", currentLanguage === "ru");

	button.addEventListener("click", () => {
		buttonEng[index].classList.remove("language__button_active");
		button.classList.add("language__button_active");
		changeLanguage("ru");
	});
});

buttonEng.forEach((button, index) => {
	button.classList.toggle("language__button_active", currentLanguage === "en");

	button.addEventListener("click", () => {
		buttonRu[index].classList.remove("language__button_active");
		button.classList.add("language__button_active");
		changeLanguage("en");
	});
});
